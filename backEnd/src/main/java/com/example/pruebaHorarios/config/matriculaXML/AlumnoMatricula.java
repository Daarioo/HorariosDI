package com.example.pruebaHorarios.config.matriculaXML;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)
public class AlumnoMatricula {
    @XmlElement(name = "ID")
    private String id;

    @XmlElement(name = "Matricula")
    private CampoMatricula matricula;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CampoMatricula getMatricula() {
        return matricula;
    }

    public void setMatricula(CampoMatricula matricula) {
        this.matricula = matricula;
    }
}
