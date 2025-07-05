import NavLink from '../ui/NavLink';

const navItems = [
    { href: '/', label: 'Início' },
    { href: '/doacoes', label: 'Doações' },
    { href: '/doadores', label: 'Doadores' },
    { href: '/entregas', label: 'Entregas' },
    { href: '/eventos', label: 'Eventos' },
    { href: '/itens', label: 'Itens' },
    { href: '/receptores', label: 'Receptores' },
    { href: '/voluntarios', label: 'Voluntários' },
];

const Navbar = () => {
    return (
        <nav>
            <ul className="flex space-x-4">
                {navItems.map((item) => (
                    <NavLink key={item.href} href={item.href}>
                        {item.label}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;