'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-elevation-1 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Pickbox</div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Ir para Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-primary hover:bg-elevation-2 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Gerenciador de Arquivos Seguro
        </h1>
        <p className="text-xl text-text mb-8 max-w-2xl mx-auto">
          Armazene, organize e compartilhe seus arquivos com segurança. Acesso rápido e fácil de qualquer lugar.
        </p>
        <div className="flex gap-4 justify-center">
          {!isAuthenticated && (
            <>
              <Link
                href="/signin"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-elevation-1 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Recursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Seguro</h3>
              <p className="text-text">
                Seus arquivos são protegidos com criptografia de ponta a ponta.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Rápido</h3>
              <p className="text-text">
                Upload e download instantâneos com velocidade máxima.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Compartilhável</h3>
              <p className="text-text">
                Compartilhe arquivos com controle total de permissões.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}