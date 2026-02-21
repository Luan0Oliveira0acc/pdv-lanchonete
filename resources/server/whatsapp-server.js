// Servidor WhatsApp para versão web
// Permite envio automático de mensagens via WhatsApp Web

import express from 'express';
import cors from 'cors';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let whatsappClient = null;
let whatsappReady = false;
let qrCodeData = null;

// Função para formatar número de telefone
function formatPhoneForWhatsApp(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }
  return cleaned;
}

// Inicializar WhatsApp
function initializeWhatsApp() {
  if (whatsappClient) {
    return;
  }

  const sessionPath = path.join(__dirname, 'whatsapp-session');

  whatsappClient = new Client({
    authStrategy: new LocalAuth({
      dataPath: sessionPath,
    }),
    puppeteer: {
      headless: false, // Mudado para false para permitir automação
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
      ],
      ignoreHTTPSErrors: true,
    },
  });
  
  // Armazenar referência ao browser para uso posterior
  whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp conectado e pronto!');
    whatsappReady = true;
    qrCodeData = null;
    
    // Armazenar referência ao browser
    if (whatsappClient.pupBrowser) {
      console.log('✅ Browser do WhatsApp disponível para automação');
    }
  });

  whatsappClient.on('qr', async (qr) => {
    console.log('🔵 QR Code gerado');
    qrcode.generate(qr, { small: true });
    
    try {
      qrCodeData = await QRCode.toDataURL(qr);
      console.log('✅ QR Code convertido para imagem');
    } catch (error) {
      console.error('Erro ao converter QR Code:', error);
      qrCodeData = qr;
    }
  });

  whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp autenticado!');
  });

  whatsappClient.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação:', msg);
    whatsappReady = false;
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp desconectado:', reason);
    whatsappReady = false;
    whatsappClient = null;
    setTimeout(() => {
      initializeWhatsApp();
    }, 5000);
  });

  whatsappClient.initialize().catch((err) => {
    console.error('❌ Erro ao inicializar WhatsApp:', err);
    whatsappReady = false;
  });
}

// Rotas da API

// Status do WhatsApp
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    success: true,
    data: {
      ready: whatsappReady,
      connected: !!whatsappClient,
      hasQR: !!qrCodeData,
    },
  });
});

// Obter QR Code
app.get('/api/whatsapp/qr', (req, res) => {
  if (qrCodeData) {
    res.json({
      success: true,
      data: qrCodeData,
    });
  } else {
    res.json({
      success: false,
      error: 'QR Code não disponível',
    });
  }
});

