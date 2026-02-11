'use client';

import React, { useEffect, useState } from 'react';
import { File, Download, Trash2, Loader2, Share2, Edit2, Check, X, Link2 } from 'lucide-react';
import Api from '@/services/Api';
import { useFiles } from '@/contexts/FilesContext';
import ShareModal from './ShareModal';
import LinkShareModal from './LinkShareModal';

interface FileItem {
  id: string;
  originalName: string;
  size: number;
  createdAt: string;
  path: string;
}

export default function FilesList() {
  const { refreshTrigger } = useFiles();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkShareModalOpen, setLinkShareModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Api.getFiles();
      setFiles(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao carregar arquivos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const handleDelete = async (fileId: string) => {
    if (!confirm('Tem certeza que deseja deletar este arquivo?')) return;

    setDeletingId(fileId);
    try {
      await Api.deleteFile(fileId);
      await loadFiles();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao deletar arquivo';
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (fileId: string, fileName: string) => {
    setEditingId(fileId);
    setEditingName(fileName);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return '';
    }
    return filename.substring(lastDotIndex).toLowerCase();
  };

  const handleEditSave = async (fileId: string) => {
    if (!editingName.trim()) return;

    // Validar que a extensão não foi alterada
    const file = files.find(f => f.id === fileId);
    if (file) {
      const oldExt = getFileExtension(file.originalName);
      const newExt = getFileExtension(editingName);

      if (oldExt !== newExt) {
        setError('Não é permitido alterar a extensão do arquivo');
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(true);
    try {
      await Api.updateFile(fileId, editingName);
      await loadFiles();
      setEditingId(null);
      setEditingName('');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao editar arquivo';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
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
        <p className='text-foreground font-medium mb-2'>Nenhum arquivo ainda</p>
        <p className='text-sm text-text'>Clique no botão Upload para começar a adicionar arquivos</p>
      </div>
    );
  }

  return (
    <>
    <div className='space-y-2'>
      {files.map((file) => (
        <div
          key={file.id}
          className='flex items-center justify-between p-4 bg-elevation-2 rounded-lg hover:bg-elevation-3 transition-colors'
        >
          <div className='flex items-center gap-4 flex-1 min-w-0'>
            <File size={24} className='text-primary shrink-0' />
            <div className='min-w-0 flex-1'>
              {editingId === file.id ? (
                <div className='flex gap-2 mb-2'>
                  <input
                    type='text'
                    value={editingName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const oldExt = getFileExtension(file.originalName);
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
                  {file.originalName}
                </p>
              )}
              <div className='flex gap-4 text-xs text-text'>
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            {editingId === file.id ? (
              <>
                <button
                  onClick={() => handleEditSave(file.id)}
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
                <button
                  onClick={() => handleEditStart(file.id, file.originalName)}
                  className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                  title='Editar nome'
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setSelectedFileName(file.originalName);
                    setShareModalOpen(true);
                  }}
                  className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                  title='Compartilhar com usuário'
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setSelectedFileName(file.originalName);
                    setLinkShareModalOpen(true);
                  }}
                  className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                  title='Compartilhar por link'
                >
                  <Link2 size={18} />
                </button>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/download/${file.id}`}
                  download={file.originalName}
                  className='p-2 hover:bg-elevation-1 rounded transition-colors text-text hover:text-foreground'
                  title='Baixar arquivo'
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                  className='p-2 hover:bg-error/20 rounded transition-colors text-text hover:text-error disabled:opacity-50'
                  title='Deletar arquivo'
                >
                  {deletingId === file.id ? (
                    <Loader2 size={18} className='animate-spin' />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>

      {selectedFileId && (
        <>
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => {
              setShareModalOpen(false);
              setSelectedFileId(null);
              setSelectedFileName('');
            }}
            fileId={selectedFileId || ''}
            fileName={selectedFileName}
          />
          <LinkShareModal
            isOpen={linkShareModalOpen}
            onClose={() => {
              setLinkShareModalOpen(false);
              setSelectedFileId(null);
              setSelectedFileName('');
            }}
            fileId={selectedFileId || ''}
            fileName={selectedFileName}
          />
        </>
      )}
    </>
  );
}
