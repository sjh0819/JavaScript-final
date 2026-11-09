// ============================================================
//  calculator.js — 계산기 핵심 로직
// ============================================================

const mainDisplay = document.getElementById("mainDisplay");
const subDisplay  = document.getElementById("subDisplay");

let expression     = "";    // 현재 입력 중인 수식 문자열
let justCalculated = false; // 방금 = 을 눌렀는지 여부

// 디스플레이 갱신 (수정 금지)
export const updateDisplay = () => {
    mainDisplay.textContent = expression || "0";
    mainDisplay.style.fontSize = expression.length > 10 ? "1.8rem" : "2.6rem";
};

// 전체 초기화 (수정 금지)
export const clearAll = () => {
    expression     = "";
    justCalculated = false;
    mainDisplay.textContent    = "0";
    mainDisplay.style.fontSize = "2.6rem";
    subDisplay.textContent     = "";
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
};

// 과제 1 — appendNumber : 숫자 입력
export const appendNumber = (num) => {
    if (justCalculated) {
        expression = "";
    }

    if (num === ".") {
        const lastOperatorIndex = Math.max(
            expression.lastIndexOf("+"),
            expression.lastIndexOf("-"),
            expression.lastIndexOf("*"),
            expression.lastIndexOf("/")
        );
        const currentNumber = expression.slice(lastOperatorIndex + 1);
        if (currentNumber.includes(".")) {
            return;
        }
    }

    if (expression === "0" && num !== ".") {
        expression = num;
    } else {
        expression += num;
    }

    justCalculated = false;
    updateDisplay();
};

// 과제 2 — appendOperator : 연산자 입력
export const appendOperator = (op) => {
    if (expression === "") {
        return;
    }

    const lastChar = expression[expression.length - 1];
    const operators = ["+", "-", "*", "/"];
    
    if (operators.includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
        updateDisplay();
        return;
    }

    expression += op;
    justCalculated = false;
    updateDisplay();
};

// 과제 3 — calculate : 계산 실행
export const calculate = () => {
    const operators = ["+", "-", "*", "/"];
    if (expression === "" || operators.includes(expression[expression.length - 1])) {
        return null;
    }

    if (/\/0/.test(expression)) {
        if (subDisplay) {
            subDisplay.textContent = "0으로 나눌 수 없습니다.";
        }
        return null;
    }

    try {
        const rawResult = Function('"use strict"; return (' + expression + ')')();
        const result = parseFloat(rawResult.toFixed(10)).toString();

        if (mainDisplay) {
            mainDisplay.textContent = result;
        }
        if (subDisplay) {
            subDisplay.textContent = expression + " =";
        }
        justCalculated = true;

        const savedExpression = expression;
        expression = result;
        
        return { expression: savedExpression, result: result };
    } catch (error) {
        return null;
    }
};

// 과제 4 — deleteLast : 마지막 문자 삭제
export const deleteLast = () => {
    if (justCalculated) {
        clearAll();
        return;
    }

    if (expression.length <= 1) {
        expression = "0";
    } else {
        expression = expression.slice(0, -1);
    }

    updateDisplay();
};

// [도전 1] appendPercent : % 연산
export const appendPercent = () => {
    if (expression === "") return;

    const lastOperatorIndex = Math.max(
        expression.lastIndexOf("+"),
        expression.lastIndexOf("-"),
        expression.lastIndexOf("*"),
        expression.lastIndexOf("/")
    );

    if (lastOperatorIndex === expression.length - 1) return;

    const prefix = expression.slice(0, lastOperatorIndex + 1);
    const currentNumStr = expression.slice(lastOperatorIndex + 1);

    if (currentNumStr === "") return;

    const percentValue = parseFloat(currentNumStr) / 100;
    expression = prefix + percentValue;
    updateDisplay();
};

// [도전 3] setExpression : 기록 클릭 시 결과 불러오기
export const setExpression = (value) => {
    expression = value.toString();
    justCalculated = true;
    updateDisplay();
};