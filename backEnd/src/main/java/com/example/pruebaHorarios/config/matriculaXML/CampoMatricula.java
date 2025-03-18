package com.example.pruebaHorarios.config.matriculaXML;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)
public class CampoMatricula {
    @XmlElement(name = "CicloFormativo")
    private CicloFormativo cicloFormativo;

    public CicloFormativo getCicloFormativo() {
        return cicloFormativo;
    }

    public void setCicloFormativo(CicloFormativo cicloFormativo) {
        this.cicloFormativo = cicloFormativo;
    }
}
