const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost/vku-field-survey/api').replace(/\/$/, '');
const tokenKey = 'vku_auth_token';
export const getAuthToken = () => localStorage.getItem(tokenKey) || '';
export async function logout() { try { await call('logout', 'POST'); } catch { /* session may already be expired */ } localStorage.removeItem(tokenKey); location.reload(); }
const call = async (action: string, method: 'GET' | 'POST', data?: unknown) => {
  const response = await fetch(`${API_BASE}/index.php?action=${action}`, { method, headers: { 'Content-Type': 'application/json', ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}) }, body: method === 'POST' ? JSON.stringify(data || {}) : undefined });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Không thể kết nối máy chủ.');
  return result;
};

export function initAuth(onReady: (user: { id: number; full_name: string; email: string }) => void) {
  const root = document.createElement('div'); root.className = 'auth-layer'; document.body.append(root);
  const clear = () => { root.remove(); onReady((window as any).__vkuUser); };
  const show = (mode: 'login' | 'register' = 'login', message = '') => {
    root.innerHTML = `<section class="auth-card"><img src="/vku.png" alt="VKU"/><p class="eyebrow blue">VKU CAMPUS OPERATIONS</p><h1>${mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h1><p class="auth-error">${message}</p><form id="auth-form">${mode === 'register' ? '<label>Họ và tên<input name="fullName" required /></label>' : ''}<label>Email<input name="email" type="email" required /></label><label>Mật khẩu<input name="password" type="password" minlength="6" required /></label>${mode === 'register' ? '<label>Nhập lại mật khẩu<input name="confirm" type="password" minlength="6" required /></label>' : ''}<button class="submit-button" type="submit">${mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button></form><button class="auth-switch" id="auth-switch">${mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></section>`;
    root.querySelector('#auth-switch')!.addEventListener('click', () => show(mode === 'login' ? 'register' : 'login'));
    root.querySelector('form')!.addEventListener('submit', async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget as HTMLFormElement); const password = String(form.get('password')); if (mode === 'register' && password !== String(form.get('confirm'))) return show(mode, 'Mật khẩu nhập lại không khớp.'); try { const result = await call(mode, 'POST', Object.fromEntries(form.entries())); if (mode === 'register') return show('login', 'Đăng ký thành công, hãy đăng nhập.'); localStorage.setItem(tokenKey, result.token); (window as any).__vkuUser = result.user; clear(); } catch (error) { show(mode, error instanceof Error ? error.message : 'Có lỗi xảy ra.'); } });
  };
  if (getAuthToken()) call('me', 'GET').then(result => { (window as any).__vkuUser = result.user; clear(); }).catch(() => { localStorage.removeItem(tokenKey); show(); }); else show();
}
