package com.avaliaplus.repository;

import com.avaliaplus.model.Formulario;
import com.avaliaplus.model.enums.TipoFormulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormularioRepository extends JpaRepository<Formulario, Long> {
    List<Formulario> findByEventoConselhoId(Long eventoId);
    List<Formulario> findByUsuarioId(Long usuarioId);
    List<Formulario> findByEventoConselhoIdAndTipo(Long eventoId, TipoFormulario tipo);
    Optional<Formulario> findByUsuarioIdAndEventoConselhoIdAndTipo(Long usuarioId, Long eventoId, TipoFormulario tipo);
    long countByEventoConselhoIdAndTipo(Long eventoId, TipoFormulario tipo);
}
