'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Folder, FolderOpen, Shredder } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();

  const isActive = (path: string) => pathname === path;

  const handleLinkClick = () => {
    closeSidebar();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-elevation-1 border-r border-border overflow-y-auto transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider mb-4">
              Menu
            </h3>

            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-elevation-2'
              }`}
            >
              <LayoutDashboard size={24} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/my-files"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive('/my-files')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-elevation-2'
              }`}
            >
              {isActive('/my-files') ? (
                <FolderOpen size={24} />
              ) : (
                <Folder size={24} />
              )}
              <span className="font-medium">Meus Arquivos</span>
            </Link>

            <Link
              href="/shared-with-me"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive('/shared-with-me')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-elevation-2'
              }`}
            >
              {isActive('/shared-with-me') ? (
                <Shredder size={24} />
              ) : (
                <Shredder size={24} />
              )}
              <span className="font-medium">Compartilhado Comigo</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
