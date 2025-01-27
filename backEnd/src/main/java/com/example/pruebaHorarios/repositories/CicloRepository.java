package com.example.pruebaHorarios.repositories;

import com.example.pruebaHorarios.entities.Ciclo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CicloRepository extends JpaRepository<Ciclo, Integer> {
    Ciclo findByCodigo(String codigo);
}