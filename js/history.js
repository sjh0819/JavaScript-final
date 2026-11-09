// ============================================================
//  history.js — 계산 기록 관리
// ============================================================

const STORAGE_KEY = "calc_history"; // localStorage 키
const MAX_COUNT = 20; // 최대 저장 개수

// 과제 5 — loadHistory : 기록 불러오기
export const loadHistory = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

// 과제 6 — saveHistory : 기록 저장
export const saveHistory = (history) => {
    const trimmedHistory = history.slice(0, MAX_COUNT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
};

// 과제 7 — addHistory : 기록 항목 추가
export const addHistory = (expression, result) => {
    const history = loadHistory();
    const newItem = {
        expression,
        result,
        date: new Date().toLocaleString("ko-KR")
    };
    
    const updatedHistory = [newItem, ...history];
    saveHistory(updatedHistory);
    
    return updatedHistory;
};

// [도전 2] deleteHistoryItem : 기록 개별 삭제
export const deleteHistoryItem = (index) => {
    const history = loadHistory();
    history.splice(index, 1);
    saveHistory(history);
    return history;
};

// 전체 기록 삭제
export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};