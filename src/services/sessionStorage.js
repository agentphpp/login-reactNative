export const SESSION_STORAGE_KEY = '@meu-curso:session';

function sessaoValida(session) {
  return Boolean(
    session &&
    typeof session === 'object' &&
    session.user &&
    typeof session.user === 'object' &&
    session.user.id === 1 &&
    typeof session.user.nome === 'string' &&
    typeof session.user.email === 'string' &&
    typeof session.user.curso === 'string' &&
    typeof session.user.modulo === 'string' &&
    typeof session.token === 'string' &&
    session.token.length > 0
  );
}

export async function salvarSessao(storage, session) {
  if (!sessaoValida(session)) {
    throw new Error('Os dados da sessão são inválidos.');
  }
  await storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function recuperarSessao(storage) {
  const savedValue = await storage.getItem(SESSION_STORAGE_KEY);
  if (!savedValue) return null;

  try {
    const session = JSON.parse(savedValue);
    if (!sessaoValida(session)) throw new Error('Sessão inválida.');
    return session;
  } catch {
    await storage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function removerSessao(storage) {
  await storage.removeItem(SESSION_STORAGE_KEY);
}
