export interface CreateContactRequest {
    type: "LOKASI" | "TELEPON" | "WHATSAPP" | "EMAIL";
    label: string;
    value: string;
}

export interface QueryContactRequest {
    page?: number;
    limit?: number;
}