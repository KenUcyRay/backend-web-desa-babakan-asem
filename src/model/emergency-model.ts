export interface CreateEmergencyRequest {
  phone_number?: string | null;
  message: string;
  latitude: string;
  longitude: string;
}

export interface QueryEmergencyRequest {
  page?: number;
  limit?: number;
  is_handled?: boolean;
}
