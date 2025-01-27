package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Profesor;
import com.example.pruebaHorarios.repositories.ProfesorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    public Profesor crearProfesor(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    public List<Profesor> obtenerTodosProfesores() {
        return profesorRepository.findAll();
    }

    public Optional<Profesor> obtenerProfesorPorId(int idProfesor) {
        return profesorRepository.findById(idProfesor);
    }

    public Profesor actualizarProfesor(int idProfesor, Profesor profesor) {
        if (profesorRepository.existsById(idProfesor)) {
            profesor.setIdProfesor(idProfesor);
            return profesorRepository.save(profesor);
        }
        return null;
    }

    public boolean eliminarProfesor(int idProfesor) {
        if (profesorRepository.existsById(idProfesor)) {
            profesorRepository.deleteById(idProfesor);
            return true;
        }
        return false;
    }
}