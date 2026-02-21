# Pickbox - Sistema de Armazenamento e Compartilhamento de Arquivos

**CSI606-2025-01 - Remoto - Proposta de Trabalho Final**  
**Discente:** Joao Victor Vieira Amora de Figueiredo - 23.1.8019

## 📋 Resumo

Pickbox é um sistema web de armazenamento e compartilhamento de arquivos, inspirado em aplicações como Dropbox, Mediafire e Mega.io. A aplicação permite que usuários façam upload, gerenciem e compartilhem arquivos de forma segura.

## 🎯 Tema

Desenvolvimento de uma aplicação web para armazenamento de arquivos com funcionalidades de upload, exclusão, listagem, edição de metadados e compartilhamento com outros usuários do sistema.

## ✅ Funcionalidades Implementadas

### Autenticação e Usuários
- ✅ **Criar conta (Signup)** - Registro com validação de email e senha
- ✅ **Login (Signin)** - Autenticação com JWT armazenado em cookie seguro
- ✅ **Logout (Signout)** - Limpeza de sessão e cookie
- ✅ **Perfil do usuário** - Endpoint `/user/me` para obter dados autenticados
- ✅ **Busca de usuário por email** - Para compartilhamento de arquivos

### Gerenciamento de Arquivos
- ✅ **Upload de arquivos** - Suporte a múltiplos arquivos (até 1GB cada)
- ✅ **Listar arquivos** - Visualizar todos os arquivos do usuário
- ✅ **Download de arquivos** - Download seguro com validação de acesso
- ✅ **Deletar arquivos** - Remoção de arquivo do banco e disco
- ✅ **Editar metadados** - Renomear arquivos (sem alterar extensão)
- ✅ **Armazenamento local** - Pasta `/uploads` com arquivos organizados

### Compartilhamento com Usuários
- ✅ **Compartilhar arquivo** - Compartilhar com outro usuário com role (VIEWER/EDITOR)
- ✅ **Descompartilhar arquivo** - Remover acesso de um usuário
- ✅ **Listar compartilhamentos** - Ver com quem o arquivo foi compartilhado
- ✅ **Arquivos compartilhados comigo** - Visualizar arquivos compartilhados por outros
- ✅ **Controle de acesso** - VIEWER (apenas leitura) e EDITOR (leitura/escrita)

### Compartilhamento por Link
- ✅ **Criar link público** - Gerar link único com token de 256 bits
- ✅ **Data de expiração** - Links com expiração opcional
- ✅ **Download público** - Qualquer pessoa pode baixar sem autenticação
- ✅ **Listar links** - Ver todos os links de um arquivo
- ✅ **Deletar link** - Revogar acesso público
- ✅ **Validação de expiração** - Links expirados retornam erro 404
- ✅ **Página pública de download** - Interface amigável para download sem login

### Interface de Usuário
- ✅ **Navbar** - Navegação com logo, botão upload e menu de usuário
- ✅ **Sidebar** - Menu lateral com navegação (Meus Arquivos, Compartilhado Comigo)
- ✅ **Dashboard** - Página inicial com estatísticas e arquivos recentes
- ✅ **Meus Arquivos** - Listagem completa com ações (download, delete, compartilhar, link)
- ✅ **Compartilhado Comigo** - Visualizar arquivos compartilhados por outros
- ✅ **Configurações** - Página de perfil do usuário
- ✅ **Modal de Upload** - Drag-and-drop com preview de arquivos
- ✅ **Modal de Compartilhamento** - Interface para compartilhar com usuários
- ✅ **Modal de Link** - Criar e gerenciar links públicos
- ✅ **Edição inline** - Renomear arquivos diretamente na lista
- ✅ **Design responsivo** - Interface adaptada para mobile e desktop
- ✅ **Tema claro** - Variáveis CSS customizadas com Tailwind v4

### Segurança
- ✅ **Autenticação JWT** - Token com expiração de 7 dias
- ✅ **Cookies seguros** - HttpOnly, Secure, SameSite=strict
- ✅ **Middleware de rotas** - Proteção de rotas autenticadas
- ✅ **Validação de propriedade** - Apenas dono pode deletar/editar
- ✅ **Validação de acesso** - Verificação de compartilhamento antes de download
- ✅ **Tokens únicos** - Links com 64 caracteres hexadecimais (256 bits)
- ✅ **CORS configurado** - Comunicação segura entre frontend e backend

### Infraestrutura
- ✅ **Backend NestJS** - Framework modular com arquitetura em camadas
- ✅ **Frontend Next.js** - React 19 com SSR e roteamento
- ✅ **Banco de dados PostgreSQL** - Persistência com Prisma ORM
- ✅ **Docker** - Containerização para backend e frontend
- ✅ **Docker Compose** - Orquestração de serviços (backend, frontend, database)
- ✅ **Migrations Prisma** - Versionamento do schema do banco
- ✅ **Variáveis de ambiente** - Configuração via `.env`

## ❌ Funcionalidades Não Implementadas

### Autenticação Avançada
- ❌ **2FA (Two-Factor Authentication)** - Autenticação em dois fatores
- ❌ **Login com Google/Microsoft** - Integração com provedores OAuth
- ❌ **Recuperação de senha** - Reset de senha via email
- ❌ **Verificação de email** - Confirmação de email no signup

