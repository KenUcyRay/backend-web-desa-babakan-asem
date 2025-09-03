import fs from "fs/promises";
import path from "path";
import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { CreateMapRequest, UpdateMapRequest } from "@/model/map-model";
import { MapValidation } from "@/validation/map-validation";
import { Validation } from "@/validation/validation";
import { MapType } from "@prisma/client";

export class MapService {
  static async create(body: CreateMapRequest, icon?: Express.Multer.File) {
    const bodyValidation = Validation.validate(MapValidation.createMap, body);

    if (bodyValidation.type === MapType.POLYGON && icon) {
      throw new ResponseError(400, "Icon is not required for polygon maps");
    } else if (bodyValidation.type === MapType.MARKER && !icon) {
      throw new ResponseError(400, "Icon is required for marker maps");
    } else if (icon) {
      bodyValidation.icon = icon.filename;
    } else {
      bodyValidation.icon = undefined;
    }

    const map = await prismaClient.map.create({
      data: bodyValidation,
    });

    return { data: map };
  }
  static async getAll() {
    const maps = await prismaClient.map.findMany({
      orderBy: {
        year: "desc",
      },
    });

    return { data: maps };
  }
  static async delete(id: string) {
    const map = await prismaClient.map.findUnique({
      where: { id },
    });

    if (!map) {
      throw new ResponseError(404, "Map not found");
    }

    await prismaClient.map.delete({
      where: { id },
    });
    if (map.icon) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        map.icon
      );

      await fs.unlink(filePath);
    }
  }
  static async update(
    id: string,
    body: UpdateMapRequest,
    icon?: Express.Multer.File
  ) {
    const map = await prismaClient.map.findUnique({
      where: { id },
    });
    if (!map) {
      throw new ResponseError(404, "Map not found");
    }

    body = Validation.validate(MapValidation.update, body);
    if (icon) {
      body.icon = icon.filename;
    } else {
      body.icon = undefined;
    }

    const updatedMap = await prismaClient.map.update({
      where: { id },
      data: body,
    });

    return { data: updatedMap };
  }
}
