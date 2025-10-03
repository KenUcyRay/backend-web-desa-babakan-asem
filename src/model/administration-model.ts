import { Pengantar, PengantarType } from "@prisma/client";

export interface PengantarCreateRequest {
  name: string;
  nik: string;
  keterangan: string;
  type: PengantarType;
  phone: string;
}

export interface QueryAdministrationRequest {
  page?: number;
  size?: number;
  isPending?: boolean;
}

export interface AllAdministrationResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: Pengantar[];
}

export const toAllAdministrationResponse = (
  size: number,
  total: number,
  currentPage: number,
  data: Pengantar[]
): AllAdministrationResponse => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data,
  };
};
