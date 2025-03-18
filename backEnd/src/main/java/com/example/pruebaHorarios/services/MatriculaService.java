package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Matricula;
import com.example.pruebaHorarios.repositories.MatriculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatriculaService {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Matricula crearMatricula(Matricula matricula) {
        // Verificar si el alumno existe
        Optional<Usuario> usuario = usuarioRepository.findById(matricula.getNumMatricula());

        if (usuario != null) {
            matricula.setUsuario(usuario.get());

            // Asegúrate de que cicloFormativo y modulo no sean nulos
            if (matricula.getCicloFormativo() != null && matricula.getModulo() != null) {
                return matriculaRepository.save(matricula);
            } else {
                throw new RuntimeException("Ciclo o módulo no encontrado para la matrícula con ID: " + matricula.getNumMatricula());
            }
        } else {
            throw new RuntimeException("Alumno no encontrado con ID: " + matricula.getNumMatricula());
        }
    }

    public List<Matricula> obtenerTodasMatriculas() {
        return matriculaRepository.findAll();
    }

    public Optional<Matricula> obtenerMatriculaPorId(int idMatricula) {
        return matriculaRepository.findById(idMatricula);
    }

    public Matricula actualizarMatricula(int idMatricula, Matricula matricula) {
        if (matriculaRepository.existsById(idMatricula)) {
            matricula.setId(idMatricula);
            return matriculaRepository.save(matricula);
        }
        return null;
    }

    public boolean eliminarMatricula(int idMatricula) {
        if (matriculaRepository.existsById(idMatricula)) {
            matriculaRepository.deleteById(idMatricula);
            return true;
        }
        return false;
    }
}
