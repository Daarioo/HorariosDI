package com.example.pruebaHorarios.config.mappers;

import com.example.pruebaHorarios.config.matriculaXML.AlumnoMatricula;
import com.example.pruebaHorarios.config.matriculaXML.CampoModulo;
import com.example.pruebaHorarios.entities.Ciclo;
import com.example.pruebaHorarios.entities.Matricula;
import com.example.pruebaHorarios.entities.Modulo;
import com.example.pruebaHorarios.repositories.CicloRepository;
import com.example.pruebaHorarios.repositories.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class MatriculaMapper {

    @Autowired
    private CicloRepository cicloRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    public Matricula mapCampoMatriculaToEntity(AlumnoMatricula alumnoMatricula) {
        Matricula matricula = new Matricula();
        matricula.setNumMatricula(Integer.parseInt(alumnoMatricula.getId()));

        // Asociar ciclo formativo
        String codigoCiclo = alumnoMatricula.getMatricula().getCicloFormativo().getCodigo();
        Ciclo cicloFormativo = cicloRepository.findByCodigo(codigoCiclo);
        matricula.setCicloFormativo(cicloFormativo);

        // Asociar un módulo (puedes elegir el primero o manejarlo de otra manera)
        List<CampoModulo> modulosXML = alumnoMatricula.getMatricula().getCicloFormativo().getModulos();
        if (!modulosXML.isEmpty()) {
            String codigoModulo = modulosXML.get(0).getCodigo();
            Modulo modulo = moduloRepository.findByCodigo(codigoModulo);
            matricula.setModulo(modulo);
        }

        return matricula;
    }
}