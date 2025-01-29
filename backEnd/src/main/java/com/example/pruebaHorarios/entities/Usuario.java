package com.example.pruebaHorarios.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo", discriminatorType = DiscriminatorType.STRING)
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;
    private String nombreUsuario;
    private String contraseña;
    private String email;
    @Transient
    private String tipo;
    public Usuario() {
    }

    public Usuario(String nombreUsuario, String contraseña, String email) {
        this.nombreUsuario = nombreUsuario;
        this.contraseña = contraseña;
        this.email = email;
    }

    public Usuario(int idUsuario, String nombreUsuario, String contraseña, String email) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.contraseña = contraseña;
        this.email = email;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipo() {
        if (this instanceof Administrador) {
            return "ADMIN";
        } else{
            return "ALUMNO";
        }

    }

    public void setTipo(String tipo){
        this.tipo=tipo;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "idUsuario=" + idUsuario +
                ", nombreUsuario='" + nombreUsuario + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return idUsuario == usuario.idUsuario &&
                Objects.equals(nombreUsuario, usuario.nombreUsuario) &&
                Objects.equals(email, usuario.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, nombreUsuario, email);
    }
}
