import { StatusDesa, ExtraIdm } from "@prisma/client";

export interface CreateExtraIdmRequest {
  type?: "sosial" | "ekonomi" | "lingkungan";
  value?: number;
  status_desa?: StatusDesa;
}

export interface ExtraIdmResponse {
  id: string;
  status_desa: StatusDesa;
  sosial: number;
  ekonomi: number;
  lingkungan: number;
  created_at: Date;
  updated_at: Date;
}

export const toExtraIdmResponse = (extraIdm: ExtraIdm): ExtraIdmResponse => {
  return {
    id: extraIdm.id,
    status_desa: extraIdm.status_desa,
    sosial: extraIdm.sosial,
    ekonomi: extraIdm.ekonomi,
    lingkungan: extraIdm.lingkungan,
    created_at: extraIdm.created_at,
    updated_at: extraIdm.updated_at,
  };
};