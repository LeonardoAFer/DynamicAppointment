import axios from 'axios';
import type {
  Professional,
  BusinessService,
  Slot,
  AppointmentRequest,
  AppointmentResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

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
