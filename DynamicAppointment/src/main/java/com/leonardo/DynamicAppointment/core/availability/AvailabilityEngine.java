package com.leonardo.DynamicAppointment.core.availability;

import org.springframework.stereotype.Component;
//Motor de disponibilidade
//1 - Busca regra de disponibilidade para o profissional selecionado
//2 - Gera todos os slots possiveis
//3 - Busca todos os agendamentos já existentes para aquele profissional
//4 - Para cada slot gerado verifica se já tem um agendamento colidindo no mesmo horario
//5 - Retorna somente os slots sem colisão (horarios disponiveis)
@Component
public class AvailabilityEngine {

}
