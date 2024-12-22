const express = require('express');
const WebSocket = require('ws');
const readline = require('readline');

const app = express();

// 设置静态文件路径
app.use(express.static('public'));

// 获取动态 PORT，确保监听 0.0.0.0
const port = process.env.PORT || 8080;

// 启动 Express 服务器
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// WebSocket 连接事件处理
wss.on('connection', (ws) => {
    console.log('Client connected');

    // 处理客户端消息
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        if (message.trim() === 'START') {
            broadcastCountdown();
        }
    });

    // 处理客户端断开连接
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 广播倒计时功能
function broadcastCountdown() {
    console.log('Broadcasting START_COUNTDOWN to all clients...');
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('START_COUNTDOWN');
        }
    });
}

// 使用 readline 接收终端输入
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
