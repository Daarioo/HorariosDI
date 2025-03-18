package com.example.pruebaHorarios.config.alumnoXML;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlRootElement(name = "Alumnado")
@XmlAccessorType(XmlAccessType.FIELD)
public class Alumnado {
    @XmlElement(name = "Centro")
    private Centro centro;

    @XmlElementWrapper(name = "Alumnos")
    @XmlElement(name = "Alumno")
    private List<Alumno> alumnos;

    public Centro getCentro() {
        return centro;
    }

    public void setCentro(Centro centro) {
        this.centro = centro;
    }

    public List<Alumno> getAlumnos() {
        return alumnos;
    }

    public void setAlumnos(List<Alumno> alumnos) {
        this.alumnos = alumnos;
    }
}
