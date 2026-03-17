package com.leonardo.DynamicAppointment.modules.appointment.entity;

import com.leonardo.DynamicAppointment.modules.appointment.status.AppointmentStatus;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String guestName;

    private String guestEmail;

    private String guestPhone;

    @ManyToOne
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private BusinessService service;

    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String accessToken;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
