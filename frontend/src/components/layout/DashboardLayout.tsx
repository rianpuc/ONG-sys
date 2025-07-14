import React from 'react';

interface DashboardLayoutProps {
    statsSection: React.ReactNode;
    actionsSection: React.ReactNode;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-full max-w-10xl p-8 mx-auto flex flex-col gap-8">
            {children}
        </div>
    );
};

export default DashboardLayout;