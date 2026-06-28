package com.leonardo.DynamicAppointment.core.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UpdateHelperTest {

    @Test
    @DisplayName("deve aplicar o setter quando o valor não for nulo")
    void shouldApplySetterWhenValueIsNotNull() {
        AtomicReference<String> target = new AtomicReference<>("valor antigo");

        UpdateHelper.updateIfPresent("valor novo", target::set);

        assertEquals("valor novo", target.get());
    }

    @Test
    @DisplayName("não deve aplicar o setter quando o valor for nulo")
    void shouldNotApplySetterWhenValueIsNull() {
        AtomicReference<String> target = new AtomicReference<>("valor antigo");

        UpdateHelper.updateIfPresent(null, target::set);

        assertEquals("valor antigo", target.get());
    }

    @Test
    @DisplayName("deve aplicar o setter exatamente uma vez")
    void shouldApplySetterExactlyOnce() {
        AtomicInteger callCount = new AtomicInteger(0);

        UpdateHelper.updateIfPresent(42, value -> callCount.incrementAndGet());

        assertEquals(1, callCount.get());
    }

    @Test
    @DisplayName("deve funcionar com tipos diferentes")
    void shouldWorkWithDifferentTypes() {
        AtomicReference<Integer> target = new AtomicReference<>(0);

        UpdateHelper.updateIfPresent(100, target::set);

        assertEquals(100, target.get());
    }
}