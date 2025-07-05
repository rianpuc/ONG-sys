package com.ong.db.doador;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)

public record DoadorResponseDTO(Integer ID_Doador, String CPF, String CNPJ, String Nome_Doador, String Tipo_Doador) {
    public DoadorResponseDTO(Doador doador) {
        this(doador.getID_Doador(), doador.getCPF(), doador.getCNPJ(), doador.getNome_Doador(),
                doador.getTipo_Doador());
    }
}
