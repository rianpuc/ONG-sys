import type { ReactNode } from "react";
import "./Card.css"
import { Link } from 'react-router-dom';
interface CardProps {
    to: string;
    children: ReactNode;
}

export function Card({ to, children }: CardProps) {
    return (
        <>
            <div className="flex flex-col shadow-md m-4 border-gray-700 border-1 rounded-md transition duration-500 hover:shadow-3xl hover:scale-103">
                <Link to={to} className="card-body items-center">
                    {children}
                </Link>
            </div>
        </>
    )
}