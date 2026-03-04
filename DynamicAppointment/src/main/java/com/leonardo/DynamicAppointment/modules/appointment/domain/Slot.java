package com.leonardo.DynamicAppointment.modules.appointment.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Slot {

    private LocalTime startTime;
    private LocalTime endTime;

}