### Gerenciamento de Arquivos
- ❌ **Pastas/Diretórios** - Organização hierárquica de arquivos
- ❌ **Busca de arquivos** - Busca por nome, tipo, data
- ❌ **Filtros avançados** - Filtrar por tipo, tamanho, data
- ❌ **Visualizador de arquivos** - Preview de imagens, PDFs, vídeos
- ❌ **Histórico de versões** - Controle de versão de arquivos
- ❌ **Lixeira/Trash** - Recuperação de arquivos deletados
- ❌ **Quotas de armazenamento** - Limite de espaço por usuário
- ❌ **Compressão** - Download de múltiplos arquivos em ZIP

### Compartilhamento
- ❌ **Compartilhamento entre organizações** - Acesso entre grupos
- ❌ **Permissões granulares** - Controle fino de acesso
- ❌ **Senha para links** - Proteção adicional de links públicos
- ❌ **Limite de downloads** - Máximo de downloads por link
- ❌ **Contador de downloads** - Rastrear quantas vezes foi baixado
- ❌ **Notificações de compartilhamento** - Avisar quando arquivo é compartilhado
- ❌ **Comentários em arquivos** - Discussão sobre arquivos

### Armazenamento em Nuvem
- ❌ **AWS S3** - Integração com Amazon S3
- ❌ **Google Cloud Storage** - Integração com GCS
- ❌ **Azure Blob Storage** - Integração com Azure
- ❌ **Sincronização automática** - Sync com nuvem

### Recursos Avançados
- ❌ **WebSockets** - Sincronização em tempo real
- ❌ **Notificações push** - Alertas de eventos
- ❌ **Analytics** - Rastreamento de uso e estatísticas
- ❌ **Audit log** - Registro de todas as ações
- ❌ **Backup automático** - Backup periódico de dados
- ❌ **Integração com APIs externas** - Webhooks, integrações
- ❌ **Modo dark** - Tema escuro da interface
- ❌ **Internacionalização (i18n)** - Suporte a múltiplos idiomas

## 🏗️ Arquitetura

### Backend (NestJS)
```
pickbox-core/
├── src/
│   ├── auth/              # Autenticação e JWT
│   │   ├── application/   # Services e módulos
│   │   ├── infrastructure/ # Controllers e guards
│   │   └── dto/           # Data Transfer Objects
│   ├── file/              # Gerenciamento de arquivos
│   │   ├── application/   # Services (File, FileShare, FileLink)
│   │   ├── infrastructure/ # Controllers
│   │   └── dto/           # DTOs
│   ├── user/              # Gerenciamento de usuários
│   │   ├── application/   # Services
│   │   ├── infrastructure/ # Controllers
│   │   └── dto/           # DTOs
│   ├── prisma/            # Configuração do Prisma
│   └── main.ts            # Entry point
├── prisma/
│   └── schema.prisma      # Schema do banco de dados
└── package.json
```

### Frontend (Next.js)
```
pickbox/
├── src/
│   ├── app/               # Páginas e layouts
│   │   ├── (auth)/        # Rotas de autenticação
│   │   ├── (protected)/   # Rotas protegidas
│   │   ├── (public)/      # Rotas públicas
│   │   └── public/        # Página de download público
│   ├── components/        # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── FilesList.tsx
│   │   ├── UploadModal.tsx
│   │   ├── ShareModal.tsx
│   │   ├── LinkShareModal.tsx
│   │   └── ui/            # Componentes base
│   ├── contexts/          # Context API
│   │   ├── AuthContext.tsx
│   │   └── FilesContext.tsx
│   ├── services/          # API client
│   │   └── Api.tsx
│   └── lib/               # Utilitários
├── public/                # Assets estáticos
└── package.json
```

### Banco de Dados (PostgreSQL)
```
Models:
- User: Usuários do sistema
- File: Arquivos armazenados
- FileShare: Compartilhamentos entre usuários
- FileLink: Links públicos para arquivos
- FileRole: Enum (VIEWER, EDITOR)
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- Docker e Docker Compose (opcional)

### Instalação Local

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/pickbox.git
cd pickbox
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. **Instale as dependências**
```bash
# Backend
cd pickbox-core
npm install

# Frontend
cd ../pickbox
npm install
```

4. **Configure o banco de dados**
```bash
cd pickbox-core
npx prisma migrate deploy
```

5. **Inicie os serviços**
```bash
# Terminal 1 - Backend (porta 3000)
cd pickbox-core
npm run start:dev

# Terminal 2 - Frontend (porta 3001)
cd pickbox
npm run dev
```

6. **Acesse a aplicação**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### Instalação com Docker

```bash
docker-compose up -d
```

Isso iniciará:
- Backend em http://localhost:3000
- Frontend em http://localhost:3001
- PostgreSQL em localhost:5432

## 📊 Estatísticas do Projeto

- **Linhas de código (Backend):** ~1500
- **Linhas de código (Frontend):** ~2000
- **Componentes React:** 8
- **Endpoints API:** 15+
- **Modelos de banco de dados:** 4
- **Contextos React:** 2

## 🔐 Segurança

- ✅ Senhas com hash bcrypt
- ✅ JWT com expiração
- ✅ Cookies HttpOnly e Secure
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Proteção contra CSRF
- ✅ Tokens únicos e criptografados

## 📄 Documentação Adicional

- `ARCHITECTURE.md` - Documentação detalhada da arquitetura de compartilhamento por link
- `.env.example` - Exemplo de variáveis de ambiente
- `docker-compose.yml` - Configuração de containerização

## 👤 Autor

**Joao Victor Vieira Amora de Figueiredo**  
Matrícula: 23.1.8019  
Disciplina: CSI606-2025-01 (Remoto)


