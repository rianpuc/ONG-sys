export interface Doador {
    ID_Doador: number;
    CPF?: string;
    CNPJ?: string;
    Nome_Doador: string;
    Tipo_Doador: "Fisica" | "Juridica";
}