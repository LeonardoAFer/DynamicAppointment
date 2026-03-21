package com.leonardo.DynamicAppointment.modules.appointment.dto;

import com.leonardo.DynamicAppointment.modules.appointment.status.AppointmentStatus;
import com.leonardo.DynamicAppointment.modules.professional.dto.ProfessionalSummaryDTO;
import com.leonardo.DynamicAppointment.modules.services.dto.BusinessServiceSummaryDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentResponseDTO {

    private Long id;

    private String guestName;

    private String guestEmail;

    private String guestPhone;

    private ProfessionalSummaryDTO professional;

    private BusinessServiceSummaryDTO service;

    private LocalDateTime scheduledAt;

    private AppointmentStatus status;

    private String accessToken;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
