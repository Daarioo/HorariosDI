package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int numMatricula;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"matriculas"})
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_ciclo")
    @JsonIgnoreProperties({"matriculas", "modulos"})
    private Ciclo cicloFormativo;

    @ManyToOne
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties({"matriculas", "ciclo"})
    private Modulo modulo;


    public Matricula() {
    }


    public Matricula(int numMatricula, Usuario usuario, Ciclo cicloFormativo, Modulo modulo) {
        this.numMatricula = numMatricula;
        this.usuario = usuario;
        this.cicloFormativo = cicloFormativo;
        this.modulo = modulo;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumMatricula() {
        return numMatricula;
    }

    public void setNumMatricula(int numMatricula) {
        this.numMatricula = numMatricula;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Ciclo getCicloFormativo() {
        return cicloFormativo;
    }

    public void setCicloFormativo(Ciclo cicloFormativo) {
        this.cicloFormativo = cicloFormativo;
    }

    public Modulo getModulo() {
        return modulo;
    }

    public void setModulo(Modulo modulo) {
        this.modulo = modulo;
    }

    @Override
    public String toString() {
        return "Matricula{" +
                "id=" + id +
                ", numMatricula=" + numMatricula +
                ", usuario=" + usuario.getNombreUsuario() +
                ", cicloFormativo=" + cicloFormativo.getNombre() +
                ", modulo=" + modulo.getNombre() +
                '}';
    }
}