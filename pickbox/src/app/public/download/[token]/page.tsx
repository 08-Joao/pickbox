'use client';

import React, { useEffect, useState, use } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import Api from '@/services/Api';

interface FileInfo {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function PublicDownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadFileInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await Api.getFileInfoByLink(token);
        setFileInfo(response.data);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          'Link inválido, expirado ou arquivo não encontrado';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadFileInfo();
  }, [token]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await Api.downloadFileByLink(token);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo?.originalName || 'download');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao baixar arquivo');
    } finally {
      setIsDownloading(false);
    }
  };

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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-elevation-1 to-elevation-2 flex items-center justify-center p-4'>
      <div className='bg-elevation-1 rounded-lg shadow-lg max-w-md w-full p-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Pickbox</h1>
          <p className='text-text mb-8'>Download de arquivo compartilhado</p>
        </div>

        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <Loader2 size={40} className='text-primary animate-spin mb-4' />
            <p className='text-text'>Carregando informações do arquivo...</p>
          </div>
        ) : error ? (
          <div className='space-y-4'>
            <div className='p-4 bg-error/10 border border-error rounded-lg flex gap-3'>
              <AlertCircle size={20} className='text-error shrink-0 mt-0.5' />
              <div>
                <p className='font-medium text-error'>Erro</p>
                <p className='text-sm text-error/80'>{error}</p>
              </div>
            </div>
            <a
              href='/'
              className='block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors'
            >
              Voltar para Pickbox
            </a>
          </div>
        ) : fileInfo ? (
          <div className='space-y-6'>
            <div className='bg-elevation-2 rounded-lg p-6 space-y-4'>
              <div>
                <p className='text-sm text-text mb-1'>Nome do arquivo</p>
                <p className='text-lg font-semibold text-foreground wrap-break-word'>
                  {fileInfo.originalName}
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-text mb-1'>Tamanho</p>
                  <p className='font-medium text-foreground'>
                    {formatFileSize(fileInfo.size)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-text mb-1'>Data</p>
                  <p className='font-medium text-foreground text-sm'>
                    {formatDate(fileInfo.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium'
            >
              {isDownloading ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Download size={20} />
              )}
              {isDownloading ? 'Baixando...' : 'Baixar Arquivo'}
            </button>

            <a
              href='/'
              className='block w-full text-center px-4 py-2 bg-elevation-2 text-foreground rounded-lg hover:bg-elevation-3 transition-colors'
            >
              Voltar para Pickbox
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
