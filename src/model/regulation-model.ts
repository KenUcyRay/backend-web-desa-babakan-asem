export interface RegulationRequest {
  title: string;
  year?: number;
}

export interface RegulationResponse {
  id: number;
  title: string;
  year: number;
  filePath: string;
  fileName: string;
  fileSize: number | null; // Changed from bigint to number for JSON serialization
  createdAt: Date;
  updatedAt: Date;
}

export interface RegulationUpdateRequest {
  title?: string;
  year?: number;
}