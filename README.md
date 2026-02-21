<p align="center">
  <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9" alt="Electron" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/WhatsApp_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
</p>

<h1 align="center">🍔 PDV Lanchonete</h1>

<p align="center">
  <strong>Sistema completo de Ponto de Venda (PDV) para lanchonetes e estabelecimentos alimentícios</strong>
</p>

<p align="center">
  Aplicação desktop multiplataforma construída com <strong>Electron + React</strong>, com backend em <strong>Node.js/Express</strong>, integração com <strong>WhatsApp</strong> para envio automático de mensagens, e painel administrativo para <strong>backup e restauração</strong> de dados.
</p>

<br/>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Execução](#-execução)
- [Referência da API](#-referência-da-api)
- [Modelo de Dados](#-modelo-de-dados)
- [Integração WhatsApp](#-integração-whatsapp)
- [Painel Administrativo](#️-painel-administrativo)
- [Scripts Utilitários](#-scripts-utilitários)
- [Troubleshooting](#-troubleshooting)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **PDV Lanchonete** é um sistema de Ponto de Venda (PDV) completo, desenvolvido especificamente para lanchonetes, hamburgueries, bares e estabelecimentos do ramo alimentício. A aplicação oferece uma solução desktop moderna e intuitiva para o gerenciamento completo do negócio — desde o cadastro de produtos e clientes até o controle de caixa, pedidos, fiados, despesas e relatórios.

O sistema também conta com uma integração com WhatsApp Web para envio automático de notificações e mensagens aos clientes, além de um painel administrativo web para backup e restauração dos dados.

### 🎯 Motivação

Este projeto foi desenvolvido como parte dos estudos no **2º semestre de Ciência da Computação**, com o objetivo de aplicar conceitos de:

- Desenvolvimento de aplicações desktop com **Electron**
- Construção de interfaces modernas com **React** e **Vite**
- Criação de APIs RESTful com **Node.js** e **Express**
- Persistência de dados com **JSON** (file-based storage)
- Automação de mensagens com **WhatsApp Web.js** e **Puppeteer**
- Arquitetura cliente-servidor em rede local

---

## ✨ Funcionalidades

### 🛒 Gestão de Vendas
- Registro de pedidos com múltiplos itens
- Cálculo automático de totais
- Histórico completo de pedidos

### 📦 Gestão de Produtos
- Cadastro, edição e exclusão de produtos
- Categorização por tipo (Hambúrgueres, Bebidas, Salgados, Pizzas, etc.)
- Controle de estoque com quantidade disponível
- Código de produto único (`PROD-XXXX`)
- Tempo de preparo configurável por produto
- Status ativo/inativo

### 👥 Gestão de Clientes
- Cadastro completo de clientes (nome, telefone, e-mail, endereço)
- Notas e observações por cliente
- Histórico de compras

### 💰 Controle de Caixa
- Abertura e fechamento de caixa
- Registro de valor inicial (troco)
- Controle de despesas operacionais

### 📝 Sistema de Fiados
- Registro de vendas fiadas por cliente
- Controle de entradas e baixas
- Marcação de pagamento

### 📊 Dashboard e Relatórios
- Painel com estatísticas em tempo real
- Relatórios de vendas com filtros configuráveis
- Resumo financeiro

### 📱 Integração WhatsApp
- Envio automático de mensagens via WhatsApp Web
- Conexão via QR Code
- Fallback automático para links diretos caso o envio automático falhe
- Múltiplas tentativas de envio com diferentes formatos de número

### 💾 Backup e Restauração
- Download de backup completo em formato JSON
- Restauração de dados a partir de arquivo de backup
- Backup automático antes de restauração ou reset
- Reset completo com categorias padrão preservadas
- Interface web para gerenciamento (Painel Admin)

### 🔄 Categorias Pré-Configuradas
O sistema vem com 12 categorias padrão:

| # | Categoria | Descrição |
|---|-----------|-----------|
| 1 | Hambúrgueres | Hambúrgueres artesanais |
| 2 | Bebidas | Refrigerantes, sucos e água |
| 3 | Acompanhamentos | Batata frita, anéis de cebola |
| 4 | Sobremesas | Sobremesas e doces |
| 5 | Lanches | Lanches diversos |
| 6 | Salgados | Coxinhas, pastéis, empadas |
| 7 | Pizzas | Pizzas variadas |
| 8 | Pastéis | Pastéis fritos e assados |
| 9 | Porções | Porções para compartilhar |
| 10 | Combos | Combos promocionais |
| 11 | Promoções | Itens em promoção |
| 12 | Matérias Primas | Ingredientes e matérias primas |

---

## 🏗 Arquitetura do Sistema

O sistema segue uma arquitetura **cliente-servidor** com três servidores independentes e uma aplicação desktop Electron, todos executados localmente:

```
┌────────────────────────────────────────────────────────────┐
│                    APLICAÇÃO DESKTOP                        │
│                  (Electron + React/Vite)                     │
│                     Porta: N/A                               │
│                                                              │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  Dashboard  │  │ Gestão Pedidos │  │ Gestão Produtos  │  │
│  ├────────────┤  ├────────────────┤  ├──────────────────┤  │
│  │ Relatórios │  │ Gestão Clientes│  │ Controle Caixa   │  │
│  ├────────────┤  ├────────────────┤  ├──────────────────┤  │
│  │  Fiados    │  │   Despesas     │  │ WhatsApp Config  │  │
│  └─────┬──────┘  └───────┬────────┘  └────────┬─────────┘  │
│        │                 │                     │             │
│        └─────────────────┼─────────────────────┘             │
│                          │ IPC (Electron)                    │
└──────────────────────────┼───────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
   ┌──────────────┐ ┌──────────┐ ┌──────────────┐
   │ Data Server  │ │Web Server│ │WhatsApp Server│
   │  Porta 3002  │ │Porta 5173│ │  Porta 3001   │
   │  (REST API)  │ │  (SPA)   │ │ (Mensagens)   │
   └──────┬───────┘ └──────────┘ └───────┬───────┘
          │                              │
          ▼                              ▼
   ┌──────────────┐             ┌────────────────┐
   │shared-data.  │             │ WhatsApp Web   │
   │    json      │             │  (Puppeteer)   │
   └──────────────┘             └────────────────┘
```

### Servidores

| Servidor | Porta | Descrição |
|----------|-------|-----------|
| **Data Server** | `3002` | API REST para CRUD de dados (produtos, pedidos, clientes, fiados, despesas, categorias, caixa). Persiste em `shared-data.json`. Endpoints de backup, restore e reset. |
| **Web Server** | `5173` | Servidor de arquivos estáticos para o frontend React/Vite. Serve o SPA em rede local, permitindo acesso de qualquer dispositivo na mesma rede. |
| **WhatsApp Server** | `3001` | Automação de envio de mensagens via WhatsApp Web.js com Puppeteer. Suporta geração de QR Code, envio, reconexão automática e fallback. |

---

## 📁 Estrutura de Diretórios

```
PDV-Lanchonete/
│
├── 📦 PDV Lanchonete.exe          # Executável principal (Electron)
├── 📄 iniciar-servidores.bat      # Script para iniciar todos os 3 servidores
│
├── 📂 src/
│   └── 📂 main/
│       └── 📄 preload.js          # Electron preload (IPC bridge)
│
├── 📂 resources/
│   ├── 📂 dist/                   # Frontend compilado (React + Vite)
│   │   ├── 📄 index.html          # Entrada do SPA
│   │   └── 📂 assets/
│   │       ├── 📄 main-*.js       # Bundle JS do React
│   │       └── 📄 index-*.css     # Estilos compilados
│   │
│   └── 📂 server/                 # Backend Node.js
│       ├── 📄 data-server.js      # API REST de dados (porta 3002)
│       ├── 📄 web-server.js       # Servidor SPA (porta 5173)
│       ├── 📄 whatsapp-server.js  # Servidor WhatsApp (porta 3001)
│       ├── 📄 admin.html          # Painel admin (backup/restore)
│       ├── 📄 shared-data.json    # Banco de dados JSON
│       ├── 📄 package.json        # Dependências do servidor
│       ├── 📄 seed-200.js         # Script de seed (dados fictícios)
│       ├── 📄 test-stress-50mb.js # Script de teste de estresse
│       ├── 📄 start.bat           # Script para iniciar WhatsApp server
│       ├── 📄 README.md           # Documentação do servidor WhatsApp
│       ├── 📄 TROUBLESHOOTING.md  # Guia de resolução de problemas
│       ├── 📂 backups/            # Backups automáticos
│       └── 📂 whatsapp-session/   # Sessão salva do WhatsApp
│
└── 📂 locales/                    # Arquivos de localização (Chromium)
```

---

## 🛠 Tecnologias Utilizadas

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **React** | Biblioteca para construção da interface de usuário |
| **Vite** | Build tool e dev server para o frontend |
| **CSS3** | Estilização com design moderno (glassmorphism, gradients, animações) |
| **Google Fonts (Inter)** | Tipografia moderna |

### Backend
| Tecnologia | Uso |
|------------|-----|
| **Node.js** | Runtime JavaScript no servidor |
| **Express** | Framework web para as APIs REST |
| **CORS** | Middleware para controle de acesso cross-origin |

### Desktop
| Tecnologia | Uso |
|------------|-----|
| **Electron** | Framework para a aplicação desktop multiplataforma |
| **IPC (Inter-Process Communication)** | Comunicação entre processos main e renderer |

### Integração
| Tecnologia | Uso |
|------------|-----|
| **whatsapp-web.js** | Biblioteca para automação do WhatsApp Web |
| **Puppeteer** | Automação de navegador para envio de mensagens |
| **qrcode / qrcode-terminal** | Geração de QR Codes |

### Armazenamento
| Tecnologia | Uso |
|------------|-----|
| **JSON (File System)** | Persistência local de dados via arquivo `shared-data.json` |

---

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior recomendada)
- **npm** (incluído com o Node.js)
- **Sistema operacional:** Windows 10/11

Para verificar se o Node.js está instalado:

```bash
node --version
npm --version
```

---

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Luan0Oliveira/pdv-lanchonete.git
cd pdv-lanchonete
```

### 2. Instale as dependências do servidor

```bash
cd resources/server
npm install
```

### 3. Verifique o arquivo de dados

O arquivo `shared-data.json` será criado automaticamente na primeira execução com as categorias padrão. Não é necessária nenhuma configuração adicional.

---

## ▶️ Execução

### Opção 1: Executar tudo com um clique

Dê um duplo clique no arquivo `iniciar-servidores.bat` na raiz do projeto. Ele iniciará automaticamente os três servidores:

```
✅ Servidor de dados     → http://localhost:3002
✅ Servidor WhatsApp     → http://localhost:3001
✅ Servidor Web          → http://localhost:5173
```

Depois, abra o `PDV Lanchonete.exe` para usar a aplicação desktop.

### Opção 2: Executar servidores individualmente

```bash
# Terminal 1 - Servidor de dados (obrigatório)
cd resources/server
node data-server.js

# Terminal 2 - Servidor web (para acesso via navegador)
cd resources/server
node web-server.js

# Terminal 3 - Servidor WhatsApp (opcional)
cd resources/server
node whatsapp-server.js
```

### Opção 3: Executar todos simultaneamente

```bash
cd resources/server
npm run start-all
```

### 🌐 Acesso via Rede Local

O servidor web escuta em `0.0.0.0`, permitindo acesso de qualquer dispositivo na mesma rede Wi-Fi:

```
http://<IP-DO-COMPUTADOR>:5173
```

O IP local é exibido no console ao iniciar o servidor web.

---

## 📡 Referência da API

### Base URL: `http://localhost:3002`

### Dados Gerais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/data` | Retorna todos os dados do sistema |
| `POST` | `/api/data` | Salva todos os dados (substituição completa) |
| `GET` | `/api/data/:entity` | Retorna uma entidade específica (`products`, `orders`, `customers`, etc.) |
| `POST` | `/api/data/:entity` | Salva uma entidade específica |

### Backup e Restauração

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/backup` | Download do backup completo como arquivo JSON |
| `POST` | `/api/restore` | Restaura dados de um backup (cria backup automático antes) |
| `POST` | `/api/reset` | Reseta todos os dados para estado inicial (cria backup antes) |
| `GET` | `/admin` | Abre o painel administrativo (UI para backup/restore) |

### WhatsApp (Base URL: `http://localhost:3001`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/whatsapp/status` | Status da conexão WhatsApp |
| `GET` | `/api/whatsapp/qr` | Obter QR Code para autenticação |
| `POST` | `/api/whatsapp/generate-qr` | Gerar novo QR Code (reinicia sessão) |
| `POST` | `/api/whatsapp/send` | Enviar mensagem (`{ phone, message }`) |
| `POST` | `/api/whatsapp/disconnect` | Desconectar WhatsApp e limpar sessão |

### Exemplo de Requisição

```bash
# Obter todos os produtos
curl http://localhost:3002/api/data/products

# Resposta:
{
  "success": true,
  "data": [
    {
      "id": 1740000000001,
      "code": "PROD-0001",
      "name": "X-Burger",
      "description": "Delicioso X-Burger da casa",
      "price": 18.90,
      "category": { "id": 1, "name": "Hambúrgueres" },
      "preparationTime": 10,
      "quantity": 50,
      "active": true
    }
  ]
}
```

---

## 📐 Modelo de Dados

O arquivo `shared-data.json` armazena todas as entidades do sistema com a seguinte estrutura:

```json
{
  "products": [],       // Produtos cadastrados
  "orders": [],         // Pedidos realizados
  "closures": [],       // Fechamentos de caixa
  "fiados": [],         // Contas fiadas
  "customers": [],      // Clientes cadastrados
  "categories": [],     // Categorias de produtos
  "cashRegister": null,  // Estado atual do caixa
  "expenses": []        // Despesas operacionais
}
```

### Entidades Principais

#### Produto (`products`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | Identificador único (timestamp) |
| `code` | `string` | Código do produto (`PROD-XXXX`) |
| `name` | `string` | Nome do produto |
| `description` | `string` | Descrição detalhada |
| `price` | `number` | Preço unitário (R$) |
| `category` | `object` | Categoria do produto |
| `preparationTime` | `number` | Tempo de preparo (minutos) |
| `quantity` | `number` | Quantidade em estoque |
| `active` | `boolean` | Status ativo/inativo |
| `createdAt` | `string` | Data de criação (ISO 8601) |
| `updatedAt` | `string` | Data de atualização (ISO 8601) |

#### Cliente (`customers`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | Identificador único (timestamp) |
| `name` | `string` | Nome completo do cliente |
| `phone` | `string` | Telefone com DDD |
| `email` | `string` | Endereço de e-mail |
| `address` | `string` | Endereço completo |
| `notes` | `string` | Observações |
| `active` | `boolean` | Status ativo/inativo |

---

## 📱 Integração WhatsApp

O sistema utiliza a biblioteca **whatsapp-web.js** para enviar mensagens automaticamente via WhatsApp Web.

### Como Configurar

1. **Inicie o Servidor WhatsApp** (porta 3001)
2. **Acesse a configuração de WhatsApp** no sistema
3. **Gere o QR Code** clicando no botão correspondente
4. **Escaneie o QR Code** com o aplicativo WhatsApp do celular
5. **Pronto!** O envio de mensagens será automático

### Fluxo de Envio de Mensagens

```
Tentativa 1 → Formato padrão @c.us
       │
       ├─ ✅ Sucesso → Mensagem enviada
       │
       ├─ ❌ Falha
       │
Tentativa 2 → Busca nos contatos salvos
       │
       ├─ ✅ Encontrou → Envia para o contato
       │
       ├─ ❌ Não encontrou
       │
Tentativa 3 → Número sem código de país
       │
       ├─ ✅ Sucesso → Mensagem enviada
       │
       ├─ ❌ Falha
       │
Fallback → Automação via Puppeteer (WhatsApp Web)
       │
       └─ ❌ Retorna flag para link direto no frontend
```

### Formatação de Números

O sistema formata automaticamente os números para o padrão WhatsApp:
- Remove caracteres não numéricos
- Remove zero inicial
- Adiciona código do país `55` (Brasil) se necessário

---

## 🔧 Painel Administrativo

Acesse o painel de administração em:

```
http://localhost:3002/admin
```

O painel oferece uma interface moderna (dark mode com glassmorphism) com:

- **📊 Estatísticas** — Quantidade de produtos, pedidos, clientes e tamanho dos dados
- **📥 Backup** — Download completo dos dados em formato JSON
- **📤 Restauração** — Upload de arquivo JSON para restaurar dados (com drag & drop)
- **🗑️ Reset** — Zerar todos os dados com confirmação dupla (mantém categorias padrão)

> ⚠️ Antes de qualquer restauração ou reset, um backup automático é salvo na pasta `backups/`.

---

## 🧰 Scripts Utilitários

### Seed de Dados (`seed-200.js`)

Popula o banco de dados com **200 produtos** e **200 clientes** fictícios para testes:

```bash
cd resources/server
node seed-200.js
```

> ⚠️ O servidor de dados (porta 3002) precisa estar rodando antes de executar o seed.

### Teste de Estresse (`test-stress-50mb.js`)

Script para testar o desempenho do sistema com grandes volumes de dados.

```bash
cd resources/server
node test-stress-50mb.js
```

---

## 🐛 Troubleshooting

### O servidor não inicia

- Verifique se o Node.js está instalado: `node --version`
- Certifique-se de que as portas **3001**, **3002** e **5173** não estão em uso
- Reinstale as dependências: `cd resources/server && npm install`

### QR Code do WhatsApp não aparece

- Verifique se o servidor WhatsApp está rodando na porta 3001
- Tente gerar um novo QR Code
- Limpe a sessão: delete a pasta `resources/server/whatsapp-session`

### Mensagens do WhatsApp não são enviadas

- Verifique se o WhatsApp está conectado (verifique o status)
- Adicione o número aos contatos do celular
- Verifique se o número está no formato correto (ex: `(11) 99999-9999`)
- Consulte o arquivo [TROUBLESHOOTING.md](resources/server/TROUBLESHOOTING.md) para mais detalhes

### Erro "EADDRINUSE"

A porta já está em uso. Feche outros aplicativos que possam estar usando a mesma porta ou reinicie o computador.

### Dados não aparecem / NaN nos valores

- Verifique se o servidor de dados (porta 3002) está rodando
- Tente fazer um backup e restaurar os dados
- Em último caso, use o reset no painel admin

---

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <strong>Luan de Oliveira</strong><br/>
      📚 2º Semestre — Ciência da Computação<br/><br/>
      <a href="https://github.com/Luan0Oliveira">
        <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto é de uso acadêmico e pessoal. Desenvolvido como parte dos estudos do curso de **Ciência da Computação**.

---

<p align="center">
  Feito com ❤️ e ☕ por <strong>Luan de Oliveira</strong>
</p>
