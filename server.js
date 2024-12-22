const express = require('express');
const http = require('http');
const fs = require('fs');
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

let countdownStartTime = null;
const countdownDuration = 60 * 1000; // 90 minutes in milliseconds
const startTimerPassword = '1234'; // Replace with your desired password
const countdownFilePath = 'countdownStartTime.txt';

// Read countdown start time from file if it exists
if (fs.existsSync(countdownFilePath)) {
    const fileContent = fs.readFileSync(countdownFilePath, 'utf8');
    countdownStartTime = parseInt(fileContent, 10);
}

// 健康檢查路由
server.on('request', (req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        console.log('Health check passed');
    }
});

// API endpoint to get the start time
app.get('/getStartTime', (req, res) => {
    if (countdownStartTime) {
        res.json({ startTime: countdownStartTime, duration: countdownDuration });
    } else {
        res.status(404).json({ message: 'Countdown has not started yet' });
    }
});

// API endpoint to start the countdown timer
app.get('/startTimer', (req, res) => {
    const { password } = req.query;
    if (password !== startTimerPassword) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!countdownStartTime) {
        countdownStartTime = new Date().getTime();
        fs.writeFileSync(countdownFilePath, countdownStartTime.toString());
        res.json({ message: 'Countdown started', startTime: countdownStartTime, duration: countdownDuration });
    } else {
        res.status(400).json({ message: 'Countdown already started' });
    }
});

// API endpoint to reset the countdown timer
app.get('/resetTimer', (req, res) => {
    const { password } = req.query;
    if (password !== startTimerPassword) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    countdownStartTime = null;
    if (fs.existsSync(countdownFilePath)) {
        fs.unlinkSync(countdownFilePath);
    }
    res.json({ message: 'Countdown timer reset' });
});

// API endpoint to get the remaining time of the countdown
app.get('/getRemainingTime', (req, res) => {
    if (countdownStartTime) {
        const now = new Date().getTime();
        const countdownDate = countdownStartTime + countdownDuration;
        const remainingTime = countdownDate - now;

        if (remainingTime > 0) {
            res.json({ remainingTime });
        } else {
            res.json({ message: 'Event Ended' });
        }
    } else {
        res.status(404).json({ message: 'Countdown has not started yet' });
    }
});
