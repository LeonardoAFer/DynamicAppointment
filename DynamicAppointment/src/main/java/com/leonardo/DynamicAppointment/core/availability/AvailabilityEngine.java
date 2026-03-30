package com.leonardo.DynamicAppointment.core.availability;

import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.modules.appointment.service.IAppointmentService;
import com.leonardo.DynamicAppointment.modules.professional.entity.Professional;
import com.leonardo.DynamicAppointment.modules.professional.service.IProfessionalService;
import com.leonardo.DynamicAppointment.modules.services.entity.BusinessService;
import com.leonardo.DynamicAppointment.modules.services.service.IBusinessServiceService;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

//Motor de disponibilidade
//1 - Busca regra de disponibilidade para o profissional selecionado
//2 - Gera todos os slots possiveis
//3 - Busca todos os agendamentos já existentes para aquele profissional
//4 - Para cada slot gerado verifica se já tem um agendamento colidindo no mesmo horario
//5 - Retorna somente os slots sem colisão (horarios disponiveis)
@Component
public class AvailabilityEngine {

    private final IProfessionalService professionalService;
    private final IBusinessServiceService businessServiceService;
    private final IAppointmentService appointmentService;

    AvailabilityEngine(IProfessionalService professionalService, IBusinessServiceService businessServiceService, IAppointmentService appointmentService) {
        this.professionalService = professionalService;
        this.businessServiceService = businessServiceService;
        this.appointmentService = appointmentService;
    }

    public List<Slot> calcAvailabilitySlots(LocalDate date, Long professionalId, Long serviceId) {
        Professional professional = professionalService.findEntityById(professionalId);

        BusinessService service = businessServiceService.findEntityById(serviceId);

        LocalTime startTime = professional.getStartTime();
        List<Slot> slots = new ArrayList<>();

        do {
            Slot slot = new Slot();
            slot.setStartTime(startTime);
            slot.setEndTime(startTime.plusMinutes(service.getDurationMinutes()).plusMinutes(service.getCleanupMinutes()));
            slots.add(slot);
            startTime = slot.getEndTime();
        } while (startTime.isBefore(professional.getEndTime()));

        return slots;
    }

    public List<Slot> fetchScheduledSlots(Long professionalId, LocalDateTime startDate, LocalDateTime endDate){
        return appointmentService.fetchAppointmentByDate(professionalId, startDate, endDate);
    }

}
