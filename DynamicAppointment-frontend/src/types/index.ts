export interface Professional {
  id: number;
  name: string;
  email: string;
  status: string;
  services: ServiceSummary[];
  startTime: string;
  endTime: string;
}

export interface ServiceSummary {
  id: number;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
}

export interface BusinessService {
  id: number;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  cleanupMinutes: number;
  price: number;
  status: string;
  professionals: ProfessionalSummary[];
}

export interface ProfessionalSummary {
  id: number;
  name: string;
  email: string;
  status: string;
}

export interface Slot {
  startTime: string;
  endTime: string;
}

export interface AppointmentRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  professionalId: number;
  serviceId: number;
  scheduledAt: string;
}

export interface AppointmentResponse {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  professional: ProfessionalSummary;
  service: ServiceSummary;
  scheduledAt: string;
  status: string;
  accessToken: string;
  createdAt: string;
  updatedAt: string;
}
