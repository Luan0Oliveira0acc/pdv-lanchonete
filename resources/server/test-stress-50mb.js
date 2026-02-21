import http from 'http';

/**
 * TESTE DE STRESS - Servidor de Dados PDV Lanchonete
 * 
 * Este script testa se o servidor aguenta payloads grandes (até ~50MB).
 * Ele gera dados falsos em escala crescente e tenta salvá-los no servidor.
 * 
 * USO: node test-stress-50mb.js
 * 
 * REQUISITO: O data-server.js precisa estar rodando na porta 3002
 */

const DATA_SERVER_URL = 'http://localhost:3002';

// Gerar um produto fake
function gerarProduto(i) {
    return {
        id: Date.now() + i,
        code: `PROD-${String(i).padStart(5, '0')}`,
        name: `Produto Teste ${i} - ${gerarTexto(50)}`,
        description: gerarTexto(200),
        price: parseFloat((Math.random() * 100 + 1).toFixed(2)),
        category: {
            id: (i % 12) + 1,
            name: `Categoria ${(i % 12) + 1}`,
            description: `Descrição da categoria ${(i % 12) + 1}`,
            active: true
        },
        preparationTime: Math.floor(Math.random() * 30) + 5,
        quantity: Math.floor(Math.random() * 500) + 1,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Gerar um pedido fake
function gerarPedido(i, produtos) {
    const numItems = Math.floor(Math.random() * 5) + 1;
    const items = [];
    for (let j = 0; j < numItems; j++) {
        const prod = produtos[Math.floor(Math.random() * produtos.length)];
        items.push({
            productId: prod.id,
            quantity: Math.floor(Math.random() * 5) + 1,
            unitPrice: prod.price,
            variations: '[]',
            product: { ...prod }
        });
    }
    return {
        id: Date.now() + i + 100000,
        orderNumber: `PED-${String(i).padStart(5, '0')}`,
        status: 'open',
        createdAt: new Date().toISOString(),
        userId: 1,
        user: { id: 1, username: 'admin', name: 'Administrador', role: 'admin', active: true },
        type: 'counter',
        items,
        payments: [{ method: 'cash', amount: items.reduce((s, it) => s + it.unitPrice * it.quantity, 0), change: 0 }],
        discount: 0,
        deliveryFee: 0,
        subtotal: items.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
        total: items.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
    };
}

// Gerar texto aleatório
function gerarTexto(len) {
    const chars = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Calcular tamanho em MB
function tamanhoMB(obj) {
    return (Buffer.byteLength(JSON.stringify(obj), 'utf-8') / (1024 * 1024)).toFixed(2);
}

// Fazer request HTTP nativo (sem dependências)
function httpRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, DATA_SERVER_URL);
        const data = body ? JSON.stringify(body) : null;

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(responseData) });
                } catch {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (err) => reject(err));
        if (data) req.write(data);
        req.end();
    });
}

// ============================================
// TESTES
// ============================================

async function testarConexao() {
    console.log('🔌 Testando conexão com o servidor...');
    try {
        const res = await httpRequest('GET', '/api/data');
        if (res.status === 200 && res.data.success) {
            console.log('   ✅ Servidor respondendo corretamente!');
            return true;
        }
        console.log('   ❌ Servidor respondeu mas com erro:', res.data);
        return false;
    } catch (err) {
        console.log('   ❌ Servidor NÃO está rodando! Inicie com: node data-server.js');
        console.log('   Erro:', err.message);
        return false;
    }
}

