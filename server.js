const readline = require('readline');
const WebSocket = require('ws');

// 建立 WebSocket 伺服器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // 如果接收到 START 指令，廣播倒計時
        if (message === 'START') {
            broadcastCountdown();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 廣播倒計時功能
function broadcastCountdown() {
    console.log('Broadcasting START_COUNTDOWN to all clients...');
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('START_COUNTDOWN');
            console.log('START_COUNTDOWN sent to a client');
        }
    });
}

// 使用 readline 接收終端輸入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (input) => {
    if (input === 'broadcastCountdown') {
        broadcastCountdown();
    } else {
        console.log(`Unknown command: ${input}`);
    }
});

// 掛載廣播函數和 WebSocket 伺服器到全局作用域（可選）
global.broadcastCountdown = broadcastCountdown;
global.wss = wss;

console.log('WebSocket server is running on ws://localhost:8080');
