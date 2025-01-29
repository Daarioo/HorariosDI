package com.example.pruebaHorarios.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends Usuario {


    public Administrador() {
        super();
    }

    public Administrador(String nombreUsuario, String contraseña, String email) {
        super(nombreUsuario, contraseña, email);
    }

    public Administrador(int idUsuario, String nombreUsuario, String contraseña, String email) {
        super(idUsuario, nombreUsuario, contraseña, email);
    }

    @Override
    public String toString() {
        return "Administrador{" +
                "idUsuario=" + getIdUsuario() +
                ", nombreUsuario='" + getNombreUsuario() + '\'' +
                ", email='" + getEmail() + '\'' +
                '}';
    }
}
