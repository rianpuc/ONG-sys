import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from "./Sidebar";

interface SidebarItem {
    icon?: React.ReactNode;
    text?: string;
    active?: boolean;
    alert?: boolean;
    href: string;
}

const SidebarItem = ({ icon, text, active, href }: SidebarItem) => {
    const location = useLocation();
    const isActive = location.pathname === href;
    const { expanded } = useSidebar();
    return (
        <li className={`relative font-medium rounded-xl cursor-pointer transition-colors group 
        ${isActive ? "bg-iconborder-100" : "bg-gradient-to-tr from-iconborder-200 to-sky-950"}
        ${!expanded ? "bg-iconborder-100" : ""}`}>
            <Link className="flex items-center text-white px-4 py-4 my-4" to={href}>
                {icon}
                <span className={`overflow-hidden transition-all text-white ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            </Link>
        </li>
    )

}

export default SidebarItem;