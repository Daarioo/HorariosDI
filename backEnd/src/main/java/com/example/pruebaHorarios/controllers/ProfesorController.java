package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Profesor;
import com.example.pruebaHorarios.services.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profesores")
public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;


    @PostMapping
    public ResponseEntity<Profesor> crearProfesor(@RequestBody Profesor profesor) {
        Profesor nuevoProfesor = profesorService.crearProfesor(profesor);
        return ResponseEntity.ok(nuevoProfesor);
    }


    @GetMapping
    public ResponseEntity<List<Profesor>> obtenerTodosProfesores() {
        List<Profesor> profesores = profesorService.obtenerTodosProfesores();
        return ResponseEntity.ok(profesores);
    }


    @GetMapping("/{idProfesor}")
    public ResponseEntity<Profesor> obtenerProfesorPorId(@PathVariable int idProfesor) {
        Optional<Profesor> profesor = profesorService.obtenerProfesorPorId(idProfesor);
        return profesor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/{idProfesor}")
    public ResponseEntity<Profesor> actualizarProfesor(@PathVariable int idProfesor, @RequestBody Profesor profesor) {
        Profesor actualizado = profesorService.actualizarProfesor(idProfesor, profesor);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{idProfesor}")
    public ResponseEntity<Void> eliminarProfesor(@PathVariable int idProfesor) {
        return profesorService.eliminarProfesor(idProfesor) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}