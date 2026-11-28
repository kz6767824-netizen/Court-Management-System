package com.ejudiciary.config;

import java.time.Clock;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Single source of "now" for the whole application.
 * All business logic that needs the current time (slot rules, "not in the past",
 * history timestamps) must inject this Clock instead of calling LocalDateTime.now(),
 * so behaviour does not change when the server runs in UTC (Render/Railway).
 * Contract: ARCHITECTURE.md section 7 (times in Asia/Karachi).
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock(@Value("${app.timezone}") String timezone) {
        return Clock.system(ZoneId.of(timezone));
    }
}