package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Modulo;
import com.example.pruebaHorarios.services.ModuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modulos")
public class ModuloController {

    @Autowired
    private ModuloService moduloService;

    @GetMapping
    public List<Modulo> getAllModulos() {
        return moduloService.getAllModulos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modulo> getModuloById(@PathVariable int id) {
        return moduloService.getModuloById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Modulo createModulo(@RequestBody Modulo modulo) {
        return moduloService.saveModulo(modulo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modulo> updateModulo(@PathVariable int id, @RequestBody Modulo updatedModulo) {
        try {
            return ResponseEntity.ok(moduloService.updateModulo(id, updatedModulo));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModulo(@PathVariable int id) {
        try {
            moduloService.deleteModulo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
