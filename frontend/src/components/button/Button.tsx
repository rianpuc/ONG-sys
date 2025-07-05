import type { ReactNode } from "react";

interface ButtonProps {
    name: "Criar" | "Procurar" | "Atualizar" | "Deletar" | "Plano";
    children: ReactNode;
    onClick?: () => void;
}

const mapper = {
    "Criar": "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full",
    "Procurar": "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full",
    "Atualizar": "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full",
    "Deletar": "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full",
    "Plano": "bg-stone-500 hover:bg-stone-400 text-white font-bold py-2 px-4 border-b-4 border-stone-700 hover:border-stone-500 rounded"
}

const Button = ({ name, children, onClick }: ButtonProps) => {
    return (
        <button className={mapper[name]} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;