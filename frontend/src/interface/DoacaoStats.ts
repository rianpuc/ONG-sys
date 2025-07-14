import type { TopItem } from "./TopItem";

export interface DoacaoStats {
    doacoesMesAtual: number;
    doacoesMesAnterior: number;
    top3Itens: TopItem[];
}