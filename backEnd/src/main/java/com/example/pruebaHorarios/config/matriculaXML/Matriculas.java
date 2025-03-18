package com.example.pruebaHorarios.config.matriculaXML;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlRootElement(name = "Matriculas")
@XmlAccessorType(XmlAccessType.FIELD)
public class Matriculas {
    @XmlElement(name = "Centro")
    private Centro centro;

    @XmlElementWrapper(name = "Alumnos")
    @XmlElement(name = "Alumno")
    private List<AlumnoMatricula> alumnos;

    public Centro getCentro() {
        return centro;
    }

    public void setCentro(Centro centro) {
        this.centro = centro;
    }

    public List<AlumnoMatricula> getAlumnos() {
        return alumnos;
    }

    public void setAlumnos(List<AlumnoMatricula> alumnos) {
        this.alumnos = alumnos;
    }

    // Getters y setters
}
