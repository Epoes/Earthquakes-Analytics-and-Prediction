package com.usi;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAutoConfiguration
//@EnableJpaRepositories("com.usi.repository")
public class VisualEarthquakesApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(VisualEarthquakesApplication.class, args);
	}

	@Override
	public void run(String... strings) throws Exception {


	}
}



