package com.example.pruebaHorarios.config.matriculaXML;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class CicloFormativo {
    @XmlElement(name = "Codigo")
    private String codigo;

    @XmlElement(name = "Modalidad")
    private String modalidad;

    @XmlElement(name = "Nombre")
    private String nombre;

    @XmlElement(name = "FechaMatricula")
    private String fechaMatricula;

    @XmlElement(name = "Modulo")
    private List<CampoModulo> modulos;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFechaMatricula() {
        return fechaMatricula;
    }

    public void setFechaMatricula(String fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }

    public List<CampoModulo> getModulos() {
        return modulos;
    }

    public void setModulos(List<CampoModulo> modulos) {
        this.modulos = modulos;
    }
}
