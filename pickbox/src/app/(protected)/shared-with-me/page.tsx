'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SharedWithMe() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Compartilhado Comigo</h1>
        <p className="text-text">Arquivos que outras pessoas compartilharam com você</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📄</div>
          <h3 className="font-semibold text-foreground mb-1">Projeto Importante</h3>
          <p className="text-sm text-text">Compartilhado por João</p>
        </div>

        <div className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-foreground mb-1">Relatório Q4</h3>
          <p className="text-sm text-text">Compartilhado por Maria</p>
        </div>
      </div>
    </div>
  );
}
