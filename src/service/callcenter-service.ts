import { prismaClient } from "@/application/database";
import { Validation } from "@/validation/validation";
import { CallCenterValidation } from "@/validation/callcenter-validation";
import { CreateCallCenterRequest, QueryCallCenterRequest } from "@/model/callcenter-model";
import { ResponseError } from "@/error/response-error";

export class CallCenterService {
  // ✅ Method untuk ADMIN - tampilkan semua data (aktif & nonaktif)
  static async getAll(query: QueryCallCenterRequest) {
    try {
      query = Validation.validate(CallCenterValidation.query, query);

      const callcenters = await prismaClient.callCenter.findMany({
        // ❌ HAPUS filter is_active: true untuk admin
        // where: { is_active: true },
        orderBy: { created_at: "desc" },
        skip: ((query.page ?? 1) - 1) * (query.limit ?? 10),
        take: query.limit ?? 10,
      });

      // ❌ HAPUS filter is_active: true untuk count admin
      const totalItems = await prismaClient.callCenter.count();

      return {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total_page: Math.ceil(totalItems / (query.limit ?? 10)),
        total_items: totalItems,
        data: callcenters,
      };
    } catch (error) {
      throw new ResponseError(400, "Gagal mengambil data call center");
    }
  }

  // ✅ Method baru untuk PUBLIC - hanya tampilkan yang aktif
  static async getAllPublic(query: QueryCallCenterRequest) {
    try {
      query = Validation.validate(CallCenterValidation.query, query);

      const callcenters = await prismaClient.callCenter.findMany({
        where: { is_active: true }, // ✅ Filter hanya yang aktif untuk public
        orderBy: { created_at: "desc" },
        skip: ((query.page ?? 1) - 1) * (query.limit ?? 10),
        take: query.limit ?? 10,
      });

      const totalItems = await prismaClient.callCenter.count({ 
        where: { is_active: true } // ✅ Count hanya yang aktif untuk public
      });

      return {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total_page: Math.ceil(totalItems / (query.limit ?? 10)),
        total_items: totalItems,
        data: callcenters,
      };
    } catch (error) {
      throw new ResponseError(400, "Gagal mengambil data call center");
    }
  }

  static formatNumber(number: string) {
    let num = number.replace(/\s+/g, "");
    if (num.startsWith("+62")) return "0" + num.slice(3);
    if (num.startsWith("62")) return "0" + num.slice(2);
    if (num.startsWith("8")) return "0" + num;
    return num;
  }

  static async create(body: CreateCallCenterRequest) {
    try {
      body.number = this.formatNumber(body.number);

      const validatedData = Validation.validate(CallCenterValidation.create, body);

      // validasi limit
      if (validatedData.type === "CALL_CENTER") {
        const count = await prismaClient.callCenter.count({ where: { type: "CALL_CENTER" } });
        if (count >= 4) throw new ResponseError(400, "Maksimal 4 nomor untuk CALL_CENTER sudah tercapai");
      }
      if (validatedData.type === "WHATSAPP") {
        const count = await prismaClient.callCenter.count({ where: { type: "WHATSAPP" } });
        if (count >= 2) throw new ResponseError(400, "Maksimal 2 nomor untuk WHATSAPP sudah tercapai");
      }

      const callcenter = await prismaClient.callCenter.create({
        data: {
          ...validatedData,
          number: validatedData.number,
          is_active: validatedData.is_active ?? true,
        },
      });

      return { message: "Call Center berhasil ditambahkan", data: callcenter };
    } catch (error) {
      if (error instanceof ResponseError) throw error;
      throw new ResponseError(400, "Gagal menambahkan call center");
    }
  }

  static async update(id: string, body: Partial<CreateCallCenterRequest>) {
    try {
      if (body.number) body.number = this.formatNumber(body.number);

      const validatedData = Validation.validate(CallCenterValidation.update, body);

      const existingCallCenter = await prismaClient.callCenter.findUnique({ where: { id } });
      if (!existingCallCenter) throw new ResponseError(404, "Call Center tidak ditemukan");

      const updated = await prismaClient.callCenter.update({ where: { id }, data: validatedData });

      return { message: "Call Center berhasil diperbarui", data: updated };
    } catch (error) {
      if (error instanceof ResponseError) throw error;
      throw new ResponseError(400, "Gagal memperbarui call center");
    }
  }

  static async delete(id: string) {
    try {
      const existingCallCenter = await prismaClient.callCenter.findUnique({ where: { id } });
      if (!existingCallCenter) throw new ResponseError(404, "Call Center tidak ditemukan");

      await prismaClient.callCenter.delete({ where: { id } });

      return { message: "Call Center berhasil dihapus" };
    } catch (error) {
      if (error instanceof ResponseError) throw error;
      throw new ResponseError(400, "Gagal menghapus call center");
    }
  }
}