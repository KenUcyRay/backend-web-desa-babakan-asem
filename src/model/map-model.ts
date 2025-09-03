import { MapType } from "@prisma/client";

export type coordinates = number[][] | number[];

export interface CreateMapRequest {
  type: MapType;
  name: string;
  description: string;
  year: number;
  coordinates: coordinates;
  icon?: string;
  color?: string;
  area?: number;
  radius?: number;
}

export interface UpdateMapRequest {
  type?: MapType;
  name?: string;
  description?: string;
  year?: number;
  coordinates: coordinates;
  icon?: string;
  color?: string;
  area?: number;
  radius?: number;
}
