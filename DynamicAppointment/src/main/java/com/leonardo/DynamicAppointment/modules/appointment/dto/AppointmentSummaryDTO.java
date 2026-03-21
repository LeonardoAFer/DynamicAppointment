package com.leonardo.DynamicAppointment.modules.appointment.dto;

import com.leonardo.DynamicAppointment.modules.appointment.status.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentSummaryDTO {

    private Long id;

    private String guestName;

    private String professionalName;

    private String serviceName;

    private LocalDateTime scheduledAt;

    private AppointmentStatus status;

}
