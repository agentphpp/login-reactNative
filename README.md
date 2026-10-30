# Meu Curso — PAM II

Aplicativo de autenticação em React Native/Expo desenvolvido com base no enunciado
"EXERCÍCIO – AUTENTICAÇÃO EM REACT NATIVE".

## Credenciais de teste

- E-mail: `aluno@etec.sp.gov.br`
- Senha: `pam2026`

## Executar

1. Instale as dependências com `npm install`.
2. Inicie o Expo com `npm start`.
3. Use a opção Android, iOS ou Web conforme o ambiente disponível.

## Testes automatizados

Execute `npm test`. Os testes verificam validação de campos vazios, senha incorreta,
autenticação correta, dados e token devolvidos, simulação do tempo de resposta,
persistência/recuperação da sessão, limpeza de sessão inválida e logout.

## Estrutura

- `src/services/authService.js`: autenticação simulada e dados do aluno.
- `src/services/sessionStorage.js`: persistência e recuperação da sessão.
- `src/contexts/AuthContext.js`: estado global de autenticação via Context API.
- `src/navigation/AppNavigator.js`: controle de acesso às telas.
- `src/screens/`: telas de login, carregamento e área restrita.

O token é fictício, conforme solicitado no enunciado. Não há integração com API real.
