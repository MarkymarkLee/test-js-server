# Run
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>90-Minute Countdown</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: black; /* 背景设置为黑色 */
            color: white; /* 默认文字为白色 */
        }
        h1 {
            font-size: 2rem; /* 标题字体大小 */
            font-weight: bold; /* 标题文字加粗 */
            margin-top: 20%; /* 距顶部距离 */
        }
        #timer {
            font-size: 4rem; /* 倒计时字体大小 */
            font-weight: bold; /* 倒计时文字加粗 */
            color: red; /* 倒计时文字为红色 */
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>90-Minute Countdown Timer</h1>
    <div id="timer">00:00:00</div>
    <script>
        // 设置倒计时的目标时间（90分钟后）
        const countdownDate = new Date().getTime() + 90 * 60 * 1000;

        // 每秒更新一次倒计时
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // 计算剩余时间
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 显示倒计时
            document.getElementById("timer").textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // 如果倒计时结束，显示提示信息
            if (distance < 0) {
                clearInterval(timerInterval);
                document.getElementById("timer").textContent = "Time's up!";
            }
        }, 1000);
    </script>
</body>
</html>
