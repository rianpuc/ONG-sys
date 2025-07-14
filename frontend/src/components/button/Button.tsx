import type { ReactNode } from "react";

interface ButtonProps {
    name: "Criar" | "Procurar" | "Atualizar" | "Deletar" | "Plano";
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

const mapper = {
    "Criar": "transition-colors bg-insertbtn-100 hover:bg-green-700 text-white cursor-pointer font-bold py-2 px-4 rounded-lg",
    "Procurar": "transition-colors bg-searchbtn-100 hover:bg-blue-700 text-white cursor-pointer font-bold py-2 px-4 rounded-lg",
    "Atualizar": "transition-colors bg-updatebtn-100 hover:bg-updatebtn-100/80 cursor-pointer text-white font-bold py-2 px-4 rounded-lg",
    "Deletar": "transition-colors bg-deletebtn-100 hover:bg-deletebtn-100/80 cursor-pointer text-white font-bold py-2 px-4 rounded-lg",
    "Plano": "transition-colors bg-stone-500 hover:bg-stone-400 text-white cursor-pointer font-bold py-2 px-4 border-b-4 border-stone-700 hover:border-stone-500 rounded"
}

const disabledMapper = {
    "Criar": "cursor-not-allowed opacity-80 bg-insertbtn-100 text-white font-bold py-2 px-4 rounded-lg",
    "Procurar": "cursor-not-allowed opacity-80 bg-searchbtn-100 text-white font-bold py-2 px-4 rounded-lg",
    "Atualizar": "cursor-not-allowed opacity-80 bg-updatebtn-100 text-white font-bold py-2 px-4 rounded-lg",
    "Deletar": "cursor-not-allowed opacity-80 bg-deletebtn-100 text-white font-bold py-2 px-4 rounded-lg",
    "Plano": "cursor-not-allowed opacity-75 bg-stone-400 text-white font-bold py-2 px-4 border-b-4 border-stone-700 hover:border-stone-500 rounded"
}

const Button = ({ name, children, disabled, onClick }: ButtonProps) => {
    return (
        <button disabled={disabled} className={`col-span-3 row-span-3 ${disabled ? disabledMapper[name] : mapper[name]}`} onClick={onClick} >
            {children}
        </button>
    )
}

export default Button;