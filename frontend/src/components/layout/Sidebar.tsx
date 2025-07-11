import { createContext, useContext, useState } from "react";

interface SidebarContextType {
    expanded: boolean;
}

interface SidebarProps {
    children: any;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: false });

const Sidebar = ({ children }: SidebarProps) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <aside className="h-screen">
                <nav onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} className="h-full flex flex-col bg-navcolor-100/70 rounded-e-2xl shadow-[0px_0px_25px] shadow-black">
                    <div className="p-4 pb-2 flex items-center overflow-hidden">
                        <h1 className={`text-white text-sm ${expanded ? "text-center" : ""}`}>ONG-sys</h1>
                    </div>
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 p-5">{children}</ul>
                    </SidebarContext.Provider>
                </nav>
            </aside >
        </>
    )
}

export default Sidebar;

export function useSidebar() {
    return useContext(SidebarContext);
}