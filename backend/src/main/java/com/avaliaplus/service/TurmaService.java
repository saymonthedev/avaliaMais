package com.avaliaplus.service;

import com.avaliaplus.model.Turma;
import com.avaliaplus.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository turmaRepository;

    @Transactional
    public Turma criar(Turma turma) {
        return turmaRepository.save(turma);
    }

    public List<Turma> listar() {
        return turmaRepository.findAll();
    }

    public Turma buscarPorId(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));
    }

    @Transactional
    public Turma atualizar(Long id, Turma dados) {
        Turma turma = buscarPorId(id);
        turma.setNome(dados.getNome());
        turma.setAno(dados.getAno());
        turma.setCurso(dados.getCurso());
        return turmaRepository.save(turma);
    }

    @Transactional
    public void deletar(Long id) {
        turmaRepository.deleteById(id);
    }
}
