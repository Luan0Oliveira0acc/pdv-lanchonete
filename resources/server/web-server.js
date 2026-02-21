// Servidor web simples para servir o frontend em produção
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.WEB_PORT || 5173;

// Detectar caminho dos arquivos estáticos
let distPath;
if (process.resourcesPath) {
  // Em produção empacotado, os arquivos podem estar em resources/dist
  // Primeiro tentar resources/dist (quando dist está em extraResources)
  distPath = path.join(process.resourcesPath, 'dist');
  if (!fs.existsSync(distPath)) {
    // Tentar no diretório do app (quando dist está em files)
    const appPath = process.resourcesPath.replace(/[\\/]resources$/, '');
    distPath = path.join(appPath, 'dist');
    if (!fs.existsSync(distPath)) {
      // Último fallback: caminho relativo
      distPath = path.join(__dirname, '..', 'dist');
    }
  }
} else {
  // Em desenvolvimento ou não empacotado
  distPath = path.join(__dirname, '..', 'dist');
}

console.log('📁 Caminho dos arquivos estáticos:', distPath);
console.log('📁 Existe?', fs.existsSync(distPath));

if (!fs.existsSync(distPath)) {
  console.error('❌ Pasta dist não encontrada!');
  console.error('   Certifique-se de que o frontend foi compilado (npm run build)');
  process.exit(1);
}

// Servir arquivos estáticos
app.use(express.static(distPath));

// SPA: redirecionar todas as rotas para index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Arquivo index.html não encontrado');
  }
});

// Obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignorar endereços não IPv4 e internos
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('');
  console.log('🌐 Servidor Web iniciado!');
  console.log('   Local:    http://localhost:' + PORT);
  console.log('   Rede:     http://' + localIP + ':' + PORT);
  console.log('');
  console.log('📱 Acesse de qualquer dispositivo na mesma rede usando:');
  console.log('   http://' + localIP + ':' + PORT);
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    console.error('   Tente fechar outros aplicativos que usam essa porta.');
  } else {
    console.error('❌ Erro ao iniciar servidor web:', error);
  }
  process.exit(1);
});

