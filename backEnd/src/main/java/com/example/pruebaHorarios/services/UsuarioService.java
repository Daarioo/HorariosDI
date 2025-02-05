package com.example.pruebaHorarios.services;

import com.example.pruebaHorarios.entities.Usuario;
import com.example.pruebaHorarios.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Buscando usuario: " + email); // Debug
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        System.out.println("Usuario encontrado: " + usuario);

        return new User(
                usuario.getEmail(), // Identificador del usuario
                usuario.getContraseña(), // Contraseña
                Collections.singletonList(new SimpleGrantedAuthority(usuario.getTipo().name())) // Rol del usuario
        );
    }



    /**
     * Crear un nuevo usuario sin encriptar la contraseña.
     */
    public Usuario createUsuario(Usuario usuario) {
        usuario.setContraseña(usuario.getContraseña()); // No se está encriptando
        return usuarioRepository.save(usuario);
    }


    /**
     * Obtener todos los usuarios.
     */
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Buscar un usuario por ID.
     */
    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Actualizar un usuario sin encriptar la nueva contraseña.
     */
    public Usuario updateUsuario(Integer id, Usuario usuarioDetails) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreUsuario(usuarioDetails.getNombreUsuario());
        usuario.setEmail(usuarioDetails.getEmail());
        usuario.setTipo(usuarioDetails.getTipo());

        // Se guarda la contraseña tal cual sin encriptar
        if (usuarioDetails.getContraseña() != null && !usuarioDetails.getContraseña().isEmpty()) {
            usuario.setContraseña(usuarioDetails.getContraseña());
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * Eliminar un usuario por ID.
     */
    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> buscarPorNombreUsuario(String nombreUsuario) {
        Optional<Usuario> usuario = usuarioRepository.findByNombreUsuario(nombreUsuario);
        System.out.println("Usuario encontrado en DB: " + usuario.orElse(null)); // Debug
        return usuario;
    }

}
