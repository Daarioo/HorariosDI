package com.example.pruebaHorarios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@ComponentScan("com.example.pruebaHorarios.controllers")
@ComponentScan("com.example.pruebaHorarios.entities")
@ComponentScan("com.example.pruebaHorarios.repositories")
@ComponentScan("com.example.pruebaHorarios.services")
@ComponentScan("com.example.pruebaHorarios.config")
@EnableWebMvc
public class PruebaHorariosApplication {
	public static void main(String[] args) {
		SpringApplication.run(PruebaHorariosApplication.class, args);
	}
}
