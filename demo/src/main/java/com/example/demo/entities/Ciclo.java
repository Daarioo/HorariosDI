package com.example.demo.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "ciclo")
public class Ciclo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCiclo;
    private String codigo;
    private String nombre;
    private String descripcion;
    private int duracion;
    @OneToMany
    @JoinColumn(name = "idModulo")
    private List<Modulo> modulos;

    public Ciclo(int idCiclo, String codigo, String nombre, String descripcion, int duracion) {
        this.idCiclo = idCiclo;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
    }

    public Ciclo(String codigo, String nombre, int duracion, String descripcion) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracion = duracion;
        this.descripcion = descripcion;
    }

    public int getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(int idCiclo) {
        this.idCiclo = idCiclo;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public int getDuracion() {
        return duracion;
    }

    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }

    public List<Modulo> getModulo() {
        return modulos;
    }

    public void setModulo(List<Modulo> modulos) {
        this.modulos = modulos;
    }

    public void addModulo(Modulo modulo) {
        this.modulos.add(modulo);
    }

    @Override
    public String toString() {
        return  "idCiclo=" + idCiclo +
                ", codigo=" + codigo +
                ", nombre=" + nombre +
                ", descripcion=" + descripcion +
                ", duracion=" + duracion;
    }
}
