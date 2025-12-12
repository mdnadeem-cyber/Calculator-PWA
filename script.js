// Simple calculator logic
const displayEl = document.getElementById('display');
const calculator = document.getElementById('calculator');

let expression = '';

function updateDisplay() {
  displayEl.textContent = expression === '' ? '0' : expression;
}

// SAFE eval (only numbers + basic operators)
function safeEval(expr) {

  // Allowed: 0-9 + - * / . ( )
  const safePattern = /^[0-9+\-*/().\s]+$/;

  if (!safePattern.test(expr)) throw new Error('Invalid characters');

  // Prevent invalid sequences: ** or // etc.
  const badSeq = /[+\-*/]{2,}/;
  if (badSeq.test(expr.replace(/\s+/g, ''))) {
    throw new Error('Malformed expression');
  }

  return Function('return (' + expr + ')')();
}

// CLICK buttons
calculator.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.matches('button')) return;

  const value = target.dataset.value;
  const action = target.dataset.action;

  if (action === 'clear') {
    expression = '';
    updateDisplay();
    return;
  }

  if (action === 'back') {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (action === 'equals') {
    try {
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
      expression = String(safeEval(sanitized));
    } catch {
      expression = 'Error';
    }
    updateDisplay();
    return;
  }

  // Normal inputs
  if (value) {

    // Prevent multiple dots in one number block
    if (value === '.') {
      const parts = expression.split(/[^0-9.]/);
      const last = parts[parts.length - 1];
      if (last.includes('.')) return;
    }

    expression += value;
    updateDisplay();
  }
});

// KEYBOARD support
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/^[0-9]$/.test(key)) {
    expression += key;
    updateDisplay();
    return;
  }

  if (key === '.') {
    expression += '.';
    updateDisplay();
    return;
  }

  if (key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    try {
      expression = String(safeEval(expression));
    } catch {
      expression = "Error";
    }
    updateDisplay();
    return;
  }

  if (['+', '-', '*', '/', '(', ')'].includes(key)) {
    expression += key;
    updateDisplay();
  }
});

// INITIAL
updateDisplay();
