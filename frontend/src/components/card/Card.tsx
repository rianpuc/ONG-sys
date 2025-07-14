import type { ReactNode } from "react";
import { Link } from 'react-router-dom';
interface CardProps {
    to: string;
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function Card({ to, icon, title, description, className }: CardProps) {
    return (
        <>
            <Link to={to} className={`bg-blue-600 text-white p-6 rounded-2xl flex flex-col text-center items-center shadow-[0px_2px_10px] shadow-black ${className}`}>
                <div className="">
                    {icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-blue-200 flex-grow">{description}</p>
            </Link>
        </>
    )
}