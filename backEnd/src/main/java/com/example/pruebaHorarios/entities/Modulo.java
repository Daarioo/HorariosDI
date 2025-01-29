package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idModulo;

    private String codigo;
    private String nombre;
    private int horasSemana;
    private int horasTotales;

    @ManyToOne
    @JoinColumn(name = "id_ciclo", nullable = false)
    @JsonIgnoreProperties("modulos")
    private Ciclo ciclo;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("modulo")
    private List<Matricula> matriculas = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "id_profesor")
    @JsonIgnoreProperties("modulo")
    private Profesor profesor;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("modulo")
    private List<Sesion> sesiones = new ArrayList<>();

    public Modulo() {
    }

    public Modulo(String codigo, String nombre, int horasSemana, int horasTotales) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.horasSemana = horasSemana;
        this.horasTotales = horasTotales;
    }


    public int getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(int idModulo) {
        this.idModulo = idModulo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getHorasSemana() {
        return horasSemana;
    }

    public void setHorasSemana(int horasSemana) {
        this.horasSemana = horasSemana;
    }

    public int getHorasTotales() {
        return horasTotales;
    }

    public void setHorasTotales(int horasTotales) {
        this.horasTotales = horasTotales;
    }

    public Ciclo getCiclo() {
        return ciclo;
    }

    public void setCiclo(Ciclo ciclo) {
        this.ciclo = ciclo;
    }

    public List<Matricula> getMatriculas() {
        return matriculas;
    }

    public void setMatriculas(List<Matricula> matriculas) {
        this.matriculas = matriculas;
    }

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public List<Sesion> getSesiones() {
        return sesiones;
    }

    public void setSesiones(List<Sesion> sesiones) {
        this.sesiones = sesiones;
    }

    @Override
    public String toString() {
        return "Modulo{" +
                "idModulo=" + idModulo +
                ", codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", horasSemana=" + horasSemana +
                ", horasTotales=" + horasTotales +
                ", ciclo=" + ciclo.getNombre() +
                ", profesor=" + (profesor != null ? profesor.getNombre() : "sin profesor") +
                '}';
    }


    public void addMatricula(Matricula matricula) {
        matriculas.add(matricula);
        matricula.setModulo(this);
    }

    public void removeMatricula(Matricula matricula) {
        matriculas.remove(matricula);
        matricula.setModulo(null);
    }

    public void addSesion(Sesion sesion) {
        sesiones.add(sesion);
        sesion.setModulo(this);
    }

    public void removeSesion (Sesion sesion){
            sesiones.remove(sesion);
            sesion.setModulo(null);

    }
}
