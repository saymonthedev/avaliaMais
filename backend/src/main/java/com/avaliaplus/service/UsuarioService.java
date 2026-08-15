package com.avaliaplus.service;

import com.avaliaplus.dto.usuario.*;
import com.avaliaplus.model.Turma;
import com.avaliaplus.model.Usuario;
import com.avaliaplus.repository.TurmaRepository;
import com.avaliaplus.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado: " + request.getEmail());
        }

        Turma turma = null;
        if (request.getTurmaId() != null) {
            turma = turmaRepository.findById(request.getTurmaId())
                    .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .perfil(request.getPerfil())
                .turma(turma)
                .isRepresentante(request.getIsRepresentante())
                .ativo(true)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado")));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        if (!usuario.getEmail().equals(request.getEmail()) && usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já em uso");
        }

        Turma turma = null;
        if (request.getTurmaId() != null) {
            turma = turmaRepository.findById(request.getTurmaId())
                    .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setPerfil(request.getPerfil());
        usuario.setTurma(turma);
        usuario.setIsRepresentante(request.getIsRepresentante());

        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void desativar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    public UsuarioResponse toResponse(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setNome(u.getNome());
        r.setEmail(u.getEmail());
        r.setPerfil(u.getPerfil());
        r.setTurmaId(u.getTurma() != null ? u.getTurma().getId() : null);
        r.setTurmaNome(u.getTurma() != null ? u.getTurma().getNome() : null);
        r.setIsRepresentante(u.getIsRepresentante());
        r.setAtivo(u.getAtivo());
        r.setDataCriacao(u.getDataCriacao());
        return r;
    }
}
