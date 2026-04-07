package com.leonardo.DynamicAppointment.modules.appointment.controller;

import com.leonardo.DynamicAppointment.core.domain.Slot;
import com.leonardo.DynamicAppointment.core.scheduling.SchedulingOrchestrator;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
import com.leonardo.DynamicAppointment.modules.appointment.service.IAppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final IAppointmentService appointmentService;
    private final SchedulingOrchestrator schedulingOrchestrator;

    AppointmentController(IAppointmentService appointmentService, SchedulingOrchestrator schedulingOrchestrator) {
        this.appointmentService = appointmentService;
        this.schedulingOrchestrator = schedulingOrchestrator;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody AppointmentRequestDTO request) {
        return new ResponseEntity<>(appointmentService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<AppointmentResponseDTO> fetchAppointment(@PathVariable Long id) {
        return new ResponseEntity<>(appointmentService.fetch(id), HttpStatus.OK);
    }

    @GetMapping("/availability")
    public ResponseEntity<List<Slot>> getAvailability(@RequestParam LocalDate date, @RequestParam int serviceId, @RequestParam int profesionalId) {
        return new ResponseEntity<>(schedulingOrchestrator.availableSlots(date, (long) profesionalId, (long) serviceId), HttpStatus.OK);
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<Slot>> fetchAppointmentsByDate(@RequestParam Long professionalId, @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate){
        return new ResponseEntity<>(appointmentService.fetchAppointmentByDate(professionalId, startDate, endDate), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<AppointmentResponseDTO> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequestDTO request) {
        return new ResponseEntity<>(appointmentService.update(id, request), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/guest/{token}")
    public ResponseEntity<AppointmentResponseDTO> fetchByToken(@PathVariable String token) {
        return new ResponseEntity<>(appointmentService.fetchByToken(token), HttpStatus.OK);
    }

    @GetMapping("/guest/{token}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancelByToken(@PathVariable String token) {
        return new ResponseEntity<>(appointmentService.cancelByToken(token), HttpStatus.OK);
    }

}
