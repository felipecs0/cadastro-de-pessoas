# MSW Mock Configuration

Esta pasta contém a configuração do MSW (Mock Service Worker) para simular as APIs de pessoas em ambiente de desenvolvimento.

## Arquivos

- `handlers.ts` - Define os handlers para as rotas da API
- `browser.ts` - Configuração do MSW para o browser
- `init.ts` - Inicialização dos mocks
- `types.ts` - Tipos TypeScript para as APIs
- `README.md` - Esta documentação

## APIs Mockadas

### GET /api/pessoas?cpf={cpf}
Busca uma pessoa por CPF.

**Parâmetros:**
- `cpf` (query string) - CPF da pessoa (com ou sem máscara)

**Responses:**
- `200` - Pessoa encontrada
- `400` - CPF inválido ou não fornecido
- `404` - Pessoa não encontrada

**Dados de teste disponíveis:**
- CPF: `123.456.789-01` - João Silva Santos
- CPF: `987.654.321-09` - Maria Oliveira Costa
- CPF: `456.789.123-45` - Pedro Santos Lima
- CPF: `321.654.987-21` - Ana Carolina Ferreira
- CPF: `789.123.456-78` - Carlos Eduardo Silva

### POST /api/pessoas
Cadastra uma nova pessoa.

**Body:**
```json
{
  "nome": "Nome da Pessoa",
  "cpf": "000.000.000-00",
  "sexo": "masculino|feminino|outro|nao_informar",
  "email": "email@example.com",
  "telefone": "(00) 00000-0000"
}
```

**Responses:**
- `201` - Pessoa cadastrada com sucesso
- `400` - Dados inválidos (CPF, email, campos obrigatórios)
- `409` - CPF ou email já cadastrado

### GET /api/pessoas/all
Lista todas as pessoas cadastradas (para debug).

**Response:**
```json
{
  "pessoas": [...],
  "total": 5
}
```

### DELETE /api/pessoas/{cpf}
Remove uma pessoa pelo CPF.

**Parâmetros:**
- `cpf` (path) - CPF da pessoa

**Responses:**
- `200` - Pessoa removida com sucesso
- `404` - Pessoa não encontrada

## Como Funciona

1. O MSW é inicializado automaticamente em modo de desenvolvimento no `main.ts`
2. Ele intercepta as chamadas HTTP para `/api/pessoas/*`
3. Retorna dados mockados conforme os handlers definidos
4. Simula delays de rede realistas (1-1.5 segundos)
5. Valida CPF e email
6. Mantém uma base de dados em memória durante a sessão

## Configuração

Os mocks são habilitados automaticamente quando:
- Não estamos em modo de produção
- O hostname é 'localhost'

Para desabilitar os mocks temporariamente, comente a linha de inicialização no `main.ts`.

## Validações Implementadas

- **CPF**: Validação de dígitos verificadores
- **Email**: Formato de email válido
- **Duplicatas**: Verifica CPF e email únicos
- **Campos obrigatórios**: Todos os campos são validados

## Troubleshooting

Se os mocks não estiverem funcionando:

1. Verifique se está em modo de desenvolvimento
2. Abra o DevTools do navegador e procure por mensagens do MSW
3. Certifique-se que o arquivo `mockServiceWorker.js` está na pasta `public/`
4. Verifique se não há erros no console

## Adicionando Novos Endpoints

Para adicionar novos endpoints:

1. Adicione o handler em `handlers.ts`
2. Defina os tipos em `types.ts` se necessário
3. Documente o endpoint neste README
