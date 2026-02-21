import http from 'http';

const API = 'http://localhost:3002';

const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Lucas', 'Julia', 'Rafael', 'Beatriz', 'Marcos', 'Camila', 'André', 'Larissa', 'Bruno', 'Patrícia', 'Diego', 'Amanda', 'Thiago', 'Vanessa', 'Felipe', 'Renata', 'Gustavo', 'Letícia', 'Eduardo', 'Natália', 'Matheus', 'Isabela', 'Gabriel', 'Mariana', 'Rodrigo', 'Carolina', 'Leonardo', 'Daniela', 'Victor', 'Tatiana', 'Ricardo', 'Gabriela', 'Henrique', 'Aline', 'Guilherme', 'Priscila', 'Alexandre', 'Juliana', 'Vinícius', 'Bianca', 'Leandro', 'Luana', 'Caio', 'Raquel'];
const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Araújo', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Barros', 'Freitas', 'Moreira', 'Dias', 'Teixeira', 'Vieira', 'Mendes', 'Nunes', 'Monteiro', 'Cardoso', 'Pinto', 'Ramos', 'Correia'];

const produtosLanchonete = [
    'X-Burger', 'X-Salada', 'X-Bacon', 'X-Tudo', 'X-Egg', 'X-Frango', 'X-Calabresa',
    'Hot Dog Simples', 'Hot Dog Completo', 'Hot Dog Especial',
    'Coxinha', 'Pastel de Carne', 'Pastel de Queijo', 'Pastel de Frango', 'Empada de Frango', 'Empada de Palmito', 'Kibe', 'Bolinha de Queijo', 'Risole',
    'Hambúrguer Artesanal', 'Smash Burger', 'Double Burger', 'Cheese Burger',
    'Batata Frita P', 'Batata Frita M', 'Batata Frita G', 'Batata com Cheddar', 'Batata com Bacon',
    'Porção de Calabresa', 'Porção de Frango', 'Porção Mista', 'Porção de Isca de Peixe',
    'Pizza Margherita', 'Pizza Calabresa', 'Pizza Mussarela', 'Pizza 4 Queijos', 'Pizza Portuguesa', 'Pizza Frango c/ Catupiry',
    'Refrigerante Lata', 'Refrigerante 600ml', 'Refrigerante 2L', 'Guaraná Lata', 'Coca-Cola Lata', 'Fanta Lata',
    'Suco Natural Laranja', 'Suco Natural Maracujá', 'Suco Natural Abacaxi', 'Suco Natural Morango', 'Suco Natural Limão',
    'Água Mineral', 'Água com Gás', 'Água de Coco',
    'Cerveja Long Neck', 'Cerveja Lata', 'Cerveja 600ml',
    'Milkshake Chocolate', 'Milkshake Morango', 'Milkshake Baunilha', 'Milkshake Ovomaltine',
    'Açaí P', 'Açaí M', 'Açaí G', 'Açaí com Granola',
    'Sorvete 1 Bola', 'Sorvete 2 Bolas', 'Sundae', 'Petit Gateau',
    'Café Expresso', 'Café com Leite', 'Cappuccino', 'Chocolate Quente',
    'Combo Burger + Batata + Refri', 'Combo Hot Dog + Refri', 'Combo X-Tudo + Batata G + Refri',
    'Misto Quente', 'Bauru', 'Torrada Simples', 'Torrada Completa',
    'Tapioca de Queijo', 'Tapioca de Frango', 'Tapioca Nutella', 'Crepe Salgado', 'Crepe Doce',
    'Pão de Queijo', 'Pão na Chapa', 'Pão com Manteiga', 'Bolo de Cenoura', 'Bolo de Chocolate',
    'Brigadeiro', 'Beijinho', 'Pudim', 'Mousse de Maracujá', 'Torta de Limão'
];

const categorias = [
    { id: 1, name: 'Hambúrgueres' }, { id: 2, name: 'Bebidas' }, { id: 3, name: 'Acompanhamentos' },
    { id: 4, name: 'Sobremesas' }, { id: 5, name: 'Lanches' }, { id: 6, name: 'Salgados' },
    { id: 7, name: 'Pizzas' }, { id: 8, name: 'Pastéis' }, { id: 9, name: 'Porções' },
    { id: 10, name: 'Combos' }, { id: 11, name: 'Promoções' }, { id: 12, name: 'Matérias Primas' }
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }

