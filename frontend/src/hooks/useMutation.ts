import { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Definimos os tipos de método que nosso hook aceitará
type HttpMethod = 'POST' | 'PUT' | 'DELETE';

// O estado que nosso hook vai gerenciar e retornar
interface MutationState<TData> {
    data: TData | null;
    isLoading: boolean;
    error: string | null;
}

// O que nosso hook retorna: o estado e a função para disparar a mutação
interface UseMutationResult<TData, TVariables> {
    execute: (variables?: TVariables, id?: number | string) => Promise<TData>;
    isLoading: boolean;
    error: string | null;
    data: TData | null;
}

const useMutation = <TData = any, TVariables = any>(baseUrl: string, method: HttpMethod): UseMutationResult<TData, TVariables> => {
    const [state, setState] = useState<MutationState<TData>>({
        data: null,
        isLoading: false,
        error: null,
    });
    // Esta é a função que será retornada e chamada pelos nossos componentes
    const execute = async (variables?: TVariables, id?: number | string): Promise<TData> => {
        setState({ data: null, isLoading: true, error: null });
        try {
            // Monta a URL final (com ID para PUT e DELETE)
            const url = id ? `${baseUrl}/${id}` : baseUrl;
            const response = await axios({
                method,
                url: `http://localhost:8080${url}`,
                data: variables,
            });

            // 2. Sucesso! Atualiza o estado com os dados e finaliza o carregamento
            setState({ data: response.data, isLoading: false, error: null });
            return response.data;

        } catch (err: any) {
            // 3. Erro! Guarda a mensagem de erro e finaliza o carregamento
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro inesperado.';
            setState({ data: null, isLoading: false, error: errorMessage });
            // Lança o erro para que o componente que chamou também possa tratá-lo, se quiser
            throw new Error(errorMessage);
        }
    };

    return { execute, ...state };
};

export default useMutation;