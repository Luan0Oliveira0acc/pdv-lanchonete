# 🔧 Troubleshooting - Servidor WhatsApp

## Erro: "No LID for user"

Este erro ocorre quando o número de telefone não está nos contatos do WhatsApp.

### Solução 1: Adicionar aos Contatos (Recomendado)

1. Abra o WhatsApp no seu celular
2. Adicione o número aos seus contatos
3. Aguarde alguns segundos
4. Tente enviar a mensagem novamente

### Solução 2: Usar Links Diretos (Fallback Automático)

O sistema automaticamente usa links diretos quando o envio automático falha:
- Abre WhatsApp Web com a mensagem pré-preenchida
- Você só precisa clicar em "Enviar"

### Solução 3: Verificar Formato do Número

Certifique-se de que o número está no formato correto:
- **Brasil**: (11) 97382-2221 → 5511973822221
- O sistema formata automaticamente, mas verifique se está correto

## Outros Problemas Comuns

### QR Code não aparece
- Verifique se o servidor está rodando na porta 3001
- Tente gerar um novo QR Code
- Limpe a sessão: delete a pasta `server/whatsapp-session`

### Mensagens não são enviadas
- Verifique se o WhatsApp está conectado (status na página)
- Verifique se o número está nos seus contatos
- Verifique o console do servidor para erros

### Servidor não inicia
- Verifique se Node.js está instalado: `node --version`
- Verifique se a porta 3001 está livre
- Tente reinstalar dependências: `cd server && npm install`

