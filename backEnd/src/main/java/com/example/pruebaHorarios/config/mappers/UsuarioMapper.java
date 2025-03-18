package com.example.pruebaHorarios.config.mappers;

import com.example.pruebaHorarios.config.alumnoXML.Alumno;
import com.example.pruebaHorarios.entities.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario mapAlumnoToUsuario(Alumno alumno) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(alumno.getNombre() + " " + alumno.getApellido());
        usuario.setContraseña(alumno.getDni());
        usuario.setEmail(alumno.getEmail());
        usuario.setTipo(Usuario.TipoUsuario.ALUMNO);
        return usuario;
    }
}
