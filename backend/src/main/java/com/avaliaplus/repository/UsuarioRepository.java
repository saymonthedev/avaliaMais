package com.avaliaplus.repository;

import com.avaliaplus.model.Usuario;
import com.avaliaplus.model.enums.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Usuario> findByTurmaId(Long turmaId);
    List<Usuario> findByPerfil(PerfilUsuario perfil);
    List<Usuario> findByTurmaIdAndIsRepresentanteTrue(Long turmaId);
    long countByPerfil(PerfilUsuario perfil);
}
