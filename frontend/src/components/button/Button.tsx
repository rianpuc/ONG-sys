import type { ReactNode } from "react";

interface ButtonProps {
    name: "Criar" | "Procurar" | "Atualizar" | "Deletar" | "Plano";
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

const mapper = {
    "Criar": "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full",
    "Procurar": "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full",
    "Atualizar": "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full",
    "Deletar": "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full",
    "Plano": "bg-stone-500 hover:bg-stone-400 text-white font-bold py-2 px-4 border-b-4 border-stone-700 hover:border-stone-500 rounded"
}

const disabledMapper = {
    "Criar": "opacity-80 bg-green-700 text-white font-bold py-2 px-4 rounded-full",
    "Procurar": "opacity-80 bg-blue-700 text-white font-bold py-2 px-4 rounded-full",
    "Atualizar": "opacity-80 bg-yellow-700 text-white font-bold py-2 px-4 rounded-full",
    "Deletar": "opacity-80 bg-red-700 text-white font-bold py-2 px-4 rounded-full",
    "Plano": "opacity-75 bg-stone-400 text-white font-bold py-2 px-4 border-b-4 border-stone-700 hover:border-stone-500 rounded"
}

const Button = ({ name, children, disabled, onClick }: ButtonProps) => {
    return (
        <button disabled={disabled} className={disabled ? disabledMapper[name] : mapper[name]} onClick={onClick} >
            {children}
        </button>
    )
}

export default Button;