// Gerar novo QR Code
app.post('/api/whatsapp/generate-qr', async (req, res) => {
  try {
    if (whatsappClient) {
      await whatsappClient.destroy();
      whatsappClient = null;
      whatsappReady = false;
    }

    // Remover sessão salva
    const sessionPath = path.join(__dirname, 'whatsapp-session');
    if (fs.existsSync(sessionPath)) {
      try {
        fs.rmdirSync(sessionPath, { recursive: true });
      } catch (error) {
        console.error('Erro ao remover sessão:', error);
      }
    }

    // Reinicializar
    initializeWhatsApp();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      error: 'Telefone e mensagem são obrigatórios',
    });
  }

  if (!whatsappReady || !whatsappClient) {
    return res.status(503).json({
      success: false,
      error: 'WhatsApp não está conectado. Escaneie o QR Code primeiro.',
    });
  }

  const formattedPhone = formatPhoneForWhatsApp(phone);
  if (!formattedPhone) {
    return res.status(400).json({
      success: false,
      error: 'Número de telefone inválido',
    });
  }

  try {

    console.log(`📤 Tentando enviar mensagem para ${phone} (${formattedPhone})...`);
    
    // Tentar diferentes formatos de chatId
    let result = null;
    let lastError = null;
    
    // Método 1: Formato padrão @c.us
    const chatId1 = formattedPhone + '@c.us';
    try {
      console.log(`   Tentativa 1: ${chatId1}`);
      result = await whatsappClient.sendMessage(chatId1, message);
      console.log('✅ Mensagem enviada com sucesso (método 1)!');
    } catch (error1) {
      lastError = error1;
      console.log(`   ❌ Método 1 falhou: ${error1.message}`);
      
      // Método 2: Tentar buscar o número nos contatos primeiro
      try {
        console.log(`   Tentativa 2: Buscando contato...`);
        const contacts = await whatsappClient.getContacts();
        const contact = contacts.find(c => {
          const contactNumber = (c.number && typeof c.number === 'string') ? c.number.replace(/\D/g, '') : null;
          const phoneClean = formattedPhone.replace(/\D/g, '');
          return contactNumber && (
            contactNumber === phoneClean ||
            contactNumber === phoneClean.replace(/^55/, '') ||
            contactNumber.endsWith(phoneClean) ||
            phoneClean.endsWith(contactNumber)
          );
        });
        
        if (contact) {
          console.log(`   ✅ Contato encontrado: ${contact.pushname || contact.name || contact.number}`);
          result = await whatsappClient.sendMessage(contact.id._serialized, message);
          console.log('✅ Mensagem enviada com sucesso (método 2 - contato encontrado)!');
        } else {
          throw new Error('Contato não encontrado');
        }
      } catch (error2) {
        lastError = error2;
        console.log(`   ❌ Método 2 falhou: ${error2.message}`);
        
        // Método 3: Tentar com número sem código do país
        try {
          const phoneWithoutCountry = formattedPhone.replace(/^55/, '');
          const chatId3 = phoneWithoutCountry + '@c.us';
          console.log(`   Tentativa 3: ${chatId3}`);
          result = await whatsappClient.sendMessage(chatId3, message);
          console.log('✅ Mensagem enviada com sucesso (método 3)!');
        } catch (error3) {
          lastError = error3;
          console.log(`   ❌ Método 3 falhou: ${error3.message}`);
          throw error3;
        }
      }
    }
    
    if (result) {
      res.json({
        success: true,
        data: {
          messageId: result.id || result.id._serialized,
        },
      });
    } else {
      throw lastError || new Error('Falha ao enviar mensagem');
    }
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    
    // Se for erro de LID (número não nos contatos), tentar método alternativo com Puppeteer
    if (error.message && (error.message.includes('LID') || error.message.includes('No LID'))) {
      console.log('⚠️ Número não está nos contatos. Tentando método alternativo com Puppeteer...');
      
      try {
        // Método alternativo: usar Puppeteer para automatizar WhatsApp Web
        const result = await sendMessageViaPuppeteer(formattedPhone, message);
        if (result) {
          console.log('✅ Mensagem enviada automaticamente via Puppeteer!');
          return res.json({
            success: true,
            data: {
              messageId: 'puppeteer-' + Date.now(),
              method: 'puppeteer',
            },
          });
        }
      } catch (puppeteerError) {
        console.error('❌ Erro ao enviar via Puppeteer:', puppeteerError);
        // Continuar para retornar flag de fallback
      }
      
      // Se Puppeteer também falhar, retornar flag para usar links diretos no frontend
      console.log('⚠️ Método Puppeteer falhou. Retornando flag para usar links diretos...');
      return res.json({
        success: true,
        useFallback: true,
        message: 'Número não está nos contatos. Use links diretos do WhatsApp Web.',
        data: {
          phone: formattedPhone,
          message: message,
        },
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Erro desconhecido ao enviar mensagem',
    });
  }
});

