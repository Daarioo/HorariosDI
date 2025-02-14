package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profesor")
public class Profesor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idProfesor;
    private String nombre;
    private String apellidos;
    private String email;


    @OneToMany(mappedBy = "profesor")
    @JsonIgnoreProperties({"modulo","matriculas"})
    private List<Modulo> modulos = new ArrayList<>();


    public Profesor(){}

    public Profesor(int idProfesor, String nombre, String apellidos, String email, List<Modulo> modulos) {
        this.idProfesor = idProfesor;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.modulos = modulos;
    }

    public Profesor(String nombre, String apellidos, String email, List<Modulo> modulos) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.modulos=modulos;
    }

    public Profesor(String nombre, String apellidos, String email) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
    }

    public int getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(int idProfesor) {
        this.idProfesor = idProfesor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Modulo> getModulo() {
        return modulos;
    }

    public void setModulo(List<Modulo> modulo) {
        this.modulos = modulo;
    }

    @Override
    public String toString() {
        return "Profesor{" +
                "idProfesor=" + idProfesor +
                ", nombre='" + nombre + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", email='" + email + '\'' +
                ", modulo=" + modulos +
                '}';
    }
}