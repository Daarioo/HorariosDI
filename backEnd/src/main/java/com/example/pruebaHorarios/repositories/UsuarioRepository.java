package com.example.pruebaHorarios.repositories;

import com.example.pruebaHorarios.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}