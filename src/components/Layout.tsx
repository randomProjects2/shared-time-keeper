
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-6 pb-16 animate-fade-in">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
