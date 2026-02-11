# Guia de Compartilhamento por Link - Pickbox

## Visão Geral

O Pickbox agora suporta compartilhamento de arquivos por link público, similar ao MediaFire. Qualquer pessoa com o link pode baixar o arquivo sem precisar de autenticação.

## Como Usar

### Para o Proprietário do Arquivo

1. **Acessar a página "Meus Arquivos"**
   - Faça login no Pickbox
   - Navegue para "Meus Arquivos"

2. **Criar um Link de Compartilhamento**
   - Clique no ícone de link (🔗) ao lado do arquivo
   - O modal "Compartilhar por Link" abrirá
   - Opcionalmente, defina uma data de expiração
   - Clique em "Criar Link"

3. **Copiar e Compartilhar**
   - O link aparecerá na lista de links ativos
   - Clique no ícone de cópia (📋) para copiar o link
   - Compartilhe o link com qualquer pessoa

4. **Gerenciar Links**
   - Visualize todos os links ativos do arquivo
   - Veja a data de criação e expiração
   - Deletar links clicando no ícone de lixeira (🗑️)

### Para Quem Recebe o Link

1. **Acessar o Link**
   - Abra o link compartilhado no navegador
   - A página exibirá informações do arquivo

2. **Visualizar Informações**
   - Nome do arquivo
   - Tamanho do arquivo
   - Data de compartilhamento

3. **Baixar o Arquivo**
   - Clique no botão "Baixar Arquivo"
   - O arquivo será baixado automaticamente

## Recursos

### Tokens de Link
- Tokens únicos de 64 caracteres (256 bits)
- Gerados aleatoriamente usando criptografia
- Impossível adivinhar ou forçar

### Data de Expiração
- Opcional ao criar o link
- Se definida, o link expira automaticamente
- Links expirados não podem ser acessados
- Mensagem clara indicando expiração

### Segurança
- Apenas o proprietário do arquivo pode criar/deletar links
- Downloads públicos não requerem autenticação
- Arquivo é protegido por token único
- Validação de expiração em cada acesso

## Endpoints da API

### Criar Link
```
POST /files/:id/links
Headers: Authorization: Bearer {token}
Body: {
  "expiresAt": "2026-02-28T23:59:59" // opcional
}
Response: {
  "id": "uuid",
  "fileId": "uuid",
  "token": "64-char-hex-string",
  "expiresAt": "2026-02-28T23:59:59" ou null,
  "createdAt": "2026-02-11T14:30:00"
}
```

### Listar Links
```
GET /files/:id/links
Headers: Authorization: Bearer {token}
Response: [
  {
    "id": "uuid",
    "fileId": "uuid",
    "token": "64-char-hex-string",
    "expiresAt": "2026-02-28T23:59:59" ou null,
    "createdAt": "2026-02-11T14:30:00"
  }
]
```

### Deletar Link
```
DELETE /files/links/:linkId
Headers: Authorization: Bearer {token}
Response: { success: true }
```

### Obter Informações do Arquivo (Público)
```
GET /files/public/info/:token
Response: {
  "id": "uuid",
  "originalName": "documento.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "createdAt": "2026-02-11T14:30:00"
}
```

### Baixar Arquivo (Público)
```
GET /files/public/download/:token
Response: Binary file stream
```

## Exemplos de Uso

### JavaScript/TypeScript
```typescript
import Api from '@/services/Api';

// Criar link
const response = await Api.createFileLink(fileId, '2026-02-28T23:59:59');
const link = `${window.location.origin}/public/download/${response.data.token}`;

// Listar links
const links = await Api.getFileLinks(fileId);

// Deletar link
await Api.deleteFileLink(linkId);

// Obter informações (público)
const fileInfo = await Api.getFileInfoByLink(token);
```

### cURL
```bash
# Criar link
curl -X POST http://localhost:3000/files/file-id/links \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"expiresAt": "2026-02-28T23:59:59"}'

# Obter informações
curl http://localhost:3000/files/public/info/token-here

# Baixar arquivo
curl -O http://localhost:3000/files/public/download/token-here
```

## Limitações Atuais

- Sem limite de downloads por link
- Sem contador de downloads
- Sem proteção por senha
- Sem notificações de download

## Melhorias Futuras

- [ ] Adicionar contador de downloads
- [ ] Implementar limite de downloads
- [ ] Adicionar senha opcional para links
- [ ] Notificações quando arquivo é baixado
- [ ] Analytics de compartilhamento
- [ ] Revogar todos os links de uma vez
- [ ] Histórico de downloads
