package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Sesion;
import com.example.pruebaHorarios.repositories.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SesionService {

    @Autowired
    private SesionRepository sesionRepository;


    public Sesion crearSesion(Sesion sesion) {
        return sesionRepository.save(sesion);
    }


    public List<Sesion> obtenerSesiones() {
        return sesionRepository.findAll();
    }

    public List<Sesion> obtenerSesionesPorDia(String dia) {
        return sesionRepository.findByDia(dia);
    }


    public List<Sesion> obtenerSesionesPorModulo(int idModulo) {
        return sesionRepository.findByModulo_IdModulo(idModulo);
    }


    public Optional<Sesion> obtenerSesionPorId(int idSesion) {
        return sesionRepository.findById(idSesion);
    }


    public void eliminarSesion(int idSesion) {
        sesionRepository.deleteById(idSesion);
    }
}