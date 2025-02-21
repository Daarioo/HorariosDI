package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Matricula;
import com.example.pruebaHorarios.entities.Sesion;
import com.example.pruebaHorarios.entities.Usuario;
import com.example.pruebaHorarios.services.MatriculaService;
import com.example.pruebaHorarios.services.SesionService;
import com.example.pruebaHorarios.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alumno")
@CrossOrigin(origins = "*")
public class AlumnoController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private MatriculaService matriculaService;

    @Autowired
    private SesionService sesionService;


    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/matricula")
    public ResponseEntity<List<Matricula>> obtenerTodasMatriculas() {
        List<Matricula> matriculas = matriculaService.obtenerTodasMatriculas();
        return ResponseEntity.ok(matriculas);
    }


    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<Matricula> obtenerMatriculaPorId(@PathVariable int idMatricula) {
        Optional<Matricula> matricula = matriculaService.obtenerMatriculaPorId(idMatricula);
        return matricula.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/matricula")
    public ResponseEntity<Matricula> crearMatricula(@RequestBody Matricula matricula) {
        Matricula nuevaMatricula = matriculaService.crearMatricula(matricula);
        return ResponseEntity.ok(nuevaMatricula);
    }

    @GetMapping("/sesion")
    public ResponseEntity<List<Sesion>> obtenerSesiones() {
        List<Sesion> sesiones = sesionService.obtenerSesiones();
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/sesion/dia/{dia}")
    public ResponseEntity<List<Sesion>> obtenerSesionesPorDia(@PathVariable String dia) {
        List<Sesion> sesiones = sesionService.obtenerSesionesPorDia(dia);
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/sesion/modulo/{idModulo}")
    public ResponseEntity<List<Sesion>> obtenerSesionesPorModulo(@PathVariable int idModulo) {
        List<Sesion> sesiones = sesionService.obtenerSesionesPorModulo(idModulo);
        return ResponseEntity.ok(sesiones);
    }


    @GetMapping("/sesion/{idSesion}")
    public ResponseEntity<Sesion> obtenerSesionPorId(@PathVariable int idSesion) {
        Optional<Sesion> sesion = sesionService.obtenerSesionPorId(idSesion);
        return sesion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
