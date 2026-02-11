# Checklist de Testes - Compartilhamento por Link

## Testes do Backend

### 1. Criar Link
- [ ] POST `/files/:id/links` com usuário autenticado
- [ ] Retorna token único de 64 caracteres
- [ ] Retorna `expiresAt` null se não fornecido
- [ ] Retorna `expiresAt` com data se fornecido
- [ ] Falha se arquivo não pertence ao usuário
- [ ] Falha se arquivo não existe

### 2. Listar Links
- [ ] GET `/files/:id/links` retorna array de links
- [ ] Links incluem `id`, `token`, `expiresAt`, `createdAt`
- [ ] Falha se arquivo não pertence ao usuário
- [ ] Retorna array vazio se nenhum link existe

### 3. Deletar Link
- [ ] DELETE `/files/links/:linkId` deleta link
- [ ] Falha se link não pertence ao usuário
- [ ] Falha se link não existe

### 4. Download Público
- [ ] GET `/files/public/download/:token` retorna arquivo
- [ ] Headers corretos (Content-Type, Content-Disposition)
- [ ] Falha se token inválido
- [ ] Falha se link expirado
- [ ] Falha se arquivo não existe no disco

### 5. Info Pública
- [ ] GET `/files/public/info/:token` retorna informações
- [ ] Retorna `id`, `originalName`, `mimeType`, `size`, `createdAt`
- [ ] Falha se token inválido
- [ ] Falha se link expirado

## Testes do Frontend

### 1. Modal de Compartilhamento
- [ ] Botão de link (🔗) aparece na lista de arquivos
- [ ] Modal abre ao clicar no botão
- [ ] Modal exibe título com nome do arquivo
- [ ] Campo de data de expiração funciona
- [ ] Botão "Criar Link" funciona

### 2. Listagem de Links
- [ ] Links criados aparecem na lista
- [ ] Exibe token (primeiros 16 caracteres)
- [ ] Exibe data de criação formatada
- [ ] Exibe data de expiração se definida
- [ ] Mostra badge "Expirado" para links expirados

### 3. Gerenciamento de Links
- [ ] Botão de cópia copia link para clipboard
- [ ] Mensagem de sucesso ao copiar
- [ ] Botão de deleção remove link
- [ ] Confirmação antes de deletar
- [ ] Link desaparece da lista após deleção

### 4. Página Pública
- [ ] URL `/public/download/:token` funciona
- [ ] Exibe informações do arquivo
- [ ] Botão "Baixar Arquivo" funciona
- [ ] Arquivo é baixado com nome correto
- [ ] Link expirado mostra erro
- [ ] Link inválido mostra erro

## Testes de Integração

### 1. Fluxo Completo
- [ ] Criar arquivo
- [ ] Criar link com expiração
- [ ] Copiar link
- [ ] Abrir link em nova aba
- [ ] Baixar arquivo
- [ ] Deletar link
- [ ] Tentar acessar link deletado (deve falhar)

### 2. Expiração
- [ ] Criar link com expiração no passado
- [ ] Tentar acessar (deve falhar)
- [ ] Criar link com expiração no futuro
- [ ] Acessar antes da expiração (deve funcionar)
- [ ] Esperar expiração
- [ ] Tentar acessar após expiração (deve falhar)

### 3. Segurança
- [ ] Usuário A não pode deletar link de Usuário B
- [ ] Usuário A não pode criar link para arquivo de Usuário B
- [ ] Token não é previsível
- [ ] Arquivo é protegido por token único

## Testes de Performance

- [ ] Criar 100 links funciona
- [ ] Listar 100 links é rápido
- [ ] Download de arquivo grande funciona
- [ ] Múltiplos downloads simultâneos funcionam

## Testes de Compatibilidade

- [ ] Funciona em Chrome
- [ ] Funciona em Firefox
- [ ] Funciona em Safari
- [ ] Funciona em Edge
- [ ] Funciona em dispositivos móveis

## Testes de Erro

- [ ] Erro ao criar link sem autenticação
- [ ] Erro ao listar links sem autenticação
- [ ] Erro ao deletar link sem autenticação
- [ ] Erro ao acessar arquivo deletado
- [ ] Erro ao acessar arquivo com permissões incorretas
- [ ] Erro ao fazer upload de arquivo muito grande

## Notas

- Executar testes em ambiente de desenvolvimento
- Usar Postman ou similar para testar API
- Usar DevTools do navegador para validar requisições
- Verificar logs do backend para erros
