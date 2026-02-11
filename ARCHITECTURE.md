# Arquitetura - Sistema de Compartilhamento por Link

## Visão Geral

O sistema de compartilhamento por link permite que usuários autenticados criem links públicos para seus arquivos, permitindo que qualquer pessoa baixe o arquivo sem autenticação.

```
┌─────────────────────────────────────────────────────────────┐
│                    PICKBOX - LINK SHARING                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐                    ┌──────────────────┐
│   FRONTEND       │                    │    BACKEND       │
│   (Next.js)      │                    │   (NestJS)       │
└──────────────────┘                    └──────────────────┘
        │                                       │
        │                                       │
    ┌───┴────────────────────────────────────┬─┴───┐
    │                                        │     │
    │  LinkShareModal                   FileLinkService
    │  - Criar links                    - generateToken()
    │  - Listar links                   - createLink()
    │  - Deletar links                  - getFileByToken()
    │  - Copiar para clipboard          - getLinks()
    │                                   - deleteLink()
    │                                   - deleteLinkByToken()
    │
    │  FilesList                        FileController
    │  - Botão de link                  - POST /files/:id/links
    │  - Integração modal               - GET /files/:id/links
    │                                   - DELETE /files/links/:linkId
    │                                   - GET /files/public/download/:token
    │  Public Download Page             - GET /files/public/info/:token
    │  - Exibe info do arquivo
    │  - Botão de download
    │  - Validação de expiração
    │
    └───────────────────────────────────────────────┘
                        │
                        │
                ┌───────┴────────┐
                │                │
            DATABASE         FILE SYSTEM
            (Prisma)         (/uploads)
            - FileLink       - Arquivos
            - File           - Metadados
            - User
```

## Fluxo de Dados

### 1. Criação de Link

```
Usuário (Frontend)
    │
    ├─> Clica botão de link (🔗)
    │
    ├─> LinkShareModal abre
    │
    ├─> Define data de expiração (opcional)
    │
    ├─> Clica "Criar Link"
    │
    └─> POST /files/:id/links
        │
        └─> FileController.createLink()
            │
            ├─> Valida autenticação (AuthGuard)
            │
            ├─> Extrai userId do token (@User decorator)
            │
            └─> FileLinkService.createLink()
                │
                ├─> Verifica se arquivo pertence ao usuário
                │
                ├─> Gera token único (randomBytes(32).toString('hex'))
                │
                ├─> Cria registro FileLink no banco
                │
                └─> Retorna link com token
                    │
                    └─> Frontend exibe link na lista
```

### 2. Compartilhamento de Link

```
Usuário A (Frontend)
    │
    ├─> Copia link: https://pickbox.com/public/download/abc123...
    │
    └─> Compartilha com Usuário B (email, WhatsApp, etc)
        │
        └─> Usuário B abre link no navegador
            │
            └─> GET /public/download/abc123...
                │
                └─> FileController.downloadByLink()
                    │
                    ├─> FileLinkService.getFileByToken()
                    │   │
                    │   ├─> Busca FileLink pelo token
                    │   │
                    │   ├─> Valida expiração
                    │   │
                    │   └─> Retorna File
                    │
                    ├─> Verifica se arquivo existe no disco
                    │
                    ├─> Define headers HTTP
                    │   ├─> Content-Type
                    │   ├─> Content-Disposition
                    │   └─> Content-Length
                    │
                    └─> Envia arquivo via stream
                        │
                        └─> Usuário B baixa arquivo
```

### 3. Gerenciamento de Links

```
Usuário A (Frontend)
    │
    ├─> Abre LinkShareModal
    │
    ├─> Vê lista de links
    │
    ├─> Copia link (copia para clipboard)
    │
    ├─> Deleta link (com confirmação)
    │   │
    │   └─> DELETE /files/links/:linkId
    │       │
    │       └─> FileController.deleteLink()
    │           │
    │           └─> FileLinkService.deleteLink()
    │               │
    │               ├─> Verifica propriedade
    │               │
    │               └─> Deleta FileLink do banco
    │
    └─> Link desaparece da lista
```

## Estrutura de Dados

### FileLink (Banco de Dados)

```typescript
interface FileLink {
  id: string;           // UUID único
  fileId: string;       // Referência ao arquivo
  file: File;           // Relacionamento com File
  token: string;        // Token único (64 caracteres hex)
  expiresAt?: DateTime; // Data de expiração (opcional)
  createdAt: DateTime;  // Data de criação
  updatedAt: DateTime;  // Data de atualização
}
```

### Índices do Banco
- `fileId` - Para buscar links de um arquivo
- `token` - Para buscar arquivo pelo token (PRIMARY)

### Cascata de Deleção
- Quando arquivo é deletado → todos os links são deletados
- Quando link é deletado → arquivo permanece intacto

## Segurança

### Geração de Token
```typescript
// 32 bytes = 256 bits
// Convertido para hexadecimal = 64 caracteres
const token = randomBytes(32).toString('hex');
// Exemplo: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Validação de Acesso
1. **Criação de Link:** Apenas proprietário do arquivo
2. **Listagem de Links:** Apenas proprietário do arquivo
3. **Deleção de Link:** Apenas proprietário do arquivo
4. **Download Público:** Qualquer pessoa com token válido
5. **Expiração:** Validada em cada acesso

### Proteção contra Ataques
- **Força Bruta:** Token de 256 bits impossível de adivinhar
- **Replay:** Token é único e não reutilizável
- **Expiração:** Links expiram automaticamente
- **Propriedade:** Verificação de ownerId em operações sensíveis

## Performance

### Otimizações
- Índices no banco para buscas rápidas
- Stream de arquivo para economizar memória
- Validação de expiração em memória (sem query adicional)
- Cache de informações do arquivo

### Escalabilidade
- Suporta milhões de links
- Cada link ocupa ~200 bytes no banco
- Downloads não bloqueiam outras operações
- Possível migrar para S3/GCS no futuro

## Tratamento de Erros

### Erros Esperados
```
404 Not Found
- Token inválido
- Link expirado
- Arquivo deletado

403 Forbidden
- Usuário não é proprietário
- Arquivo não pertence ao usuário

400 Bad Request
- Arquivo não existe no disco
- Parâmetros inválidos
```

### Logs
- Criação de link
- Acesso a link
- Deleção de link
- Erros de validação

## Extensibilidade

### Possíveis Extensões
1. **Contador de Downloads**
   - Adicionar campo `downloadCount` ao FileLink
   - Incrementar em cada download

2. **Limite de Downloads**
   - Adicionar campo `maxDownloads` ao FileLink
   - Validar antes de permitir download

3. **Senha Opcional**
   - Adicionar campo `password` ao FileLink
   - Validar senha antes de download

4. **Notificações**
   - Enviar email quando arquivo é baixado
   - Webhook para eventos

5. **Analytics**
   - Rastrear IP, User-Agent, timestamp
   - Gerar relatórios de uso

## Deployment

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Migrations
```bash
npx prisma migrate deploy
```

### Build
```bash
# Backend
npm run build

# Frontend
npm run build
```

## Monitoramento

### Métricas Importantes
- Taxa de criação de links
- Taxa de downloads
- Tempo médio de download
- Taxa de erro
- Uso de armazenamento

### Alertas
- Muitos links criados em pouco tempo
- Taxa de erro alta
- Espaço em disco baixo
- Arquivo corrompido
