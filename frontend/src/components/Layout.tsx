import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Tag, FileText } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/pessoas', label: 'Pessoas', icon: Users },
    { path: '/categorias', label: 'Categorias', icon: Tag },
    { path: '/relatorios', label: 'Relatórios', icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex flex-col">
      {/* HEADER (desktop) */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/40">
              💰
            </div>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
              Controle de Gastos
            </h1>
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-purple-50 text-purple-600 border-2 border-purple-300'
                      : 'text-slate-600 hover:bg-purple-50/50 border-2 border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 pb-20 md:pb-8">
        {children}
      </main>

      {/* BOTTOM NAV (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl flex justify-around py-2 z-50">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center text-xs transition ${
                active
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              <Icon size={22} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
