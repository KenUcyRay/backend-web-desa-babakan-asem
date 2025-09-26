import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import {
  CreateEmergencyRequest,
  QueryEmergencyRequest,
} from "@/model/emergency-model";
import { UserResponse } from "@/model/user-model";
import { EmergencyValidation } from "@/validation/emergency-validation";
import { Validation } from "@/validation/validation";
import { getIO } from "@/application/socket";

export class EmergencyService {
  static async getAll(query: QueryEmergencyRequest) {
    try {
      const validatedQuery = Validation.validate(EmergencyValidation.query, query);

      const emergencies = await prismaClient.emergencies.findMany({
        where: {
          is_handled: validatedQuery.is_handled,
        },
        orderBy: {
          created_at: "desc",
        },
        skip: ((validatedQuery.page || 1) - 1) * (validatedQuery.limit || 10),
        take: validatedQuery.limit || 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone_number: true,
              email: true,
            },
          },
        },
      });

      const totalItems = await prismaClient.emergencies.count({
        where: {
          is_handled: validatedQuery.is_handled,
        },
      });

      return {
        page: validatedQuery.page || 1,
        limit: validatedQuery.limit || 10,
        total_page: Math.ceil(totalItems / (validatedQuery.limit || 10)),
        total_items: totalItems,
        data: emergencies,
      };
    } catch (error) {
      console.error("Emergency getAll error:", error);
      throw new ResponseError(500, "Gagal mengambil data emergency");
    }
  }

  static async create(user: UserResponse, body: CreateEmergencyRequest) {
    try {
      console.log("Creating emergency with data:", { user: user.id, body });
      
      // Validate request body
      const validatedBody = Validation.validate(EmergencyValidation.create, body);
      console.log("Validated body:", validatedBody);

      // Get current user data with latest emergency_change value
      const currentUser = await prismaClient.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          phone_number: true,
          emergency_change: true,
          emergency_blocked_until: true,
        },
      });

      if (!currentUser) {
        throw new ResponseError(404, "User tidak ditemukan");
      }

      console.log("Current user:", currentUser);

      // Check if user is blocked
      if (
        currentUser.emergency_blocked_until &&
        currentUser.emergency_blocked_until > new Date()
      ) {
        throw new ResponseError(
          403,
          `Akun diblokir sampai ${currentUser.emergency_blocked_until.toLocaleString()}`
        );
      }

      // Create emergency
      const emergency = await prismaClient.emergencies.create({
        data: {
          user_id: user.id,
          phone_number: validatedBody.phone_number || currentUser.phone_number || null,
          message: validatedBody.message,
          latitude: validatedBody.latitude,
          longitude: validatedBody.longitude,
          is_handled: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone_number: true,
              email: true,
            },
          },
        },
      });

      console.log("Emergency created:", emergency);

      // Emit real-time event for new emergency
      try {
        const io = getIO();
        io.emit('new_emergency', emergency);
        console.log('Socket event emitted: new_emergency');
      } catch (socketError) {
        console.warn('Failed to emit socket event:', socketError);
      }

      // Update user's emergency_change count
      const newChange = Math.max(0, currentUser.emergency_change - 1);
      console.log("Updating emergency_change:", { old: currentUser.emergency_change, new: newChange });
      
      if (newChange <= 0) {
        const blockUntil = new Date(Date.now() + 60000); // 1 minute block
        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            emergency_change: 0,
            emergency_blocked_until: blockUntil,
          },
        });
        console.log("User blocked until:", blockUntil);
      } else {
        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            emergency_change: newChange,
          },
        });
        console.log("User emergency_change updated to:", newChange);
      }

      return { data: emergency };
    } catch (error) {
      console.error("Emergency creation error:", error);
      if (error instanceof ResponseError) throw error;
      
      // Handle specific Prisma errors
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; message?: string };
        if (prismaError.code === 'P2002') {
          throw new ResponseError(400, "Duplicate entry detected");
        }
        if (prismaError.code === 'P2003') {
          throw new ResponseError(400, "Foreign key constraint failed");
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new ResponseError(400, `Gagal membuat laporan emergency: ${errorMessage}`);
    }
  }

  static async update(id: string) {
    try {
      const emergency = await prismaClient.emergencies.findUnique({
        where: { id },
      });

      if (!emergency) {
        throw new ResponseError(404, "Emergency tidak ditemukan");
      }

      const updatedEmergency = await prismaClient.emergencies.update({
        where: { id },
        data: {
          is_handled: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone_number: true,
              email: true,
            },
          },
        },
      });

      // Reset user's emergency_change
      await prismaClient.user.update({
        where: { id: emergency.user_id },
        data: {
          emergency_change: 3,
          emergency_blocked_until: null, // Remove block when emergency is handled
        },
      });

      // Emit real-time event for emergency update
      try {
        const io = getIO();
        io.emit('emergency_updated', updatedEmergency);
        console.log('Socket event emitted: emergency_updated');
      } catch (socketError) {
        console.warn('Failed to emit socket event:', socketError);
      }

      return { data: updatedEmergency };
    } catch (error) {
      console.error("Emergency update error:", error);
      if (error instanceof ResponseError) throw error;
      throw new ResponseError(400, "Gagal mengupdate status emergency");
    }
  }

  static async delete(id: string) {
    try {
      const emergency = await prismaClient.emergencies.findUnique({
        where: { id },
      });

      if (!emergency) {
        throw new ResponseError(404, "Emergency tidak ditemukan");
      }

      await prismaClient.emergencies.delete({
        where: { id },
      });

      // Emit real-time event for emergency deletion
      try {
        const io = getIO();
        io.emit('emergency_deleted', { id });
        console.log('Socket event emitted: emergency_deleted');
      } catch (socketError) {
        console.warn('Failed to emit socket event:', socketError);
      }
    } catch (error) {
      console.error("Emergency delete error:", error);
      if (error instanceof ResponseError) throw error;
      throw new ResponseError(400, "Gagal menghapus emergency");
    }
  }

  static async count() {
    try {
      const isNotHandled = await prismaClient.emergencies.count({
        where: { is_handled: false },
      });

      const isHandled = await prismaClient.emergencies.count({
        where: { is_handled: true },
      });

      return {
        data: {
          is_not_handled: isNotHandled,
          is_handled: isHandled,
        },
      };
    } catch (error) {
      console.error("Emergency count error:", error);
      throw new ResponseError(500, "Gagal menghitung data emergency");
    }
  }
}