function gerarProdutos(n) {
    const produtos = [];
    const usados = new Set();
    for (let i = 0; i < n; i++) {
        let nome = pick(produtosLanchonete);
        let suffix = '';
        while (usados.has(nome + suffix)) {
            suffix = ` ${rand(1, 999)}`;
        }
        usados.add(nome + suffix);

        let catId;
        if (nome.includes('Burger') || nome.includes('X-')) catId = 1;
        else if (nome.includes('Refri') || nome.includes('Suco') || nome.includes('Água') || nome.includes('Cerveja') || nome.includes('Café') || nome.includes('Milk') || nome.includes('Chocolate Quente') || nome.includes('Cappuccino')) catId = 2;
        else if (nome.includes('Batata') || nome.includes('Porção')) catId = 3;
        else if (nome.includes('Sorvete') || nome.includes('Açaí') || nome.includes('Sundae') || nome.includes('Petit') || nome.includes('Pudim') || nome.includes('Mousse') || nome.includes('Torta') || nome.includes('Bolo') || nome.includes('Brigadeiro') || nome.includes('Beijinho')) catId = 4;
        else if (nome.includes('Misto') || nome.includes('Bauru') || nome.includes('Torrada') || nome.includes('Tapioca') || nome.includes('Crepe') || nome.includes('Pão') || nome.includes('Hot Dog')) catId = 5;
        else if (nome.includes('Coxinha') || nome.includes('Pastel') || nome.includes('Empada') || nome.includes('Kibe') || nome.includes('Bolinha') || nome.includes('Risole')) catId = 6;
        else if (nome.includes('Pizza')) catId = 7;
        else if (nome.includes('Combo')) catId = 10;
        else catId = rand(1, 12);

        const cat = categorias.find(c => c.id === catId);
        produtos.push({
            id: Date.now() + i,
            code: `PROD-${String(i + 1).padStart(4, '0')}`,
            name: nome + suffix,
            description: `Delicioso(a) ${nome}${suffix} da casa`,
            price: parseFloat((rand(3, 65) + rand(0, 99) / 100).toFixed(2)),
            category: { ...cat, description: cat.name, active: true },
            preparationTime: rand(3, 25),
            quantity: rand(5, 200),
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }
    return produtos;
}

function gerarClientes(n) {
    const clientes = [];
    for (let i = 0; i < n; i++) {
        const nome = `${pick(nomes)} ${pick(sobrenomes)}`;
        const ddd = pick(['11', '21', '31', '41', '51', '61', '71', '81', '85', '91', '27', '48', '47', '19', '15', '12', '13', '14', '16', '17', '18']);
        clientes.push({
            id: Date.now() + i + 50000,
            name: nome,
            phone: `(${ddd}) 9${rand(1000, 9999)}-${rand(1000, 9999)}`,
            email: `${nome.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@email.com`,
            address: `Rua ${pick(sobrenomes)}, ${rand(1, 999)} - ${pick(['Centro', 'Jardim', 'Vila Nova', 'Bairro Alto', 'São José', 'Liberdade'])}`,
            notes: rand(1, 3) === 1 ? 'Cliente frequente' : '',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }
    return clientes;
}

function httpRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API);
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: url.hostname, port: url.port, path: url.pathname, method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
        const req = http.request(options, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, data: d }); } });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function main() {
    console.log('');
    console.log('🌱 SEED: Gerando 200 produtos e 200 clientes...');
    console.log('');

    // Ler dados atuais
    const res = await httpRequest('GET', '/api/data');
    if (res.status !== 200 || !res.data.success) {
        console.error('❌ Servidor não respondeu. Está rodando?');
        process.exit(1);
    }

    const dados = res.data.data;
    console.log(`📊 Dados atuais: ${(dados.products || []).length} produtos, ${(dados.customers || []).length} clientes`);

    // Gerar
    const novosProdutos = gerarProdutos(200);
    const novosClientes = gerarClientes(200);

    // Merge com dados existentes
    dados.products = [...(dados.products || []), ...novosProdutos];
    dados.customers = [...(dados.customers || []), ...novosClientes];

    const tamanho = (Buffer.byteLength(JSON.stringify({ data: dados })) / 1024).toFixed(1);
    console.log(`📦 Payload total: ${tamanho} KB`);
    console.log(`   → ${dados.products.length} produtos`);
    console.log(`   → ${dados.customers.length} clientes`);

    // Salvar
    const saveRes = await httpRequest('POST', '/api/data', { data: dados });
    if (saveRes.status === 200 && saveRes.data.success) {
        console.log('');
        console.log('✅ Dados salvos com sucesso!');
    } else {
        console.log('❌ Erro ao salvar:', saveRes.data);
        process.exit(1);
    }

    // Verificar
    const verify = await httpRequest('GET', '/api/data');
    const v = verify.data.data;
    console.log(`🔍 Verificação: ${(v.products || []).length} produtos, ${(v.customers || []).length} clientes`);
    console.log('');
    console.log('🎉 Seed finalizado!');
}

main().catch(e => { console.error('Erro:', e); process.exit(1); });