async function testarPayload(label, numProdutos, numPedidos) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 TESTE: ${label}`);
    console.log(`   Gerando ${numProdutos} produtos e ${numPedidos} pedidos...`);

    const produtos = [];
    for (let i = 0; i < numProdutos; i++) {
        produtos.push(gerarProduto(i));
    }

    const pedidos = [];
    for (let i = 0; i < numPedidos; i++) {
        pedidos.push(gerarPedido(i, produtos));
    }

    const dados = {
        products: produtos,
        orders: pedidos,
        closures: [],
        fiados: [],
        customers: [],
        categories: produtos.slice(0, 12).map(p => p.category),
        cashRegister: null,
        expenses: []
    };

    const tamanho = tamanhoMB({ data: dados });
    console.log(`   📏 Tamanho do payload: ${tamanho} MB`);

    // Tentar salvar
    const inicio = Date.now();
    try {
        const res = await httpRequest('POST', '/api/data', { data: dados });
        const tempo = Date.now() - inicio;

        if (res.status === 200 && res.data.success) {
            console.log(`   ✅ SALVOU COM SUCESSO! (${tempo}ms)`);
        } else if (res.status === 413) {
            console.log(`   ❌ FALHOU: Payload Too Large (413) - O limite do Express ainda é muito baixo!`);
            return false;
        } else {
            console.log(`   ❌ FALHOU: Status ${res.status} - ${JSON.stringify(res.data)}`);
            return false;
        }
    } catch (err) {
        console.log(`   ❌ FALHOU: ${err.message}`);
        return false;
    }

    // Verificar se os dados foram realmente salvos
    try {
        const res = await httpRequest('GET', '/api/data');
        if (res.status === 200 && res.data.success) {
            const salvos = res.data.data;
            const produtosSalvos = salvos.products ? salvos.products.length : 0;
            const pedidosSalvos = salvos.orders ? salvos.orders.length : 0;

            if (produtosSalvos === numProdutos && pedidosSalvos === numPedidos) {
                console.log(`   ✅ VERIFICAÇÃO OK: ${produtosSalvos} produtos e ${pedidosSalvos} pedidos persistidos!`);
                return true;
            } else {
                console.log(`   ❌ VERIFICAÇÃO FALHOU: Esperado ${numProdutos} produtos, encontrou ${produtosSalvos}`);
                console.log(`   ❌ VERIFICAÇÃO FALHOU: Esperado ${numPedidos} pedidos, encontrou ${pedidosSalvos}`);
                return false;
            }
        }
    } catch (err) {
        console.log(`   ❌ Erro na verificação: ${err.message}`);
        return false;
    }

    return false;
}

async function restaurarDadosOriginais(dadosOriginais) {
    console.log('\n🔄 Restaurando dados originais...');
    try {
        const res = await httpRequest('POST', '/api/data', { data: dadosOriginais });
        if (res.status === 200 && res.data.success) {
            console.log('   ✅ Dados originais restaurados!');
        } else {
            console.log('   ⚠️ Não foi possível restaurar dados originais');
        }
    } catch {
        console.log('   ⚠️ Erro ao restaurar dados originais');
    }
}

async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   TESTE DE STRESS - Data Server PDV Lanchonete          ║');
    console.log('║   Testando payloads de até ~50MB                        ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    // Verificar conexão
    if (!await testarConexao()) {
        process.exit(1);
    }

    // Salvar dados originais
    let dadosOriginais = null;
    try {
        const res = await httpRequest('GET', '/api/data');
        if (res.status === 200 && res.data.success) {
            dadosOriginais = res.data.data;
            console.log(`\n💾 Dados originais salvos em memória (${tamanhoMB(dadosOriginais)} MB)`);
        }
    } catch { }

    let resultados = [];

    // Teste 1: ~100KB (o que falhava antes)
    resultados.push({
        nome: '~100KB (limite antigo)',
        ok: await testarPayload('~100KB - Limite antigo do Express', 25, 10)
    });

    // Teste 2: ~500KB
    resultados.push({
        nome: '~500KB',
        ok: await testarPayload('~500KB - Cenário de uso normal', 100, 50)
    });

    // Teste 3: ~2MB
    resultados.push({
        nome: '~2MB',
        ok: await testarPayload('~2MB - Uso intenso', 300, 200)
    });

    // Teste 4: ~10MB
    resultados.push({
        nome: '~10MB',
        ok: await testarPayload('~10MB - Carga pesada', 1000, 500)
    });

    // Teste 5: ~30MB
    resultados.push({
        nome: '~30MB',
        ok: await testarPayload('~30MB - Stress máximo', 3000, 1500)
    });

    // Restaurar dados originais
    if (dadosOriginais) {
        await restaurarDadosOriginais(dadosOriginais);
    }

    // Resultado final
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   RESULTADO FINAL                                      ║');
    console.log('╠══════════════════════════════════════════════════════════╣');

    let todosOk = true;
    for (const r of resultados) {
        const status = r.ok ? '✅ PASSOU' : '❌ FALHOU';
        console.log(`║   ${status}  ${r.nome.padEnd(40)} ║`);
        if (!r.ok) todosOk = false;
    }

    console.log('╠══════════════════════════════════════════════════════════╣');
    if (todosOk) {
        console.log('║   🎉 TODOS OS TESTES PASSARAM!                         ║');
        console.log('║   O servidor aguenta payloads grandes sem problemas!    ║');
    } else {
        console.log('║   ⚠️  ALGUNS TESTES FALHARAM!                          ║');
        console.log('║   Verifique se express.json({ limit: "50mb" }) está ok  ║');
    }
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
}

main().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
});
