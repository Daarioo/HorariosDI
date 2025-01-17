package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "sesion")
public class Sesion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idSesion;
    private String horaInicio;
    private String horaFin;
    private String dia;
    private String aula;
    private Modulo modulo;

    public Sesion(int idSesion, String horaInicio, String horaFin, String dia, String aula) {
        this.idSesion = idSesion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.dia = dia;
        this.aula = aula;
    }

    public Sesion(String horaInicio, String horaFin, String dia, String aula) {
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.dia = dia;
        this.aula = aula;
    }

    public int getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(int idSesion) {
        this.idSesion = idSesion;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
        this.horaFin = horaFin;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getAula() {
        return aula;
    }

    public void setAula(String aula) {
        this.aula = aula;
    }

    public Modulo getModulo() {
        return modulo;
    }

    public void setModulo(Modulo modulo) {
        this.modulo = modulo;
    }

    @Override
    public String toString() {
        return  "idSesion=" + idSesion +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                ", dia=" + dia +
                ", aula=" + aula +
                ", modulo=" + modulo;
    }
}
