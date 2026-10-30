import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function importSource(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return import(dataUrl);
}

const auth = await importSource('../src/services/authService.js');
const persistence = await importSource('../src/services/sessionStorage.js');

class MemoryAsyncStorage {
  constructor() {
    this.values = new Map();
  }
  async getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }
  async setItem(key, value) {
    this.values.set(key, String(value));
  }
  async removeItem(key) {
    this.values.delete(key);
  }
}

test('1. rejeita login com campos vazios', () => {
  assert.throws(() => auth.validarCamposLogin('', ''), /Preencha o e-mail e a senha/);
  assert.throws(() => auth.validarCamposLogin('aluno@etec.sp.gov.br', ''), /Preencha/);
  assert.throws(() => auth.validarCamposLogin('   ', 'pam2026'), /Preencha/);
});

test('2. rejeita senha incorreta', async () => {
  await assert.rejects(
    auth.login('aluno@etec.sp.gov.br', 'senha-errada', 0),
    /E-mail ou senha inválidos/,
  );
});

test('3. aceita as credenciais corretas e devolve todos os dados exigidos', async () => {
  const result = await auth.login('aluno@etec.sp.gov.br', 'pam2026', 0);
  assert.deepEqual(result, {
    user: {
      id: 1,
      nome: 'João da Silva',
      email: 'aluno@etec.sp.gov.br',
      curso: 'Desenvolvimento de Sistemas',
      modulo: '3º módulo',
    },
    token: 'token-meu-curso-2026',
  });
});

test('4. normaliza espaços e maiúsculas no e-mail', async () => {
  const result = await auth.login('  ALUNO@ETEC.SP.GOV.BR  ', 'pam2026', 0);
  assert.equal(result.user.email, 'aluno@etec.sp.gov.br');
});

test('5. serviço simula tempo de resposta assíncrono', async () => {
  const start = Date.now();
  await auth.login('aluno@etec.sp.gov.br', 'pam2026', 40);
  assert.ok(Date.now() - start >= 30, 'a chamada deveria aguardar o atraso configurado');
});

test('6. salva sessão e recupera após simular fechamento/reabertura', async () => {
  const storage = new MemoryAsyncStorage();
  const session = await auth.login('aluno@etec.sp.gov.br', 'pam2026', 0);
  await persistence.salvarSessao(storage, session);

  // Uma segunda instância do fluxo de inicialização lê o mesmo armazenamento persistente.
  const restored = await persistence.recuperarSessao(storage);
  assert.deepEqual(restored, session);
});

test('7. sessão corrompida é descartada com segurança', async () => {
  const storage = new MemoryAsyncStorage();
  await storage.setItem(persistence.SESSION_STORAGE_KEY, '{json inválido');
  const restored = await persistence.recuperarSessao(storage);
  assert.equal(restored, null);
  assert.equal(await storage.getItem(persistence.SESSION_STORAGE_KEY), null);
});

test('8. rejeita e remove sessão com estrutura inválida', async () => {
  const storage = new MemoryAsyncStorage();
  await storage.setItem(persistence.SESSION_STORAGE_KEY, JSON.stringify({ user: {}, token: 'x' }));
  assert.equal(await persistence.recuperarSessao(storage), null);
  assert.equal(await storage.getItem(persistence.SESSION_STORAGE_KEY), null);
});

test('9. logout remove a sessão persistida', async () => {
  const storage = new MemoryAsyncStorage();
  const session = await auth.login('aluno@etec.sp.gov.br', 'pam2026', 0);
  await persistence.salvarSessao(storage, session);
  await persistence.removerSessao(storage);
  assert.equal(await storage.getItem(persistence.SESSION_STORAGE_KEY), null);
});

test('10. telas e navegação contêm os requisitos essenciais do enunciado', async () => {
  const read = (p) => readFile(new URL(p, import.meta.url), 'utf8');
  const [loginScreen, homeScreen, loadingScreen, navigator, context] = await Promise.all([
    read('../src/screens/LoginScreen.js'),
    read('../src/screens/HomeScreen.js'),
    read('../src/screens/LoadingScreen.js'),
    read('../src/navigation/AppNavigator.js'),
    read('../src/contexts/AuthContext.js'),
  ]);
  assert.match(loginScreen, /secureTextEntry/);
  assert.match(loginScreen, /Alert\.alert/);
  assert.match(loginScreen, /ActivityIndicator/);
  for (const field of ['user.nome', 'user.email', 'user.curso', 'user.modulo', 'token']) {
    assert.ok(homeScreen.includes(field), `campo ausente na área restrita: ${field}`);
  }
  assert.match(homeScreen, /Alert\.alert/);
  assert.match(loadingScreen, /Verificando sessão\.\.\./);
  assert.match(navigator, /isRestoringSession/);
  assert.match(navigator, /isAuthenticated/);
  assert.match(context, /createContext/);
  assert.match(context, /AsyncStorage/);
  assert.match(context, /isLoading/);
  assert.match(context, /signIn/);
  assert.match(context, /signOut/);
  assert.match(context, /isAuthenticated: Boolean\(user && token\)/);
});
