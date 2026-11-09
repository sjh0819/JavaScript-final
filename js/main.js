// ============================================================
//  main.js — 이벤트 연결 및 초기화 (도전 과제 연동 포함)
// ============================================================

import { appendNumber, appendOperator, calculate, deleteLast, clearAll, appendPercent, setExpression } from './calculator.js';
import { loadHistory, addHistory, clearHistory, deleteHistoryItem } from './history.js';

// DOM 요소
const historyPanel = document.getElementById("historyPanel");
const historyList  = document.getElementById("historyList");
const historyBtn   = document.getElementById("historyBtn");
const clearAllBtn  = document.getElementById("clearAllBtn");
const themeBtn     = document.getElementById("themeBtn");
const badge        = document.getElementById("badge");

// ── 기록 렌더링 (도전 2, 3 반영) ──────────────────────────────
const renderHistory = (history) => {
    badge.textContent = history.length;

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-msg">아직 계산 기록이 없어요 🧮</li>';
        return;
    }

    // 도전 2: 각 기록 항목에 삭제 버튼(×) 추가
    historyList.innerHTML = history.map((item, index) => `
        <li class="history-item" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="hist-content" style="flex-grow: 1; cursor: pointer;">
                <div class="hist-expr">${item.expression} =</div>
                <div class="hist-result">${item.result}</div>
                <div class="hist-date">${item.date}</div>
            </div>
            <button class="delete-item-btn" data-index="${index}" style="background:none; border:none; color:#ff5c5c; font-size:1.2rem; cursor:pointer; padding:0 8px;">×</button>
        </li>
    `).join("");

    // [도전 3] 기록 항목 클릭 시 계산기에 결과 로드
    document.querySelectorAll(".hist-content").forEach((el, idx) => {
        el.addEventListener("click", () => {
            setExpression(history[idx].result);
        });
    });

    // [도전 2] 개별 삭제 버튼(×) 클릭 이벤트 연동
    document.querySelectorAll(".delete-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // 부모 클릭(도전 3) 이벤트 전파 방지
            const index = parseInt(btn.dataset.index, 10);
            const updated = deleteHistoryItem(index);
            renderHistory(updated);
        });
    });
};

// ── 버튼 이벤트 ──────────────────────────────────────────────
document.querySelectorAll(".btn-num").forEach(btn =>
    btn.addEventListener("click", () => appendNumber(btn.dataset.num))
);

document.querySelectorAll(".btn-op").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        appendOperator(btn.dataset.op);
    })
);

document.querySelector("[data-action='equals']").addEventListener("click", () => {
    const r = calculate();
    if (r) renderHistory(addHistory(r.expression, r.result));
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
});

document.querySelector("[data-action='clear']").addEventListener("click", clearAll);

document.querySelector("[data-action='delete']").addEventListener("click", deleteLast);

// [도전 1] % 버튼 이벤트 연결 (이 부분이 핵심입니다!)
const percentBtn = document.querySelector("[data-action='percent']");
if (percentBtn) {
    percentBtn.addEventListener("click", appendPercent);
}

// ── 키보드 입력 ──────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        appendNumber(e.key);
        return;
    }
    if (["+", "-", "*", "/"].includes(e.key)) {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        const opBtn = document.querySelector(`[data-op="${e.key}"]`);
        if (opBtn) opBtn.classList.add("active");
        appendOperator(e.key);
        return;
    }
    if (e.key === "Enter" || e.key === "=") {
        const r = calculate();
        if (r) renderHistory(addHistory(r.expression, r.result));
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
    }
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape")    clearAll();
});

// ── 기록 패널 토글 ───────────────────────────────────────────
historyBtn.addEventListener("click", () =>
    historyPanel.classList.toggle("open")
);

clearAllBtn.addEventListener("click", () => renderHistory(clearHistory()));

// ── 다크모드 ─────────────────────────────────────────────────
const applyTheme = (dark) => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    themeBtn.textContent = dark ? "☀️" : "🌙";
};

themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
    localStorage.setItem("calc_theme", !isDark ? "dark" : "light");
});

applyTheme(localStorage.getItem("calc_theme") === "dark");
renderHistory(loadHistory());