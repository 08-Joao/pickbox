'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Trash2, Loader2, Plus, Calendar } from 'lucide-react';
import Api from '@/services/Api';

interface FileLink {
  id: string;
  token: string;
  expiresAt: string | null;
  createdAt: string;
}

interface LinkShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

export default function LinkShareModal({
  isOpen,
  onClose,
  fileId,
  fileName,
}: LinkShareModalProps) {
  const [links, setLinks] = useState<FileLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadLinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Api.getFileLinks(fileId);
      setLinks(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao carregar links';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLinks();
    }
  }, [isOpen, fileId]);

  const handleCreateLink = async () => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await Api.createFileLink(fileId, expiresAt || undefined);
      setLinks([response.data, ...links]);
      setExpiresAt('');
      setSuccess('Link criado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao criar link';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;

    setDeletingId(linkId);
    setError(null);
    try {
      await Api.deleteFileLink(linkId);
      setLinks(links.filter(l => l.id !== linkId));
      setSuccess('Link deletado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao deletar link';
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/public/download/${token}`;
    navigator.clipboard.writeText(link);
    setSuccess('Link copiado para a área de transferência!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-elevation-1 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-elevation-1 flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-xl font-semibold text-foreground'>
            Compartilhar por Link: {fileName}
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-elevation-2 rounded transition-colors'
          >
            <X size={20} className='text-text' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {error && (
            <div className='p-4 bg-error/10 border border-error rounded-lg text-error text-sm'>
              {error}
            </div>
          )}

          {success && (
            <div className='p-4 bg-success/10 border border-success rounded-lg text-success text-sm'>
              {success}
            </div>
          )}

          <div className='space-y-4'>
            <h3 className='font-medium text-foreground'>Criar novo link</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Data de expiração (opcional)
                </label>
                <input
                  type='datetime-local'
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className='w-full px-3 py-2 bg-elevation-2 border border-border rounded text-foreground focus:outline-none focus:border-primary'
                />
              </div>
              <button
                onClick={handleCreateLink}
                disabled={isCreating}
                className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50'
              >
                {isCreating ? (
                  <Loader2 size={18} className='animate-spin' />
                ) : (
                  <Plus size={18} />
                )}
                Criar Link
              </button>
            </div>
          </div>

          <div className='border-t border-border pt-6'>
            <h3 className='font-medium text-foreground mb-4'>Links ativos</h3>

            {isLoading ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 size={24} className='text-primary animate-spin' />
              </div>
            ) : links.length === 0 ? (
              <p className='text-sm text-text text-center py-8'>
                Nenhum link criado ainda
              </p>
            ) : (
              <div className='space-y-3'>
                {links.map((link) => (
                  <div
                    key={link.id}
                    className={`p-4 bg-elevation-2 rounded-lg border border-border ${
                      isExpired(link.expiresAt) ? 'opacity-50' : ''
                    }`}
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-2'>
                          <code className='text-xs bg-elevation-1 px-2 py-1 rounded text-primary break-all'>
                            {link.token.substring(0, 16)}...
                          </code>
                          {isExpired(link.expiresAt) && (
                            <span className='text-xs bg-error/20 text-error px-2 py-1 rounded'>
                              Expirado
                            </span>
                          )}
                        </div>
                        <div className='flex flex-col gap-1 text-xs text-text'>
                          <span>Criado em: {formatDate(link.createdAt)}</span>
                          {link.expiresAt && (
                            <span className='flex items-center gap-1'>
                              <Calendar size={12} />
                              Expira em: {formatDate(link.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2 shrink-0'>
                        <button
                          onClick={() => handleCopyLink(link.token)}
                          className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                          title='Copiar link'
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          disabled={deletingId === link.id}
                          className='p-2 hover:bg-error/20 rounded transition-colors text-text hover:text-error disabled:opacity-50'
                          title='Deletar link'
                        >
                          {deletingId === link.id ? (
                            <Loader2 size={18} className='animate-spin' />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
