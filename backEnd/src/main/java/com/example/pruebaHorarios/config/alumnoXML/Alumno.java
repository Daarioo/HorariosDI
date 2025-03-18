package com.example.pruebaHorarios.config.alumnoXML;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)
public class Alumno {
    @XmlElement(name = "ID")
    private String id;

    @XmlElement(name = "Nombre")
    private String nombre;

    @XmlElement(name = "Apellido")
    private String apellido;

    @XmlElement(name = "DNI")
    private String dni;

    @XmlElement(name = "FechaNacimiento")
    private String fechaNacimiento;

    @XmlElement(name = "Genero")
    private String genero;

    @XmlElement(name = "Direccion")
    private Direccion direccion;

    @XmlElement(name = "Telefono")
    private String telefono;

    @XmlElement(name = "Email")
    private String email;;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Direccion getDireccion() {
        return direccion;
    }

    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
