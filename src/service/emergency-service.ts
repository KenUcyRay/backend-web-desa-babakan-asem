import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import {
  CreateEmergencyRequest,
  QueryEmergencyRequest,
} from "@/model/emergency-model";
import { UserResponse } from "@/model/user-model";
import { EmergencyValidation } from "@/validation/emergency-validation";
import { Validation } from "@/validation/validation";

export class EmergencyService {
  static async getAll(query: QueryEmergencyRequest) {
    query = Validation.validate(EmergencyValidation.query, query);
    const emergencies = await prismaClient.emergency.findMany({
      where: {
        is_handled: query.is_handled,
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (query.page! - 1) * query.limit!,
      take: query.limit,
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

    const totalPage = await prismaClient.emergency.count({
      where: {
        is_handled: query.is_handled,
      },
    });

    return {
      page: query.page,
      limit: query.limit,
      total_page: Math.ceil(totalPage / query.limit!),
      data: emergencies,
    };
  }
  static async create(user: UserResponse, body: CreateEmergencyRequest) {
    body = Validation.validate(EmergencyValidation.create, body);

    const emergency = await prismaClient.emergency.create({
      data: {
        user_id: user.id,
        phone_number: body.phone_number,
        message: body.message,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        emergency_change: user.emergency_change - 1,
      },
    });

    return { data: emergency };
  }
  static async update(id: string) {
    const emergency = await prismaClient.emergency.findUnique({
      where: { id },
    });

    if (!emergency) {
      throw new ResponseError(404, "Emergency tidak di temukan");
    }

    const updatedEmergency = await prismaClient.emergency.update({
      where: { id },
      data: {
        is_handled: true,
      },
    });

    await prismaClient.user.update({
      where: { id: emergency.user_id },
      data: {
        emergency_change: 3,
      },
    });

    return { data: updatedEmergency };
  }
  static async delete(id: string) {
    const emergency = await prismaClient.emergency.findUnique({
      where: { id },
    });

    if (!emergency) {
      throw new ResponseError(404, "Emergency tidak di temukan");
    }

    await prismaClient.emergency.delete({
      where: { id },
    });
  }
  static async count() {
    const isNotHandled = await prismaClient.emergency.count({
      where: { is_handled: false },
    });

    const isHandled = await prismaClient.emergency.count({
      where: { is_handled: true },
    });

    return {
      data: {
        is_not_handled: isNotHandled,
        is_handled: isHandled,
      },
    };
  }
}
