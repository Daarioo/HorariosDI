package com.example.pruebaHorarios.repositories;

import com.example.pruebaHorarios.entities.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
}
