'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Folder, FolderOpen, Group, Shredder, Users, Users2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-elevation-1 border-r border-border h-screen sticky top-16 overflow-y-auto">
      <div className="p-6">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wider mb-4">
            Menu
          </h3>

          <Link
            href="/my-files"
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
  );
}
