'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SharedWithMeList from '@/components/SharedWithMeList';

export default function SharedWithMe() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Compartilhado Comigo</h1>
        <p className="text-text">Arquivos que outras pessoas compartilharam com você</p>
      </div>

      <SharedWithMeList />
    </div>
  );
}
