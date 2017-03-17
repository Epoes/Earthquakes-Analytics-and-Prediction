package com.usi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VisualEarthquakesApplication {

	public static void main(String[] args) {
		SpringApplication.run(VisualEarthquakesApplication.class, args);
	}

}
