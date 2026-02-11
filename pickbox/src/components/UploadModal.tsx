'use client';

import React, { useState, useRef } from 'react'
import { X, Upload, File, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import Api from '@/services/Api';
import { useFiles } from '@/contexts/FilesContext';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const { triggerRefresh } = useFiles();
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setError(null);
        try {
            await Api.uploadFiles(files);
            setFiles([]);
            triggerRefresh();
            onClose();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao fazer upload dos arquivos';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-elevation-1 w-full max-w-2xl h-auto max-h-[80vh] p-6 rounded-xl flex flex-col overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold text-foreground'>Upload de Arquivos</h1>
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

                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6 ${
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type='file'
                        multiple
                        onChange={handleFileSelect}
                        className='hidden'
                    />
                    <Upload size={48} className='mx-auto mb-3 text-primary' />
                    <p className='text-foreground font-medium mb-1'>
                        Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className='text-sm text-text'>
                        Você pode selecionar múltiplos arquivos
                    </p>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                    <div className='flex-1 overflow-y-auto mb-6'>
                        <div className='space-y-2'>
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className='flex items-center justify-between p-3 bg-elevation-2 rounded-lg'
                                >
                                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                                        <File size={20} className='text-primary shrink-0' />
                                        <div className='min-w-0 flex-1'>
                                            <p className='text-sm font-medium text-foreground truncate'>
                                                {file.name}
                                            </p>
                                            <p className='text-xs text-text'>
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className='p-1 hover:bg-elevation-3 rounded transition-colors shrink-0'
                                    >
                                        <X size={18} className='text-text' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className='flex items-center justify-between pt-4 border-t border-border'>
                    <p className='text-sm text-text'>
                        {files.length} arquivo{files.length !== 1 ? 's' : ''} selecionado{files.length !== 1 ? 's' : ''}
                    </p>
                    <div className='flex gap-3'>
                        <Button
                            onClick={onClose}
                            variant='outline'
                            disabled={isUploading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={files.length === 0 || isUploading}
                            className='flex items-center gap-2'
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={18} className='animate-spin' />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadModal