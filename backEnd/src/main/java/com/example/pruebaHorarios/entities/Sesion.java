package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "sesion", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dia", "horaInicio", "horaFin", "aula"})
})
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idSesion;

    @Column(nullable = false)
    private String horaInicio;

    @Column(nullable = false)
    private String horaFin;
    @Column(nullable = false)
    private String dia;
    @Column(nullable = false)
    private String aula;

    @ManyToOne
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties("sesiones")
    private Modulo modulo;

    public Sesion() {
    }

    public Sesion(String horaInicio, String horaFin, String dia, String aula) {
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.dia = dia;
        this.aula = aula;
    }

    public Sesion(String horaInicio, String horaFin, String dia, String aula, Modulo modulo) {
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.dia = dia;
        this.aula = aula;
        this.modulo = modulo;
    }

    public Sesion(int idSesion, String horaInicio, String horaFin, String dia, String aula, Modulo modulo) {
        this.idSesion = idSesion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.dia = dia;
        this.aula = aula;
        this.modulo = modulo;
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
        return "Sesion{" +
                "idSesion=" + idSesion +
                ", horaInicio='" + horaInicio + '\'' +
                ", horaFin='" + horaFin + '\'' +
                ", dia='" + dia + '\'' +
                ", aula='" + aula + '\'' +
                ", modulo=" + (modulo != null ? modulo.getNombre() : "null") +
                '}';
    }
}
