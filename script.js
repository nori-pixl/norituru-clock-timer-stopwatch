// タブ切り替え
function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- 時計 ---
// --- 時計機能 (修正・追加) ---
function updateClock() {
    const now = new Date();
    
    // メイン時計（日本時間）
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('main-clock-display').textContent = `${h}:${m}:${s}`;
    
    // 世界時計も一緒に更新
    updateWorldClock();
}

function updateWorldClock() {
    const timezone = document.getElementById('city-select').value;
    const now = new Date();
    
    try {
        // 指定したタイムゾーンの時刻を書式化して取得
        const timeString = now.toLocaleTimeString('ja-JP', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('world-time-display').textContent = timeString;
    } catch (e) {
        document.getElementById('world-time-display').textContent = "00:00:00";
    }
}

// 1秒ごとに更新を走らせる
setInterval(updateClock, 1000);
updateClock();

// --- 既存のタイマーとストップウォッチのJSはそのまま ---


// --- タイマー (レジ入力方式) ---
let timerInterval;
let timerSeconds = 0;
let inputString = "";

function updateTimerDisplay() {
    let s = inputString.padStart(6, '0');
    let hh = s.substring(0, 2);
    let mm = s.substring(2, 4);
    let ss = s.substring(4, 6);
    document.getElementById('timer-display').textContent = `${hh}:${mm}:${ss}`;
    timerSeconds = parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss);
}

function appendNumber(num) {
    if (timerInterval) return; // 動いている時は入力不可
    if (inputString.length < 6) {
        inputString += num;
        updateTimerDisplay();
    }
}

function deleteLast() {
    inputString = inputString.slice(0, -1);
    updateTimerDisplay();
}

function clearTimer() {
    inputString = "";
    updateTimerDisplay();
}

function startTimer() {
    if (timerInterval || timerSeconds <= 0) return;
    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("時間です！");
            resetTimer();
        } else {
            let h = Math.floor(timerSeconds / 3600);
            let m = Math.floor((timerSeconds % 3600) / 60);
            let s = timerSeconds % 60;
            document.getElementById('timer-display').textContent = 
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    inputString = "";
    updateTimerDisplay();
}

// --- ストップウォッチ ---
// --- ストップウォッチ機能 (修正・追加) ---
let swInterval;
let swStart;
let swElapsed = 0;
let lapCount = 0;

function startStopwatch() {
    if (swInterval) return;
    swStart = Date.now() - swElapsed;
    swInterval = setInterval(() => {
        swElapsed = Date.now() - swStart;
        updateStopwatchDisplay(swElapsed);
    }, 100);
}

function updateStopwatchDisplay(timeMs) {
    const time = new Date(timeMs);
    const m = String(time.getUTCMinutes()).padStart(2, '0');
    const s = String(time.getUTCSeconds()).padStart(2, '0');
    const ms = Math.floor(time.getUTCMilliseconds() / 100);
    document.getElementById('stopwatch-display').textContent = `${m}:${s}.${ms}`;
}

function stopStopwatch() {
    clearInterval(swInterval);
    swInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    swElapsed = 0;
    document.getElementById('stopwatch-display').textContent = "00:00:00.0";
    clearAllLaps(); // リセット時にラップも消す場合はこれを残す
}

// ラップを追加
function addLap() {
    if (swElapsed === 0) return;
    lapCount++;
    const lapTime = document.getElementById('stopwatch-display').textContent;
    const lapList = document.getElementById('lap-list');
    
    const li = document.createElement('li');
    li.innerHTML = `
        <span>Lap ${lapCount}: ${lapTime}</span>
        <button class="delete-lap-btn" onclick="deleteLap(this)">削除</button>
    `;
    lapList.prepend(li); // 新しいラップを上に表示
}

// 個別削除
function deleteLap(btn) {
    btn.parentElement.remove();
}

function clearAllLaps() {
    const lapList = document.getElementById('lap-list');
    
    // リストが空でない場合のみ確認を出す
    if (lapList.children.length > 0) {
        const isConfirmed = confirm("すべてのラップ記録を削除します。よろしいですか？");
        if (isConfirmed) {
            lapList.innerHTML = "";
            lapCount = 0;
        }
    }
}
