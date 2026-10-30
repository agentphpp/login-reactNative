const ALUNO = Object.freeze({
  id: 1,
  nome: 'João da Silva',
  email: 'aluno@etec.sp.gov.br',
  curso: 'Desenvolvimento de Sistemas',
  modulo: '3º módulo',
});

const SENHA_CORRETA = 'pam2026';
const TOKEN_FICTICIO = 'token-meu-curso-2026';
const TEMPO_RESPOSTA_MS = 800;

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validarCamposLogin(email, senha) {
  const emailInformado = String(email ?? '').trim();
  const senhaInformada = String(senha ?? '');

  if (!emailInformado || !senhaInformada) {
    throw new Error('Preencha o e-mail e a senha.');
  }
}

/**
 * Simula uma chamada de autenticação. O terceiro argumento existe para
 * permitir testes automatizados rápidos; o aplicativo usa os 800 ms padrão.
 */
export async function login(email, senha, tempoRespostaMs = TEMPO_RESPOSTA_MS) {
  validarCamposLogin(email, senha);
  await aguardar(Math.max(0, Number(tempoRespostaMs) || 0));

  const emailNormalizado = String(email).trim().toLowerCase();
  if (emailNormalizado !== ALUNO.email || senha !== SENHA_CORRETA) {
    throw new Error('E-mail ou senha inválidos.');
  }

  return {
    user: { ...ALUNO },
    token: TOKEN_FICTICIO,
  };
}
