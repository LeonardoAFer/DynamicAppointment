package com.leonardo.DynamicAppointment.core.util;

import java.util.function.Consumer;

public class UpdateHelper {

    private UpdateHelper() {}

    public static <T> void updateIfPresent(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

}
