package com.farmitai.farmitai_backend;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(FarmitProperties.class)
public class FarmitaiBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FarmitaiBackendApplication.class, args);
	}

}
