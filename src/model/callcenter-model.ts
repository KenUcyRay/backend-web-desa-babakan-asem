export interface CreateCallCenterRequest {
  name: string;
  type: "CALL_CENTER" | "WHATSAPP";
  number: string;
  is_active?: boolean;
}

export interface QueryCallCenterRequest {
  page?: number;
  limit?: number;
}
