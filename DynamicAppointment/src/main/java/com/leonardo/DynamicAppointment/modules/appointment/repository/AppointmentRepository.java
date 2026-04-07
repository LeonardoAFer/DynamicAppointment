package com.leonardo.DynamicAppointment.modules.appointment.repository;

import com.leonardo.DynamicAppointment.modules.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.professional.id = :professionalId AND a.scheduledAt BETWEEN :startDate AND :endDate AND a.status IN ('CONFIRMED', 'PENDING')")
    List<Appointment> fetchAppointmentByDate(
            @Param("professionalId") Long professionalId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    Optional<Appointment> findByAccessToken(String accessToken);

}
