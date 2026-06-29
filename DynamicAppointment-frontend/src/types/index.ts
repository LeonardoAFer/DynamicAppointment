export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface CategorySummary {
  id: number;
  name: string;
}

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
  category: CategorySummary;
  price: number;
  durationMinutes: number;
}

export interface BusinessService {
  id: number;
  name: string;
  description: string;
  category: CategorySummary;
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

export interface ProfessionalRequest {
  name: string;
  email: string;
  status: string;
  startTime: string;
  endTime: string;
  serviceIds: number[];
}

export interface BusinessServiceRequest {
  name: string;
  description: string;
  categoryId: number;
  durationMinutes: number;
  cleanupMinutes: number;
  price: number;
  status: string;
  professionalIds: number[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
