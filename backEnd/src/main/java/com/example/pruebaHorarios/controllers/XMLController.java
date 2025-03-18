package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.config.XMLParser;
import com.example.pruebaHorarios.config.mappers.UsuarioMapper;
import com.example.pruebaHorarios.config.alumnoXML.Alumnado;
import com.example.pruebaHorarios.config.alumnoXML.Alumno;
import com.example.pruebaHorarios.entities.Usuario;
import com.example.pruebaHorarios.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
public class XMLController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @PostMapping("/importar-alumnos")
    public ResponseEntity<String> importarAlumnos(@RequestParam("file") MultipartFile file) {
        try {
            // Guarda el archivo temporalmente o procesa directamente desde el MultipartFile
            File tempFile = File.createTempFile("alumnado", ".xml");
            file.transferTo(tempFile);

            Alumnado alumnado = XMLParser.parseXML(tempFile.getAbsolutePath(), Alumnado.class);

            if (alumnado != null) {
                for (Alumno alumno : alumnado.getAlumnos()) {
                    Usuario usuario = usuarioMapper.mapAlumnoToUsuario(alumno);
                    usuarioService.createUsuario(usuario);
                }
                return ResponseEntity.ok("Alumnos importados correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al importar alumnos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo XML: " + e.getMessage());
        }
    }
}
