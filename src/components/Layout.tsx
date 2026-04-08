import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-slate-900 text-slate-50">{children}</div>;
};

export default Layout;
