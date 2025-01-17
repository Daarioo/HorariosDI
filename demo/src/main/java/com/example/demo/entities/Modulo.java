package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "modulo")
public class Modulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idModulo;
    private String codigo;
    private String nombre;
    private int horasSemana;
    private int horasTotales;
    @OneToOne
    @JoinColumn(name = "idCiclo")
    private Ciclo ciclo;
    @OneToOne
    @JoinColumn(name = "idProfesor")
    private Profesor profesor;

    public Modulo(int idModulo, String codigo, String nombre, int horasSemana, int horasTotales, Ciclo ciclo, Profesor profesor) {
        this.idModulo = idModulo;
        this.codigo = codigo;
        this.nombre = nombre;
        this.horasSemana = horasSemana;
        this.horasTotales = horasTotales;
        this.ciclo = ciclo;
        this.profesor = profesor;
    }

    public Modulo(String codigo, String nombre, int horasSemana, int horasTotales, Ciclo ciclo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.horasSemana = horasSemana;
        this.horasTotales = horasTotales;
        this.ciclo = ciclo;
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

    @Override
    public String toString() {
        return  "idModulo=" + idModulo +
                ", codigo=" + codigo +
                ", nombre=" + nombre +
                ", horasSemana=" + horasSemana +
                ", horasTotales=" + horasTotales +
                ", ciclo=" + ciclo +
                ", profesor=" + profesor;
    }
}
