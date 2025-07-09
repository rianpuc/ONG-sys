package com.ong.db.doador;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)

public record DoadorRequestDTO(String CPF, String CNPJ, String Nome_Doador, String Tipo_Doador) {

}
