package com.leonardo.DynamicAppointment.modules.appointment.controller;

import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentRequestDTO;
import com.leonardo.DynamicAppointment.modules.appointment.dto.AppointmentResponseDTO;
import com.leonardo.DynamicAppointment.modules.appointment.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    AppointmentController(AppointmentService appointmentService){
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody AppointmentRequestDTO request){
        return new ResponseEntity<>(appointmentService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<AppointmentResponseDTO> fetchAppointment(@PathVariable Long id){
        return new ResponseEntity<>(appointmentService.fetch(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<AppointmentResponseDTO> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequestDTO request){
        return new ResponseEntity<>(appointmentService.update(id, request), HttpStatus.OK);
    }

    @DeleteMapping
    public void deleteAppointment(@PathVariable Long id){
        appointmentService.delete(id);
    }

}
