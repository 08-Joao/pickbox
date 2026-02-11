'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FilesList from '@/components/FilesList';

export default function MyFiles() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Meus Arquivos</h1>
        <p className="text-text">Bem-vindo, {user?.name}!</p>
      </div>

      <FilesList />
    </div>
  );
}