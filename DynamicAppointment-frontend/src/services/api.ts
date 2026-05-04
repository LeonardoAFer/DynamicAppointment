import axios from 'axios';
import type {
  Professional,
  BusinessService,
  Slot,
  AppointmentRequest,
  AppointmentResponse,
  ProfessionalRequest,
  BusinessServiceRequest,
  LoginRequest,
  AuthResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('admin_token')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ── Public (guest) ──

export async function getProfessionals(): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>('/professionals');
  return data;
}

export async function getServices(): Promise<BusinessService[]> {
  const { data } = await api.get<BusinessService[]>('/services');
  return data;
}

export async function getAvailableSlots(
  date: string,
  professionalId: number,
  serviceId: number
): Promise<Slot[]> {
  const { data } = await api.get<Slot[]>('/appointments/availability', {
    params: { date, profesionalId: professionalId, serviceId },
  });
  return data;
}

export async function createAppointment(
  request: AppointmentRequest
): Promise<AppointmentResponse> {
  const { data } = await api.post<AppointmentResponse>('/appointments', request);
  return data;
}

export async function getAppointmentByToken(
  token: string
): Promise<AppointmentResponse> {
  const { data } = await api.get<AppointmentResponse>(`/appointments/guest/${token}`);
  return data;
}

export async function cancelAppointmentByToken(
  token: string
): Promise<AppointmentResponse> {
  const { data } = await api.get<AppointmentResponse>(
    `/appointments/guest/${token}/cancel`
  );
  return data;
}

// ── Auth ──

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', request);
  return data;
}

// ── Admin: Professionals ──

export async function createProfessional(request: ProfessionalRequest): Promise<Professional> {
  const { data } = await api.post<Professional>('/professionals', request);
  return data;
}

export async function updateProfessional(id: number, request: ProfessionalRequest): Promise<Professional> {
  const { data } = await api.put<Professional>(`/professionals/${id}`, request);
  return data;
}

export async function deleteProfessional(id: number): Promise<void> {
  await api.delete(`/professionals/${id}`);
}

// ── Admin: Services ──

export async function createService(request: BusinessServiceRequest): Promise<BusinessService> {
  const { data } = await api.post<BusinessService>('/services', request);
  return data;
}

export async function updateService(id: number, request: BusinessServiceRequest): Promise<BusinessService> {
  const { data } = await api.put<BusinessService>(`/services/${id}`, request);
  return data;
}

export async function deleteService(id: number): Promise<void> {
  await api.delete(`/services/${id}`);
}

// ── Admin: Appointments ──

export async function getAppointments(
  professionalId: number,
  startDate: string,
  endDate: string
): Promise<Slot[]> {
  const { data } = await api.get<Slot[]>('/appointments/scheduled', {
    params: { professionalId, startDate, endDate },
  });
  return data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await api.delete(`/appointments/${id}`);
}

export async function getAppointmentById(id: number): Promise<AppointmentResponse> {
  const { data } = await api.get<AppointmentResponse>(`/appointments/${id}`);
  return data;
}
