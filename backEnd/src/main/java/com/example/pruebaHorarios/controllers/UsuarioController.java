package com.example.pruebaHorarios.controllers;

import com.example.pruebaHorarios.entities.Usuario;
import com.example.pruebaHorarios.services.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;


    @GetMapping("/buscar/{nombreUsuario}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable String nombreUsuario) {
        Optional<Usuario> usuario = usuarioService.buscarPorNombreUsuario(nombreUsuario);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Usuario newUsuario = usuarioService.createUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUsuario);
    }


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


    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioDetails) {
        Usuario updatedUsuario = usuarioService.updateUsuario(id, usuarioDetails);
        return ResponseEntity.ok(updatedUsuario);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/info")
    public Map<String, Object> getCurrentUserInfo(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return Map.of("authenticated", false);
        }

        System.out.println("Usuario autenticado: ID=" + usuario.getIdUsuario() + " Nombre=" + usuario.getNombreUsuario() + " Tipo=" + usuario.getTipo());

        return Map.of(
                "authenticated", true,
                "id", usuario.getIdUsuario(),
                "nombre", usuario.getNombreUsuario(),
                "tipo", usuario.getTipo().name()
        );
    }

    @PostMapping("/importar-alumnos")
    public String importarAlumnos() {
        Alumnado alumnado = XMLParser.parseXML("ruta/al/archivo.xml", Alumnado.class);

        if (alumnado != null) {
            for (Alumno alumno : alumnado.getAlumnos()) {
                Usuario usuario = usuarioMapper.mapAlumnoToUsuario(alumno);
                usuarioService.createUsuario(usuario);
            }
            return "Alumnos importados correctamente";
        } else {
            return "Error al importar alumnos";
        }
    }
}