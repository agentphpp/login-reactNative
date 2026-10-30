# Relatório de testes — Meu Curso

## Resultado automatizado

Comando executado: `npm test`

- **10 testes aprovados**
- **0 testes reprovados**

Cenários cobertos:
1. Campos vazios.
2. Senha incorreta.
3. Login com as credenciais do enunciado.
4. Normalização de espaços e maiúsculas no e-mail.
5. Simulação de tempo de resposta assíncrono.
6. Persistência e recuperação da sessão após simulação de reabertura.
7. Remoção de sessão com JSON corrompido.
8. Remoção de sessão com estrutura inválida.
9. Logout e remoção da sessão salva.
10. Verificação estrutural dos requisitos essenciais nas telas, contexto e navegação.

## Outras verificações

- Sintaxe JavaScript/JSX: validada em 11 arquivos.
- Árvore de dependências declarada no `package-lock.json`: validada com `npm ls --package-lock-only`.
- Arquivo ZIP: validado após a compactação.
- `node_modules` e caches locais: não incluídos na entrega.

## Limitação do ambiente

Não foi possível instalar as dependências com `npm ci --offline`, pois o pacote
`zod@3.25.76` não estava disponível no cache local. Por isso, o Expo não foi
iniciado e não foi realizado teste visual em emulador ou dispositivo físico.

Para executar o aplicativo em um computador com acesso ao registro npm:
1. `npm install`
2. `npm test`
3. `npm start`
