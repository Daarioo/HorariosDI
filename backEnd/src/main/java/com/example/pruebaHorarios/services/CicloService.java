package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Ciclo;
import com.example.pruebaHorarios.repositories.CicloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CicloService {
    private final CicloRepository cicloRepository;

    public CicloService(CicloRepository cicloRepository) {
        this.cicloRepository = cicloRepository;
    }

    public List<Ciclo> getAllCiclos() {
        return cicloRepository.findAll();
    }

    public Optional<Ciclo> getCicloById(int id) {
        return cicloRepository.findById(id);
    }

    public Ciclo saveCiclo(Ciclo ciclo) {
        return cicloRepository.save(ciclo);
    }

    public void deleteCiclo(int id) {
        cicloRepository.deleteById(id);
    }

    public Ciclo getCicloByCodigo(String codigo) {
        return cicloRepository.findByCodigo(codigo);
    }
}
