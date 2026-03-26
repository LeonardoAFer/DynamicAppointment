package com.leonardo.DynamicAppointment.core.scheduling;

import com.leonardo.DynamicAppointment.core.availability.AvailabilityEngine;
import com.leonardo.DynamicAppointment.core.domain.Slot;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

//Orquestrador de agendamento (faz todo o fluxo de agendamento)
@Component
public class SchedulingOrchestrator {

    private final AvailabilityEngine availabilityEngine;

    SchedulingOrchestrator(AvailabilityEngine availabilityEngine) {
        this.availabilityEngine = availabilityEngine;
    }

    public List<Slot> availableSlots(LocalDate date, Long professionalId, Long serviceId) {
        List<Slot> totalSlots = availabilityEngine.calcAvailabilitySlots(date, professionalId, serviceId);

        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.atTime(LocalTime.MAX);

        List<Slot> sheduledSlots = availabilityEngine.fetchScheduledSlots(professionalId, startDate, endDate);

        return totalSlots.stream().filter(slot -> sheduledSlots.stream().noneMatch(scheduled -> slot.getStartTime().isBefore(scheduled.getEndTime()) && slot.getEndTime().isAfter(scheduled.getStartTime()))).toList();
    }

}
