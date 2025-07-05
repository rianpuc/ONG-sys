package com.ong.db.instituicao;

public record InstituicaoResponseDTO(String CNPJ, String Nome, String Endereco) {
    public InstituicaoResponseDTO(Instituicao instituicao) {
        this(instituicao.getCNPJ(), instituicao.getNome(), instituicao.getEndereco());
    }
}
