package com.usi;

import com.usi.repository.EarthquakeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAutoConfiguration
public class VisualEarthquakesApplication implements CommandLineRunner {

	EarthquakeRepository earthquakeRepository;
	@Autowired
	public VisualEarthquakesApplication(EarthquakeRepository earthquakeRepository) {
		this.earthquakeRepository = earthquakeRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(VisualEarthquakesApplication.class, args);
	}

	@Override
	public void run(String... strings) throws Exception {
		// Start hub
//		EarthQuakeHub hub = new EarthQuakeHub();
//		List<EarthQuake> earthQuakeList = hub.updateEarthQuakes();
//		this.earthquakeRepository.save(earthQuakeList);

	}
}



