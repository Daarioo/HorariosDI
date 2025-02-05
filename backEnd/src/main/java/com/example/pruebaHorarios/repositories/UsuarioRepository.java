package com.example.pruebaHorarios.repositories;

import com.example.pruebaHorarios.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNombreUsuario(String email);

}
