// 引入所需模組
const http = require('http');
const WebSocket = require('ws');
const readline = require('readline');

// 獲取 Fly.io 提供的動態 PORT
const port = process.env.PORT || 8080;

// 創建 HTTP 伺服器
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
});

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
        // 如果接收到 START 指令，執行廣播
        if (message === 'START') {
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
