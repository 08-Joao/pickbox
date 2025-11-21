'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-text">Gerencie suas preferências e informações pessoais</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-elevation-1 rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Informações Pessoais</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Nome</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Membro desde</label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : ''}
                disabled
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
