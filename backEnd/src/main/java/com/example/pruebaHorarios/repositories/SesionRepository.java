package com.example.pruebaHorarios.repositories;


import com.example.pruebaHorarios.entities.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SesionRepository extends JpaRepository<Sesion, Integer> {

    List<Sesion> findByDia(String dia);

    List<Sesion> findByModulo_IdModulo(int idModulo);
}