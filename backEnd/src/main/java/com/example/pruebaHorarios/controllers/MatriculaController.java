package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.config.XMLParser;
import com.example.pruebaHorarios.config.mappers.MatriculaMapper;
import com.example.pruebaHorarios.config.matriculaXML.AlumnoMatricula;
import com.example.pruebaHorarios.config.matriculaXML.Matriculas;
import com.example.pruebaHorarios.entities.Matricula;
import com.example.pruebaHorarios.services.MatriculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaController {

    @Autowired
    private MatriculaService matriculaService;


    @PostMapping
    public ResponseEntity<Matricula> crearMatricula(@RequestBody Matricula matricula) {
        Matricula nuevaMatricula = matriculaService.crearMatricula(matricula);
        return ResponseEntity.ok(nuevaMatricula);
    }

    @GetMapping
    public ResponseEntity<List<Matricula>> obtenerTodasMatriculas() {
        List<Matricula> matriculas = matriculaService.obtenerTodasMatriculas();
        return ResponseEntity.ok(matriculas);
    }


    @GetMapping("/{idMatricula}")
    public ResponseEntity<Matricula> obtenerMatriculaPorId(@PathVariable int idMatricula) {
        Optional<Matricula> matricula = matriculaService.obtenerMatriculaPorId(idMatricula);
        return matricula.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/{idMatricula}")
    public ResponseEntity<Matricula> actualizarMatricula(@PathVariable int idMatricula, @RequestBody Matricula matricula) {
        Matricula actualizada = matriculaService.actualizarMatricula(idMatricula, matricula);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idMatricula}")
    public ResponseEntity<Void> eliminarMatricula(@PathVariable int idMatricula) {
        return matriculaService.eliminarMatricula(idMatricula) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/importar-matriculas")
    public ResponseEntity<String> importarMatriculas(@RequestParam("file") MultipartFile file) {
        try {
            File tempFile = File.createTempFile("matriculas", ".xml");
            file.transferTo(tempFile);

            Matriculas matriculas = XMLParser.parseXML(tempFile.getAbsolutePath(), Matriculas.class);

            if (matriculas != null && matriculas.getAlumnos() != null) {
                for (AlumnoMatricula alumnoMatricula : matriculas.getAlumnos()) {
                    MatriculaMapper matriculaMapper = new MatriculaMapper();
                    Matricula matricula = matriculaMapper.mapCampoMatriculaToEntity(alumnoMatricula);
                    matriculaService.crearMatricula(matricula);
                }
                return ResponseEntity.ok("Matrículas importadas correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al importar matrículas");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo XML: " + e.getMessage());
        }
    }
}
