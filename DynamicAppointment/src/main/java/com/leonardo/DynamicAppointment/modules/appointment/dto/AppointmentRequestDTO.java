package com.leonardo.DynamicAppointment.modules.appointment.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequestDTO {

    private String guestName;

    private String guestEmail;

    private String guestPhone;

    private Long professionalId;

    private Long serviceId;

    private LocalDateTime scheduledAt;

}
