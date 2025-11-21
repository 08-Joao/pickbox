'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function MyFiles() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Meus Arquivos</h1>
        <p className="text-text">Bem-vindo, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📄</div>
          <h3 className="font-semibold text-foreground mb-1">Documento 1</h3>
          <p className="text-sm text-text">Criado em 21 de nov</p>
        </div>

        <div className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-foreground mb-1">Planilha</h3>
          <p className="text-sm text-text">Criado em 20 de nov</p>
        </div>

        <div className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="font-semibold text-foreground mb-1">Imagem</h3>
          <p className="text-sm text-text">Criado em 19 de nov</p>
        </div>
      </div>
    </div>
  );
}