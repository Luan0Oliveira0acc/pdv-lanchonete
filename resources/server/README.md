# Servidor WhatsApp para Versão Web

Este servidor permite envio automático de mensagens WhatsApp na versão web do sistema.

## 🚀 Instalação

1. Entre na pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Usar

### Iniciar o servidor:

```bash
npm start
```

Ou em modo desenvolvimento (com auto-reload):
```bash
npm run dev
```

O servidor iniciará na porta **3001**.

## 📱 Configuração

1. **Inicie o servidor** (porta 3001)
2. **Acesse a página WhatsApp** no sistema web
3. **Gere o QR Code** clicando no botão
4. **Escaneie o QR Code** com seu WhatsApp
5. **Pronto!** As mensagens serão enviadas automaticamente

## 🔧 Funcionalidades

- ✅ Envio automático de mensagens
- ✅ Geração de QR Code
- ✅ Status de conexão
- ✅ Desconexão e reconexão

## ⚠️ Importante

- O servidor precisa estar rodando para envio automático
- Se o servidor não estiver disponível, o sistema usa links diretos (fallback)
- A sessão do WhatsApp é salva automaticamente

## 🐛 Troubleshooting

### Servidor não inicia
- Verifique se a porta 3001 está disponível
- Certifique-se de que o Node.js está instalado

### QR Code não aparece
- Verifique o console do servidor
- Tente gerar um novo QR Code

### Mensagens não são enviadas
- Verifique se o WhatsApp está conectado (status)
- Verifique o console do servidor para erros

