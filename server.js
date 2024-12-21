const express = require('express');
const WebSocket = require('ws');
const readline = require('readline');

const app = express();

// 設置靜態文件路徑
app.use(express.static('public'));

// 獲取 Heroku 提供的動態 PORT
const port = process.env.PORT || 8080;

// 啟動 Express 伺服器
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// 建立 WebSocket 伺服器
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
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
