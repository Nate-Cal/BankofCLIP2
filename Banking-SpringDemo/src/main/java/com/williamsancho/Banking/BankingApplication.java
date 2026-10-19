package com.williamsancho.Banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan("com.williamsancho") //our bean annotations won't work without this!
@EntityScan("com.williamsancho.models") //Spring Data will look in our models package for DB annotations
@EnableJpaRepositories("com.williamsancho.repository") public class BankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingApplication.class, args);
	}

}
