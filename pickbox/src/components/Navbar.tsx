'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import Image from 'next/image';
import { Button } from './ui/button';
import { Upload, Menu } from 'lucide-react';
import UploadModal from './UploadModal';

export default function Navbar() {
  const router = useRouter();
  const { user, signout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const handleSignout = async () => {
    try {
      await signout();
      router.push('/signin');
    } catch (error) {
      // Error handling for logout
    }
  };

  return (
    <nav className="bg-elevation-1 border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Menu Button Mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 hover:bg-elevation-2 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-foreground" />
        </button>

        {/* Logo */}
        <Link href="/my-files" className="flex items-center gap-2"> 
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
        </Link>

        <div className="flex gap-4 items-center">

        <Button onClick={() => setIsOpen(true)}>
          Upload
          <Upload />
        </Button>
        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-elevation-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {user.name}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-elevation-1 border border-border rounded-lg shadow-lg py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-text">{user.email}</p>
                </div>

                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-elevation-2 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Configurações
                </Link>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleSignout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-elevation-2 transition-colors"
                >
                  Deslogar
                </button>
              </div>
            )}
          </div>
        )}

        </div>
      </div>
      <UploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
}
