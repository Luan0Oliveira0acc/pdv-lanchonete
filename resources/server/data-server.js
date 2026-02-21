import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'shared-data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Garantir que o arquivo de dados existe
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      products: [],
      orders: [],
      closures: [],
      fiados: [],
      customers: [],
      categories: [
        { id: 1, name: 'Hambúrgueres', description: 'Hambúrgueres artesanais', active: true },
        { id: 2, name: 'Bebidas', description: 'Refrigerantes, sucos e água', active: true },
        { id: 3, name: 'Acompanhamentos', description: 'Batata frita, anéis de cebola', active: true },
        { id: 4, name: 'Sobremesas', description: 'Sobremesas e doces', active: true },
        { id: 5, name: 'Lanches', description: 'Lanches diversos', active: true },
        { id: 6, name: 'Salgados', description: 'Coxinhas, pastéis, empadas', active: true },
        { id: 7, name: 'Pizzas', description: 'Pizzas variadas', active: true },
        { id: 8, name: 'Pastéis', description: 'Pastéis fritos e assados', active: true },
        { id: 9, name: 'Porções', description: 'Porções para compartilhar', active: true },
        { id: 10, name: 'Combos', description: 'Combos promocionais', active: true },
        { id: 11, name: 'Promoções', description: 'Itens em promoção', active: true },
        { id: 12, name: 'Matérias Primas', description: 'Ingredientes e matérias primas', active: true },
      ],
      cashRegister: null,
      expenses: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Ler dados do arquivo
function readData() {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    ensureDataFile();
    return readData();
  }
}

// Salvar dados no arquivo
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
}

// GET - Obter todos os dados
app.get('/api/data', (req, res) => {
  try {
    const data = readData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Salvar todos os dados
app.post('/api/data', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Dados não fornecidos' });
    }

    if (saveData(data)) {
      res.json({ success: true, message: 'Dados salvos com sucesso' });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao salvar dados' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter entidade específica
app.get('/api/data/:entity', (req, res) => {
  try {
    const { entity } = req.params;
    const data = readData();

    if (data[entity] !== undefined) {
      res.json({ success: true, data: data[entity] });
    } else {
      res.status(404).json({ success: false, error: `Entidade ${entity} não encontrada` });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Salvar entidade específica
app.post('/api/data/:entity', (req, res) => {
  try {
    const { entity } = req.params;
    const { data: entityData } = req.body;

    if (entityData === undefined) {
      return res.status(400).json({ success: false, error: 'Dados não fornecidos' });
    }

    const allData = readData();
    allData[entity] = entityData;

    if (saveData(allData)) {
      res.json({ success: true, message: `${entity} salvo com sucesso` });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao salvar dados' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Página de administração (backup/restore)
app.get('/admin', (req, res) => {
  const adminPath = path.join(__dirname, 'admin.html');
  if (fs.existsSync(adminPath)) {
    res.sendFile(adminPath);
  } else {
    res.status(404).send('Página de administração não encontrada');
  }
});

// GET - Download backup como arquivo JSON
app.get('/api/backup', (req, res) => {
  try {
    const data = readData();
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      '_',
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0')
    ].join('');

    res.setHeader('Content-Disposition', `attachment; filename="backup-pdv-${timestamp}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
    console.log(`📥 Backup baixado com sucesso (${JSON.stringify(data).length} bytes)`);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Restaurar dados de um backup
app.post('/api/restore', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Dados de backup não fornecidos' });
    }

    // Criar backup automático antes de restaurar
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const currentData = readData();
    const backupFile = path.join(backupDir, `auto-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log(`💾 Backup automático salvo em: ${backupFile}`);

    // Restaurar dados
    if (saveData(data)) {
      const prods = (data.products || []).length;
      const orders = (data.orders || []).length;
      console.log(`📤 Dados restaurados: ${prods} produtos, ${orders} pedidos`);
      res.json({ success: true, message: 'Dados restaurados com sucesso' });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao salvar dados restaurados' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Resetar todos os dados (perfil zerado)
app.post('/api/reset', (req, res) => {
  try {
    // Criar backup automático antes de resetar
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const currentData = readData();
    const backupFile = path.join(backupDir, `pre-reset-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log(`💾 Backup pré-reset salvo em: ${backupFile}`);

    // Dados zerados com categorias padrão
    const defaultData = {
      products: [],
      orders: [],
      closures: [],
      fiados: [],
      customers: [],
      categories: [
        { id: 1, name: 'Hambúrgueres', description: 'Hambúrgueres artesanais', active: true },
        { id: 2, name: 'Bebidas', description: 'Refrigerantes, sucos e água', active: true },
        { id: 3, name: 'Acompanhamentos', description: 'Batata frita, anéis de cebola', active: true },
        { id: 4, name: 'Sobremesas', description: 'Sobremesas e doces', active: true },
        { id: 5, name: 'Lanches', description: 'Lanches diversos', active: true },
        { id: 6, name: 'Salgados', description: 'Coxinhas, pastéis, empadas', active: true },
        { id: 7, name: 'Pizzas', description: 'Pizzas variadas', active: true },
        { id: 8, name: 'Pastéis', description: 'Pastéis fritos e assados', active: true },
        { id: 9, name: 'Porções', description: 'Porções para compartilhar', active: true },
        { id: 10, name: 'Combos', description: 'Combos promocionais', active: true },
        { id: 11, name: 'Promoções', description: 'Itens em promoção', active: true },
        { id: 12, name: 'Matérias Primas', description: 'Ingredientes e matérias primas', active: true },
      ],
      cashRegister: null,
      expenses: [],
    };

    if (saveData(defaultData)) {
      console.log('🗑️ Dados resetados com sucesso');
      res.json({ success: true, message: 'Dados resetados com sucesso' });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao resetar dados' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inicializar
ensureDataFile();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor de dados compartilhados rodando em http://0.0.0.0:${PORT}`);
  console.log(`   Acesse de qualquer dispositivo na mesma rede: http://192.168.100.12:${PORT}`);
});

