'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFiles } from '@/contexts/FilesContext';
import Api from '@/services/Api';
import { FileText, Share2, Download, Clock, HardDrive } from 'lucide-react';
import Link from 'next/link';

interface FileItem {
  id: string;
  originalName: string;
  size: number;
  createdAt: string;
  path: string;
}

interface FileStats {
  totalFiles: number;
  totalSize: number;
  recentFiles: FileItem[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { refreshTrigger } = useFiles();
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    recentFiles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await Api.getFiles();
        const files = response.data || [];
        
        const totalSize = files.reduce((sum: number, file: FileItem) => sum + (file.size || 0), 0);
        const recentFiles = [...files]
          .sort((a: FileItem, b: FileItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalFiles: files.length,
          totalSize: totalSize,
          recentFiles: recentFiles,
        });
      } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [refreshTrigger]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-text">Aqui está um resumo da sua conta</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Files Card */}
        <div className="bg-elevation-1 rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text text-sm mb-1">Total de Arquivos</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalFiles}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="text-primary" size={24} />
            </div>
          </div>
        </div>

        {/* Storage Used Card */}
        <div className="bg-elevation-1 rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text text-sm mb-1">Espaço Usado</p>
              <p className="text-3xl font-bold text-foreground">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <HardDrive className="text-primary" size={24} />
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-elevation-1 rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text text-sm mb-1">Ações Rápidas</p>
              <p className="text-sm text-text/70">Gerencie seus arquivos</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Share2 className="text-primary" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link
          href="/my-files"
          className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Meus Arquivos</h3>
              <p className="text-text text-sm">Visualize e gerencie seus arquivos</p>
            </div>
          </div>
        </Link>

        <Link
          href="/shared-with-me"
          className="bg-elevation-1 rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Share2 className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Compartilhado Comigo</h3>
              <p className="text-text text-sm">Arquivos compartilhados por outros</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Files */}
      {stats.recentFiles.length > 0 && (
        <div className="bg-elevation-1 rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock size={20} />
              Arquivos Recentes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-text">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-text">Tamanho</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-text">Data</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-text">Ações</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentFiles.map((file) => (
                  <tr key={file.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium truncate">
                      {file.originalName}
                    </td>
                    <td className="px-6 py-4 text-text text-sm">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 text-text text-sm">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <a
                          href={`http://localhost:3001/uploads/${file.path}`}
                          download
                          className="p-2 hover:bg-elevation-2 rounded-lg transition-colors text-text hover:text-primary"
                          title="Download"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border text-center">
            <Link
              href="/my-files"
              className="text-primary hover:underline font-medium"
            >
              Ver todos os arquivos →
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.totalFiles === 0 && !loading && (
        <div className="bg-elevation-1 rounded-lg border border-border p-12 text-center">
          <FileText className="mx-auto mb-4 text-text/50" size={48} />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum arquivo ainda
          </h3>
          <p className="text-text mb-6">
            Comece a fazer upload de seus arquivos para vê-los aqui
          </p>
          <Link
            href="/my-files"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Ir para Meus Arquivos
          </Link>
        </div>
      )}
    </div>
  );
}
