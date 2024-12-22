const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const readline = require('readline');

const app = express();

// 提供靜態文件
app.use(express.static('public'));

// 獲取 Fly.io 提供的動態 PORT
const port = process.env.PORT || 8080;

// 創建 HTTP 伺服器
const server = http.createServer(app);

// 啟動 HTTP 伺服器
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// 建立 WebSocket 伺服器
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        if (message === 'START' || message === 'broadcastCountdown') {
            broadcastCountdown();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('Welcome to WebSocket server!');
});

// 廣播倒計時功能
function broadcastCountdown() {
    console.log('Broadcasting START_COUNTDOWN to all clients...');
    let sentCount = 0; // 用來記錄成功發送的客戶端數量
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('START_COUNTDOWN');
            console.log('START_COUNTDOWN sent to a client');
            sentCount++;
        }
    });
    console.log(`Broadcasted to ${sentCount} clients.`);
}

// 使用 readline 接收終端輸入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (input) => {
    if (input.trim() === 'broadcastCountdown') {
        broadcastCountdown();
    } else {
        console.log(`Unknown command: ${input}`);
    }
});

// 掛載廣播函數和 WebSocket 伺服器到全局作用域（可選）
global.broadcastCountdown = broadcastCountdown;
global.wss = wss;
