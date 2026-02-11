'use client';

import React, { useState, useEffect } from 'react';
import { X, Share2, Trash2, Loader2, AlertCircle, Copy, Check, User } from 'lucide-react';
import { Button } from './ui/button';
import Api from '@/services/Api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

interface FileShare {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: 'VIEWER' | 'EDITOR';
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function ShareModal({ isOpen, onClose, fileId, fileName }: ShareModalProps) {
  const [shares, setShares] = useState<FileShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [isSharing, setIsSharing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadShares();
    }
  }, [isOpen, fileId]);

  useEffect(() => {
    if (email.trim()) {
      searchUser();
    } else {
      setUserProfile(null);
    }
  }, [email]);

  const searchUser = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const response = await Api.getUserByEmail(email);
      setUserProfile(response.data || null);
    } catch (err: any) {
      setUserProfile(null);
    } finally {
      setIsSearching(false);
    }
  };

  const loadShares = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Api.getFileShares(fileId);
      setShares(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao carregar compartilhamentos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!userProfile?.id) return;

    setIsSharing(true);
    setError(null);
    try {
      // Compartilhar arquivo com o usuário
      await Api.shareFile(fileId, userProfile.id, role);
      setEmail('');
      setRole('VIEWER');
      setUserProfile(null);
      await loadShares();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao compartilhar arquivo';
      setError(errorMessage);
    } finally {
      setIsSharing(false);
    }
  };

  const handleUnshare = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este compartilhamento?')) return;

    setDeletingId(userId);
    try {
      await Api.unshareFile(fileId, userId);
      await loadShares();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao remover compartilhamento';
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-elevation-1 w-full max-w-2xl h-auto max-h-[80vh] p-6 rounded-xl flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <Share2 size={24} className='text-primary' />
            <h1 className='text-2xl font-bold text-foreground'>Compartilhar: {fileName}</h1>
          </div>
          <button
            onClick={onClose}
            className='p-1 hover:bg-elevation-2 rounded-lg transition-colors'
          >
            <X size={24} className='text-foreground' />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className='flex items-center gap-3 p-4 mb-6 bg-error/10 border border-error rounded-lg'>
            <AlertCircle size={20} className='text-error shrink-0' />
            <p className='text-sm text-error'>{error}</p>
          </div>
        )}

        {/* Share Form */}
        <div className='mb-6 p-4 bg-elevation-2 rounded-lg'>
          <div className='flex flex-col gap-4'>
            <input
              type='email'
              placeholder='Digite o email do usuário'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='px-3 py-2 bg-elevation-1 border border-border rounded-lg text-foreground placeholder-text focus:outline-none focus:border-primary'
              disabled={isSharing}
            />

            {/* User Profile Preview */}
            {userProfile && (
              <div className='flex items-center justify-between p-3 bg-elevation-1 rounded-lg border border-primary/30'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center'>
                    <User size={20} className='text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-foreground'>{userProfile.name}</p>
                    <p className='text-xs text-text'>{userProfile.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'VIEWER' | 'EDITOR')}
                    className='px-2 py-1 text-sm bg-elevation-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary'
                    disabled={isSharing}
                  >
                    <option value='VIEWER'>Visualizador</option>
                    <option value='EDITOR'>Editor</option>
                  </select>
                  <Button
                    onClick={handleShare}
                    disabled={isSharing}
                    className='flex items-center gap-2'
                  >
                    {isSharing ? (
                      <>
                        <Loader2 size={16} className='animate-spin' />
                        Compartilhando...
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        Compartilhar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {isSearching && email.trim() && !userProfile && (
              <div className='flex items-center justify-center py-2'>
                <Loader2 size={18} className='text-primary animate-spin' />
              </div>
            )}

            {email.trim() && !userProfile && !isSearching && (
              <p className='text-sm text-text'>Usuário não encontrado</p>
            )}
          </div>
        </div>

        {/* Shares List */}
        <div className='flex-1 overflow-y-auto mb-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 size={32} className='text-primary animate-spin' />
            </div>
          ) : shares.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-text'>Nenhum compartilhamento ainda</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {shares.map((share) => (
                <div
                  key={share.id}
                  className='flex items-center justify-between p-4 bg-elevation-2 rounded-lg'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {share.user.name}
                    </p>
                    <p className='text-xs text-text truncate'>{share.user.email}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs bg-primary/20 text-primary px-2 py-1 rounded'>
                        {share.role === 'VIEWER' ? 'Visualizador' : 'Editor'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(share.user.email)}
                        className='p-1 hover:bg-elevation-1 rounded transition-colors'
                        title='Copiar email'
                      >
                        {copied ? (
                          <Check size={14} className='text-primary' />
                        ) : (
                          <Copy size={14} className='text-text' />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnshare(share.user.id)}
                    disabled={deletingId === share.user.id}
                    className='p-2 hover:bg-error/20 rounded transition-colors text-text hover:text-error disabled:opacity-50'
                    title='Remover compartilhamento'
                  >
                    {deletingId === share.user.id ? (
                      <Loader2 size={18} className='animate-spin' />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end pt-4 border-t border-border'>
          <Button onClick={onClose} variant='outline'>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
