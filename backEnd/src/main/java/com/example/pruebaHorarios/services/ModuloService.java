package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Modulo;
import com.example.pruebaHorarios.repositories.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuloService {

    @Autowired
    private ModuloRepository moduloRepository;

    public List<Modulo> getAllModulos() {
        return moduloRepository.findAll();
    }

    public Optional<Modulo> getModuloById(int id) {
        return moduloRepository.findById(id);
    }

    public Modulo saveModulo(Modulo modulo) {
        return moduloRepository.save(modulo);
    }

    public Modulo updateModulo(int id, Modulo updatedModulo) {
        return moduloRepository.findById(id).map(modulo -> {
            modulo.setCodigo(updatedModulo.getCodigo());
            modulo.setNombre(updatedModulo.getNombre());
            modulo.setHorasSemana(updatedModulo.getHorasSemana());
            modulo.setHorasTotales(updatedModulo.getHorasTotales());
            modulo.setCiclo(updatedModulo.getCiclo());
            modulo.setProfesor(updatedModulo.getProfesor());
            return moduloRepository.save(modulo);
        }).orElseThrow(() -> new RuntimeException("Módulo no encontrado con ID: " + id));
    }

    public void deleteModulo(int id) {
        if (!moduloRepository.existsById(id)) {
            throw new RuntimeException("Módulo no encontrado con ID: " + id);
        }
        moduloRepository.deleteById(id);
    }
}