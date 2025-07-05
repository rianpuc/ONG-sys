import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <li>
            <Link
                to={href}
                className={clsx(
                    'rounded-md px-3 py-2 text-lg font-medium transition-colors', // Estilos base para todos os links
                    {
                        'bg-gray-900 text-sky-500': isActive, // Estilos SÓ para o link ativo
                        'text-gray-300 hover:bg-gray-700 hover:text-white': !isActive, // Estilos para os links inativos
                    }
                )}
            >
                {children}
            </Link>
        </li>
    );
};

export default NavLink;