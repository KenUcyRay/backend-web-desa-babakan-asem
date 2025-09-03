export interface CreateEmergencyRequest {
  phone_number: string;
  message: string;
  latitude: string;
  longitude: string;
}

export interface QueryEmergencyRequest {
  page?: number;
  size?: number;
  is_handled?: boolean;
}
