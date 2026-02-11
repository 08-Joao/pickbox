'use client';

import React, { useEffect, useState } from 'react';
import { File, Download, Loader2, User, Edit2, Check, X } from 'lucide-react';
import Api from '@/services/Api';

interface SharedFile {
  id: string;
  file: {
    id: string;
    originalName: string;
    size: number;
    createdAt: string;
    path: string;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
  role: 'VIEWER' | 'EDITOR';
  createdAt: string;
}

export default function SharedWithMeList() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSharedFiles();
  }, []);

  const loadSharedFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Api.getSharedWithMe();
      setFiles(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao carregar arquivos compartilhados';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

  const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return '';
    }
    return filename.substring(lastDotIndex).toLowerCase();
  };

  const handleEditStart = (shareId: string, fileId: string, fileName: string) => {
    setEditingId(shareId);
    setEditingFileId(fileId);
    setEditingName(fileName);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingFileId(null);
    setEditingName('');
  };

  const handleEditSave = async () => {
    if (!editingName.trim() || !editingFileId) return;

    setIsSaving(true);
    try {
      await Api.updateFile(editingFileId, editingName);
      await loadSharedFiles();
      setEditingId(null);
      setEditingFileId(null);
      setEditingName('');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao editar arquivo';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 size={32} className='text-primary animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 bg-error/10 border border-error rounded-lg text-error'>
        <p>{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <File size={48} className='text-text mb-4' />
        <p className='text-foreground font-medium mb-2'>Nenhum arquivo compartilhado</p>
        <p className='text-sm text-text'>Peça para alguém compartilhar um arquivo com você</p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {files.map((share) => (
        <div
          key={share.id}
          className='flex items-center justify-between p-4 bg-elevation-2 rounded-lg hover:bg-elevation-3 transition-colors'
        >
          <div className='flex items-center gap-4 flex-1 min-w-0'>
            <File size={24} className='text-primary shrink-0' />
            <div className='min-w-0 flex-1'>
              {editingId === share.id ? (
                <div className='flex gap-2 mb-2'>
                  <input
                    type='text'
                    value={editingName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const oldExt = getFileExtension(share.file.originalName);
                      const newExt = getFileExtension(newValue);

                      // Se a extensão foi alterada ou removida, não permitir
                      if (oldExt) {
                        if (!newExt || oldExt !== newExt) {
                          return;
                        }
                      }

                      setEditingName(newValue);
                    }}
                    className='flex-1 px-2 py-1 text-sm bg-elevation-1 border border-border rounded text-foreground focus:outline-none focus:border-primary'
                    autoFocus
                  />
                </div>
              ) : (
                <p className='text-sm font-medium text-foreground truncate'>
                  {share.file.originalName}
                </p>
              )}
              <div className='flex gap-4 text-xs text-text'>
                <span>{formatFileSize(share.file.size)}</span>
                <span>{formatDate(share.file.createdAt)}</span>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <User size={14} className='text-text' />
                <span className='text-xs text-text'>
                  Compartilhado por {share.file.owner.name}
                </span>
                <span className='text-xs bg-primary/20 text-primary px-2 py-1 rounded'>
                  {share.role === 'VIEWER' ? 'Visualizador' : 'Editor'}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            {editingId === share.id && share.role === 'EDITOR' ? (
              <>
                <button
                  onClick={() => handleEditSave()}
                  disabled={isSaving || !editingName.trim()}
                  className='p-2 hover:bg-primary/20 rounded transition-colors text-primary disabled:opacity-50'
                  title='Salvar'
                >
                  {isSaving ? (
                    <Loader2 size={18} className='animate-spin' />
                  ) : (
                    <Check size={18} />
                  )}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={isSaving}
                  className='p-2 hover:bg-error/20 rounded transition-colors text-error disabled:opacity-50'
                  title='Cancelar'
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                {share.role === 'EDITOR' && (
                  <button
                    onClick={() => handleEditStart(share.id, share.file.id, share.file.originalName)}
                    className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                    title='Editar nome'
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/download/${share.file.id}`}
                  download={share.file.originalName}
                  className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                  title='Baixar arquivo'
                >
                  <Download size={18} />
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
