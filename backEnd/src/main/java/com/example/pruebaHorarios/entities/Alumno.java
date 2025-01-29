package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("ALUMNO")
public class Alumno extends Usuario {

    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("alumno")
    private List<Matricula> matriculas = new ArrayList<>();


    public Alumno() {
        super();
    }


    public Alumno(String nombreUsuario, String contraseña, String email) {
        super(nombreUsuario, contraseña, email);
    }

    public Alumno(int idUsuario, String nombreUsuario, String contraseña, String email, List<Matricula> matriculas) {
        super(idUsuario, nombreUsuario, contraseña, email);
        this.matriculas = matriculas;
    }


    public List<Matricula> getMatriculas() {
        return matriculas;
    }

    public void setMatriculas(List<Matricula> matriculas) {
        this.matriculas = matriculas;
    }


    public void addMatricula(Matricula matricula) {
        matriculas.add(matricula);
        matricula.setAlumno(this);
    }

    public void removeMatricula(Matricula matricula) {
        matriculas.remove(matricula);
        matricula.setAlumno(null);
    }


    @Override
    public String toString() {
        return "Alumno{" +
                "idUsuario=" + getIdUsuario() +
                ", nombreUsuario='" + getNombreUsuario() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", matriculas=" + matriculas +
                '}';
    }
}
