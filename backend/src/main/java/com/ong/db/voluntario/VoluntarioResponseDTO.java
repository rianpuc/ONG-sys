package com.ong.db.voluntario;

public record VoluntarioResponseDTO(String CPF, String Nome, String Funcao, String nomeInstituicao) {
    public VoluntarioResponseDTO(Voluntario voluntario) {
        this(voluntario.getCPF(), voluntario.getNome(), voluntario.getFuncao(), voluntario.getInstituicao().getNome());
    }
}
