package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Ciclo;
import com.example.pruebaHorarios.entities.Modulo;
import com.example.pruebaHorarios.services.CicloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ciclos")
public class CicloController {
    private final CicloService cicloService;

    public CicloController(CicloService cicloService) {
        this.cicloService = cicloService;
    }

    @GetMapping
    public List<Ciclo> getAllCiclos() {
        return cicloService.getAllCiclos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciclo> getCicloById(@PathVariable int id) {
        return cicloService.getCicloById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ciclo> createCiclo(@RequestBody Ciclo ciclo) {
        return ResponseEntity.ok(cicloService.saveCiclo(ciclo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ciclo> updateCiclo(@PathVariable int id, @RequestBody Ciclo updatedCiclo) {
        return cicloService.getCicloById(id).map(ciclo -> {
            ciclo.setCodigo(updatedCiclo.getCodigo());
            ciclo.setNombre(updatedCiclo.getNombre());
            ciclo.setDescripcion(updatedCiclo.getDescripcion());
            ciclo.setDuracion(updatedCiclo.getDuracion());
            return ResponseEntity.ok(cicloService.saveCiclo(ciclo));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCiclo(@PathVariable int id) {
        if (cicloService.getCicloById(id).isPresent()) {
            cicloService.deleteCiclo(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/modulos")
    public ResponseEntity<List<Modulo>> getModulosByCicloId(@PathVariable int id) {
        return cicloService.getCicloById(id)
                .map(ciclo -> ResponseEntity.ok(ciclo.getModulos()))
                .orElse(ResponseEntity.notFound().build());
    }
}
