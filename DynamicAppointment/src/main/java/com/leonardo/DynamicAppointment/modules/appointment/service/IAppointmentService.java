package com.leonardo.DynamicAppointment.modules.appointment.service;

import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface IAppointmentService {

    AppointmentResponseDTO create(AppointmentRequestDTO request);

    AppointmentResponseDTO fetch(Long id);

    List<Slot> fetchAppointmentByDate(Long professionalId, LocalDateTime startDate, LocalDateTime endDate);

    AppointmentResponseDTO update(Long id, AppointmentRequestDTO request);

    void delete(Long id);

}
