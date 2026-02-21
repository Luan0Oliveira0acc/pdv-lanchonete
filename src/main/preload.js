"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => electron_1.ipcRenderer.invoke('app-version'),
    dbLogin: (username, password) => electron_1.ipcRenderer.invoke('db-login', username, password),
    dbQuery: (query, params) => electron_1.ipcRenderer.invoke('db-query', query, params),
    customersList: () => electron_1.ipcRenderer.invoke('customers:list'),
    customersCreate: (customer) => electron_1.ipcRenderer.invoke('customers:create', customer),
    customersUpdate: (customer) => electron_1.ipcRenderer.invoke('customers:update', customer),
    customersDelete: (customerId) => electron_1.ipcRenderer.invoke('customers:delete', customerId),
    productsList: () => electron_1.ipcRenderer.invoke('products:list'),
    productsCreate: (product) => electron_1.ipcRenderer.invoke('products:create', product),
    productsUpdate: (product) => electron_1.ipcRenderer.invoke('products:update', product),
    productsDelete: (productId) => electron_1.ipcRenderer.invoke('products:delete', productId),
    ordersList: () => electron_1.ipcRenderer.invoke('orders:list'),
    ordersCreate: (order) => electron_1.ipcRenderer.invoke('orders:create', order),
    ordersDelete: (orderId) => electron_1.ipcRenderer.invoke('orders:delete', orderId),
    dashboardStats: (filters) => electron_1.ipcRenderer.invoke('dashboard:getStats', filters),
    reportSales: (filters) => electron_1.ipcRenderer.invoke('reports:getSales', filters),
    closuresList: () => electron_1.ipcRenderer.invoke('closures:list'),
    closuresCreate: (payload) => electron_1.ipcRenderer.invoke('closures:create', payload),
    cashRegisterGetStatus: () => electron_1.ipcRenderer.invoke('cashRegister:getStatus'),
    cashRegisterOpen: (payload) => electron_1.ipcRenderer.invoke('cashRegister:open', payload),
    cashRegisterClose: () => electron_1.ipcRenderer.invoke('cashRegister:close'),
    fiadosList: () => electron_1.ipcRenderer.invoke('fiados:list'),
    fiadosCreate: (payload) => electron_1.ipcRenderer.invoke('fiados:create', payload),
    fiadosAddEntry: (payload) => electron_1.ipcRenderer.invoke('fiados:addEntry', payload),
    fiadosMarkAsPaid: (payload) => electron_1.ipcRenderer.invoke('fiados:markAsPaid', payload),
    fiadosDelete: (fiadoId) => electron_1.ipcRenderer.invoke('fiados:delete', fiadoId),
    categoriesList: () => electron_1.ipcRenderer.invoke('categories:list'),
    categoriesCreate: (category) => electron_1.ipcRenderer.invoke('categories:create', category),
    categoriesUpdate: (category) => electron_1.ipcRenderer.invoke('categories:update', category),
    categoriesDelete: (categoryId) => electron_1.ipcRenderer.invoke('categories:delete', categoryId),
    expensesList: () => electron_1.ipcRenderer.invoke('expenses:list'),
    expensesCreate: (expense) => electron_1.ipcRenderer.invoke('expenses:create', expense),
    expensesUpdate: (expense) => electron_1.ipcRenderer.invoke('expenses:update', expense),
    expensesDelete: (expenseId) => electron_1.ipcRenderer.invoke('expenses:delete', expenseId),
    // Listeners para WhatsApp
    onWhatsAppQR: (callback) => {
        electron_1.ipcRenderer.on('whatsapp-qr', (_, qr) => callback(qr));
    },
    onWhatsAppReady: (callback) => {
        electron_1.ipcRenderer.on('whatsapp-ready', () => callback());
    },
    onWhatsAppError: (callback) => {
        electron_1.ipcRenderer.on('whatsapp-error', (_, error) => callback(error));
    },
    removeWhatsAppListeners: () => {
        electron_1.ipcRenderer.removeAllListeners('whatsapp-qr');
        electron_1.ipcRenderer.removeAllListeners('whatsapp-ready');
        electron_1.ipcRenderer.removeAllListeners('whatsapp-error');
    },
    whatsappGetStatus: () => electron_1.ipcRenderer.invoke('whatsapp:getStatus'),
    whatsappGenerateQR: () => electron_1.ipcRenderer.invoke('whatsapp:generateQR'),
    whatsappDisconnect: () => electron_1.ipcRenderer.invoke('whatsapp:disconnect'),
});
