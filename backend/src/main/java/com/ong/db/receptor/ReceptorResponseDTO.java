package com.ong.db.receptor;

public record ReceptorResponseDTO(String CPF, String Nome, String Endereco) {
    public ReceptorResponseDTO(Receptor receptor) {
        this(receptor.getCPF(), receptor.getNome(), receptor.getEndereco());
    }
}
