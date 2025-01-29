package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Sesion;
import com.example.pruebaHorarios.services.SesionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sesiones")
public class SesionController {

    @Autowired
    private SesionService sesionService;


    @PostMapping
    public ResponseEntity<Sesion> crearSesion(@RequestBody Sesion sesion) {
        Sesion nuevaSesion = sesionService.crearSesion(sesion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSesion);
    }


    @GetMapping
    public ResponseEntity<List<Sesion>> obtenerSesiones() {
        List<Sesion> sesiones = sesionService.obtenerSesiones();
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/dia/{dia}")
    public ResponseEntity<List<Sesion>> obtenerSesionesPorDia(@PathVariable String dia) {
        List<Sesion> sesiones = sesionService.obtenerSesionesPorDia(dia);
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/modulo/{idModulo}")
    public ResponseEntity<List<Sesion>> obtenerSesionesPorModulo(@PathVariable int idModulo) {
        List<Sesion> sesiones = sesionService.obtenerSesionesPorModulo(idModulo);
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/{idSesion}")
    public ResponseEntity<Sesion> obtenerSesionPorId(@PathVariable int idSesion) {
        Optional<Sesion> sesion = sesionService.obtenerSesionPorId(idSesion);
        return sesion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{idSesion}")
    public ResponseEntity<Sesion> actualizarSesion(@PathVariable int idSesion, @RequestBody Sesion sesionActualizada) {
        Optional<Sesion> sesionExistente = sesionService.obtenerSesionPorId(idSesion);

        if (sesionExistente.isPresent()) {
            // Actualizar los datos de la sesión existente con los nuevos datos
            Sesion sesion = sesionExistente.get();
            sesion.setHoraInicio(sesionActualizada.getHoraInicio());
            sesion.setHoraFin(sesionActualizada.getHoraFin());
            sesion.setDia(sesionActualizada.getDia());
            sesion.setAula(sesionActualizada.getAula());
            sesion.setModulo(sesionActualizada.getModulo());

            Sesion sesionGuardada = sesionService.crearSesion(sesion); // Usar el método de creación para guardar los cambios
            return ResponseEntity.ok(sesionGuardada);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @DeleteMapping("/{idSesion}")
    public ResponseEntity<Void> eliminarSesion(@PathVariable int idSesion) {
        sesionService.eliminarSesion(idSesion);
        return ResponseEntity.noContent().build();
    }
}