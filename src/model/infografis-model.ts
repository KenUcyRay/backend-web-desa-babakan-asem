import { StatusDesa } from "@prisma/client";

export interface IdmCreateRequest {
  year: number;
  skor: number;
}

export interface IdmUpdateRequest {
  year?: number;
  skor?: number;
}

export interface BansosCreateRequest {
  name: string;
  amount: number;
}

export interface BansosUpdateRequest {
  name?: string;
  amount?: number;
}

export interface PendudukUpdateRequest {
  amount: number;
}

export interface SdgsCreateRequest {
  name: string;
  progress: number;
}

export interface SdgsUpdateRequest {
  progress: number;
}

export interface ExtraIdmUpdateRequest {
  status_desa?: StatusDesa;
  sosial?: number;
  ekonomi?: number;
  lingkungan?: number;
}
