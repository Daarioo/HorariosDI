package com.example.pruebaHorarios.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Ciclo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCiclo;

    private String codigo;
    private String nombre;
    private String descripcion;
    private int duracion;

    @OneToMany(mappedBy = "ciclo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("ciclo")
    private List<Modulo> modulos = new ArrayList<>();

    @OneToMany(mappedBy = "cicloFormativo", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("cicloFormativo")
    private List<Matricula> matriculas = new ArrayList<>();

    public Ciclo() {
    }

    public Ciclo(String codigo, String nombre, String descripcion, int duracion) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
    }

    public Ciclo(String codigo, String nombre, String descripcion, int duracion, List<Modulo> modulos, List<Matricula> matriculas) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.modulos = modulos;
        this.matriculas = matriculas;
    }

    public Ciclo(int idCiclo, String codigo, String nombre, String descripcion, int duracion, List<Modulo> modulos, List<Matricula> matriculas) {
        this.idCiclo = idCiclo;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.modulos = modulos;
        this.matriculas = matriculas;
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

    public List<Modulo> getModulos() {
        return modulos;
    }

    public void setModulos(List<Modulo> modulos) {
        this.modulos = modulos;
    }

    public List<Matricula> getMatriculas() {
        return matriculas;
    }

    public void setMatriculas(List<Matricula> matriculas) {
        this.matriculas = matriculas;
    }

    // Sobrescribir el método toString para depuración
    @Override
    public String toString() {
        return "Ciclo{" +
                "idCiclo=" + idCiclo +
                ", codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", duracion=" + duracion +
                ", modulos=" + modulos +
                ", matriculas=" + matriculas +
                '}';
    }

    public void addModulo(Modulo modulo) {
        modulos.add(modulo);
        modulo.setCiclo(this);
    }

    public void removeModulo(Modulo modulo) {
        modulos.remove(modulo);
        modulo.setCiclo(null);
    }

    public void addMatricula(Matricula matricula) {
        matriculas.add(matricula);
        matricula.setCicloFormativo(this);
    }

    public void removeMatricula(Matricula matricula) {
        matriculas.remove(matricula);
        matricula.setCicloFormativo(null);
    }
}