// Função para enviar mensagem via Puppeteer (automatiza WhatsApp Web)
// Usa o browser do whatsapp-web.js se disponível
async function sendMessageViaPuppeteer(phone, message) {
  let browser = null;
  let page = null;
  try {
    console.log('🤖 Iniciando Puppeteer para envio automático...');
    
    // Tentar usar o browser do whatsapp-web.js se disponível
    if (whatsappClient && whatsappClient.pupBrowser) {
      console.log('   Usando browser existente do WhatsApp...');
      browser = whatsappClient.pupBrowser;
      const pages = await browser.pages();
      if (pages.length > 0) {
        page = pages[0]; // Usar a primeira página (geralmente é a do WhatsApp)
      } else {
        page = await browser.newPage();
      }
    } else {
      // Criar novo browser (fallback)
      console.log('   Criando novo browser...');
      browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      page = await browser.newPage();
      
      // Ir para WhatsApp Web e aguardar login se necessário
      await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(5000);
      
      // Verificar se está logado
      const isLoggedIn = await page.evaluate(() => {
        return document.querySelector('[data-testid="chat"]') !== null;
      });
      
      if (!isLoggedIn) {
        console.log('   ⚠️ WhatsApp Web não está logado. É necessário fazer login primeiro.');
        if (browser) await browser.close();
        return false;
      }
    }
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    
    console.log(`   Abrindo conversa: ${whatsappUrl}`);
    await page.goto(whatsappUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Aguardar página carregar e campo de mensagem aparecer
    await page.waitForTimeout(5000);
    
    // Aguardar campo de texto aparecer
    try {
      await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
    } catch (e) {
      console.log('   ⚠️ Campo de mensagem não encontrado, tentando continuar...');
    }
    
    // Tentar encontrar e clicar no botão "Enviar"
    const sendButtonSelectors = [
      'span[data-icon="send"]', // Ícone de envio mais comum
      'button[data-tab="11"]', // Botão de envio padrão
      'button[aria-label*="Enviar"]',
      'button[aria-label*="Send"]',
      '[data-testid="send"]',
      'button[type="submit"]',
      'div[role="button"][aria-label*="Enviar"]',
    ];
    
    let sent = false;
    for (const selector of sendButtonSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.click();
          console.log(`   ✅ Clicou no botão de envio (${selector})`);
          sent = true;
          break;
        }
      } catch (e) {
        // Tentar próximo seletor
        continue;
      }
    }
    
    if (!sent) {
      // Tentar método alternativo: pressionar Enter no campo de mensagem
      console.log('   Tentando método alternativo: pressionar Enter...');
      try {
        await page.focus('div[contenteditable="true"][data-tab="10"]');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        sent = true;
        console.log('   ✅ Pressionou Enter para enviar');
      } catch (e) {
        console.log('   ⚠️ Não foi possível pressionar Enter');
      }
    }
    
    // Aguardar um pouco para garantir que a mensagem foi enviada
    await page.waitForTimeout(3000);
    
    // Verificar se mensagem foi enviada (opcional)
    try {
      const messageSent = await page.evaluate(() => {
        // Verificar se há mensagens enviadas na conversa
        const sentMessages = document.querySelectorAll('[data-testid="msg-container"]');
        return sentMessages.length > 0;
      });
      
      if (messageSent) {
        console.log('   ✅ Mensagem confirmada como enviada!');
      }
    } catch (e) {
      // Ignorar erro de verificação
    }
    
    if (browser) {
      await browser.close();
    }
    return sent;
  } catch (error) {
    console.error('❌ Erro no Puppeteer:', error.message);
    if (browser) {
      await browser.close();
    }
    return false;
  }
}

// Desconectar WhatsApp
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    if (whatsappClient) {
      await whatsappClient.logout();
      await whatsappClient.destroy();
      whatsappClient = null;
      whatsappReady = false;

      // Remover sessão
      const sessionPath = path.join(__dirname, 'whatsapp-session');
      if (fs.existsSync(sessionPath)) {
        try {
          fs.rmdirSync(sessionPath, { recursive: true });
        } catch (error) {
          console.error('Erro ao remover sessão:', error);
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Inicializar WhatsApp ao iniciar o servidor
initializeWhatsApp();

app.listen(PORT, () => {
  console.log(`🚀 Servidor WhatsApp rodando na porta ${PORT}`);
  console.log(`📱 Acesse http://localhost:${PORT}/api/whatsapp/status para verificar o status`);
});

