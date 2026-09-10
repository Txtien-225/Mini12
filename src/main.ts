import './styles.css';

type Operator = '+' | '-' | '×' | '÷';
const app = document.querySelector<HTMLDivElement>('#app')!;
let display = '0', previous: number | null = null, operator: Operator | null = null;
let waitingForOperand = false, expression = '';

const format = (value: number) => {
  if (!Number.isFinite(value)) return 'Lỗi';
  return String(Number(value.toPrecision(12)));
};
const calculate = (a: number, b: number, op: Operator) => op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : b === 0 ? Infinity : a / b;

function render() {
  app.innerHTML = `
    <main class="page-shell">
      <header class="brand-bar">
        <div class="brand-lockup"><img src="/vku.png" alt="VKU - Đại học Đà Nẵng" />
          <div class="brand-copy"><span>ĐẠI HỌC ĐÀ NẴNG</span><strong>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN<br />VÀ TRUYỀN THÔNG VIỆT - HÀN</strong></div>
        </div><span class="assignment-tag">BÀI TẬP CÁ NHÂN</span>
      </header>
      <section class="content">
        <div class="heading-block"><p class="kicker">BÀI TẬP LẬP TRÌNH CƠ BẢN</p><h1>Calculator</h1><p class="subtitle">Thực hiện các phép toán cơ bản: cộng, trừ, nhân, chia</p></div>
        <section class="calculator" aria-label="Calculator">
          <div class="calculator-top"><span>VKU CALCULATOR</span><span>READY</span></div>
          <div class="screen"><div class="expression" id="expression">${expression || '&nbsp;'}</div><output id="display" aria-live="polite">${display}</output></div>
          <div class="keys">
            <button class="utility" data-action="clear">AC</button><button class="utility" data-action="sign">±</button><button class="utility" data-action="percent">%</button><button class="operator" data-value="÷">÷</button>
            <button data-value="7">7</button><button data-value="8">8</button><button data-value="9">9</button><button class="operator" data-value="×">×</button>
            <button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button><button class="operator" data-value="-">−</button>
            <button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button><button class="operator" data-value="+">+</button>
            <button class="zero" data-value="0">0</button><button data-action="decimal">.</button><button class="equals" data-action="equals">=</button>
          </div>
        </section>
        <p class="hint"><span>⌨</span> Bạn cũng có thể sử dụng bàn phím để nhập phép tính</p>
      </section>
      <footer><span class="line red"></span><span class="line gold"></span><span class="line blue"></span></footer>
    </main>`;
  bind();
}
function inputDigit(digit: string) {
  if (display === 'Lỗi' || waitingForOperand) { display = digit; waitingForOperand = false; }
  else display = display === '0' ? digit : display + digit;
}
function chooseOperator(next: Operator) {
  const value = Number(display);
  if (previous !== null && operator && !waitingForOperand) { display = format(calculate(previous, value, operator)); previous = display === 'Lỗi' ? null : Number(display); }
  else previous = value;
  operator = next; waitingForOperand = true; expression = `${format(previous ?? value)} ${next}`;
}
function press(action?: string, value?: string) {
  if (value && /^[0-9]$/.test(value)) inputDigit(value);
  else if (value === '÷' || value === '×' || value === '-' || value === '+') chooseOperator(value);
  else if (action === 'decimal' && !display.includes('.')) display += '.';
  else if (action === 'clear') { display = '0'; previous = null; operator = null; waitingForOperand = false; expression = ''; }
  else if (action === 'sign' && display !== '0' && display !== 'Lỗi') display = display.startsWith('-') ? display.slice(1) : `-${display}`;
  else if (action === 'percent' && display !== 'Lỗi') display = format(Number(display) / 100);
  else if (action === 'equals' && previous !== null && operator) { const result = calculate(previous, Number(display), operator); expression = `${format(previous)} ${operator} ${display} =`; display = format(result); previous = null; operator = null; waitingForOperand = true; }
  updateScreen();
}
function updateScreen() { document.querySelector('#display')!.textContent = display; document.querySelector('#expression')!.innerHTML = expression || '&nbsp;'; }
function bind() { document.querySelectorAll<HTMLButtonElement>('.keys button').forEach((button) => button.addEventListener('click', () => press(button.dataset.action, button.dataset.value))); }
window.addEventListener('keydown', (event) => {
  const keyMap: Record<string, string> = { '*': '×', '/': '÷' };
  if (/^[0-9]$/.test(event.key)) press(undefined, event.key);
  else if (['+', '-', '*', '/'].includes(event.key)) { event.preventDefault(); press(undefined, keyMap[event.key] || event.key); }
  else if (event.key === '.') press('decimal'); else if (event.key === 'Enter' || event.key === '=') press('equals');
  else if (event.key === 'Escape') press('clear'); else if (event.key === '%') press('percent');
});
render();
