import { prismaClient } from "@/application/database";
import { Validation } from "@/validation/validation";
import { ContactValidation } from "@/validation/contact-validation";
import {
  CreateContactRequest,
  QueryContactRequest,
} from "@/model/contact-model";
import { ResponseError } from "@/error/response-error";

export class ContactService {
  static async getAll(query: QueryContactRequest) {
    query = Validation.validate(ContactValidation.query, query);

    const contacts = await prismaClient.contact.findMany({
      orderBy: { created_at: "desc" },
      skip: ((query.page ?? 1) - 1) * (query.limit ?? 10),
      take: query.limit ?? 10,
    });

    const totalItems = await prismaClient.contact.count();

    return {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      total_page: Math.ceil(totalItems / (query.limit ?? 10)),
      total_items: totalItems,
      data: contacts,
    };
  }

  static async getAllPublic() {
    const contacts = await prismaClient.contact.findMany({
      orderBy: { created_at: "desc" },
    });
    return contacts;
  }

  static async create(body: CreateContactRequest) {
    const validated = Validation.validate(ContactValidation.create, body);

    // Validasi maksimal 4 data total
    const count = await prismaClient.contact.count();
    if (count >= 4) {
      throw new ResponseError(400, "Maksimal 4 kontak sudah tercapai");
    }

    // Validasi unik per type
    const exist = await prismaClient.contact.findUnique({
      where: { type: validated.type },
    });
    if (exist) {
      throw new ResponseError(400, `Kontak ${validated.type} sudah ada`);
    }

    const contact = await prismaClient.contact.create({ data: validated });
    return { message: "Kontak berhasil ditambahkan", data: contact };
  }

  static async update(id: string, body: Partial<CreateContactRequest>) {
    const existing = await prismaClient.contact.findUnique({ where: { id } });
    if (!existing) {
      throw new ResponseError(404, "Kontak tidak ditemukan");
    }

    // inject type dari DB untuk validasi nomor/email
    const validated = Validation.validate(ContactValidation.update, {
      ...body,
      type: existing.type,
    });

    const updated = await prismaClient.contact.update({
      where: { id },
      data: {
        label: validated.label ?? existing.label,
        value: validated.value ?? existing.value,
      },
    });

    return { message: "Kontak berhasil diperbarui", data: updated };
  }

  static async delete(id: string) {
    const existing = await prismaClient.contact.findUnique({ where: { id } });
    if (!existing) {
      throw new ResponseError(404, "Kontak tidak ditemukan");
    }

    await prismaClient.contact.delete({ where: { id } });
    return { message: "Kontak berhasil dihapus" };
  }
}
