const express = require('express');
const app = express();

// 提供靜態文件
app.use(express.static('public'));

// WebSocket server 初始化
const server = require('http').createServer(app);
const WebSocket = require('ws');
const readline = require('readline');

// 獲取 Fly.io 提供的動態 PORT
const port = process.env.PORT || 8080;

// 啟動伺服器
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// 建立 WebSocket 伺服器
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // 處理 START 指令，執行廣播
        if (message === 'START') {
            broadcastCountdown();
        }
        // 處理 broadcastCountdown 指令，執行廣播
        if (message === 'broadcastCountdown') {
            broadcastCountdown();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // 向新連接的客戶端發送歡迎消息
    ws.send('Welcome to WebSocket server!');
});


// 廣播倒計時功能
function broadcastCountdown() {
    console.log('Broadcasting START_COUNTDOWN to all clients...');
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('START_COUNTDOWN');
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
