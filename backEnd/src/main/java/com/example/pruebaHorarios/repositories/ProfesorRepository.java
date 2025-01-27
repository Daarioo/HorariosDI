package com.example.pruebaHorarios.repositories;

import com.example.pruebaHorarios.entities.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesorRepository extends JpaRepository<Profesor, Integer> {

}