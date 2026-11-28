package com.ejudiciary;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class EJudiciaryApplicationTests {

    @Autowired
    private Clock clock;

    @Test
    void contextLoads() {
        // Passes only if the app, H2 datasource, Flyway and JPA all start together.
    }

    @Test
    void clockUsesConfiguredTimezone() {
        assertThat(clock.getZone()).isEqualTo(ZoneId.of("Asia/Karachi"));
    }
}