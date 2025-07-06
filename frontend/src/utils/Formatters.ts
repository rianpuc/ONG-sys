const formatCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export const formatIdentificacao = (documento: string, tipo: string): string => {
    if (tipo.toLowerCase() === 'fisica') {
        return formatCPF(documento);
    }
    return formatCNPJ(documento);
}