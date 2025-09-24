import { ResidentType } from "@prisma/client";

export interface QueryResidentRequest {
  type: ResidentType;
}

export interface CreateResidentRequest {
  type: string;
  key: string;
  value: number;
}

export interface UpdateResidentRequest {
  value: number;
}
