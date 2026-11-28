package com.ejudiciary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** e-Judiciary backend entry point. Layered design: controller -> service -> repository -> DB. */
@SpringBootApplication
public class EJudiciaryApplication {

    public static void main(String[] args) {
        SpringApplication.run(EJudiciaryApplication.class, args);
    }
}