# Cadastro de Pessoas

Aplicação Angular para cadastro e consulta de pessoas com validação de dados brasileiros (CPF, telefone) e interface moderna e responsiva.

## 🚀 Funcionalidades

### 📋 Cadastro de Pessoas
- **Formulário completo** com validação de dados
- **Validação de CPF** com algoritmo brasileiro oficial
- **Validação de telefone** (fixo e celular)
- **Validação de email** com formato padrão
- **Máscaras automáticas** para CPF e telefone durante a digitação
- **Feedback visual** em tempo real para campos válidos/inválidos
- **Prevenção de duplicatas** por CPF e email

### 🔍 Consulta de Pessoas
- **Busca por CPF** com validação automática
- **Exibição de dados** em formato estruturado
- **Tratamento de erros** com mensagens amigáveis
- **Interface responsiva** para diferentes dispositivos

### 🎨 Interface e UX
- **Design moderno** com Material Design
- **Navegação intuitiva** com menu responsivo
- **Animações suaves** e micro-interações
- **Acessibilidade** com suporte a leitores de tela
- **Página 404** personalizada e elegante

## 🛠️ Tecnologias Utilizadas

- **Angular 18** - Framework principal
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Material** - Componentes de UI
- **Jest** - Framework de testes
- **Spectator** - Utilitários para testes Angular
- **MSW (Mock Service Worker)** - Mock de API
- **SCSS** - Estilização avançada

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **NPM** ou **pnpm** para gerenciamento de pacotes

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/felipecs0/cadastro-de-pessoas.git
cd cadastro-de-pessoas
```

2. **Instale as dependências:**
```bash
npm install
# ou
pnpm install
```

## 🚀 Executando a Aplicação

### Modo Desenvolvimento
```bash
npm start
# ou
pnpm start
```

A aplicação será executada em `http://localhost:4200`


## 📊 Massas de Dados Mock

A aplicação utiliza dados mock para simular uma API real. Os dados estão definidos em `src/mocks/handlers.ts`:

### 👥 Pessoas Cadastradas

| Nome | CPF | Sexo | Email | Telefone |
|------|-----|------|-------|----------|
| João Silva Santos | 123.456.789-09 | Masculino | joao.silva@email.com | (11) 99999-8888 |
| Ana Carolina Ferreira | 987.654.321-00 | Feminino | ana.ferreira@email.com | (11) 66666-5555 |

### 🔍 Testando a Consulta
Use qualquer um dos CPFs acima para testar a funcionalidade de consulta:
- **123.456.789-09** - João Silva Santos
- **987.654.321-00** - Ana Carolina Ferreira


### 📝 Testando o Cadastro
Para testar o cadastro, use CPFs válidos diferentes dos já cadastrados. Exemplo:
- **111.444.777-35** (CPF válido para teste)
- **123.456.789-87** (CPF válido para teste)

## 🧪 Executando os Testes

### Testes Unitários
```bash
npm test
# ou
pnpm test
```

### Testes com Cobertura
```bash
npm run test:coverage
# ou
pnpm test:coverage
```

### 📊 Cobertura de Testes Atual
- **173 testes** executados com sucesso
- **89.43%** de cobertura de código
- **91.02%** de cobertura de branches
- **89.62%** de cobertura de funções

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços, interceptors e utilitários
│   │   ├── constants/        # Constantes da aplicação
│   │   ├── interceptors/     # Interceptors HTTP
│   │   ├── interfaces/       # Interfaces TypeScript
│   │   ├── services/         # Serviços da aplicação
│   │   ├── utils/            # Utilitários e máscaras
│   │   └── validators/       # Validadores customizados
│   ├── pages/                # Componentes de página
│   │   ├── cadastrar-pessoas/
│   │   ├── consultar-dados/
│   │   └── not-found/
│   ├── shared/               # Componentes e recursos compartilhados
│   └── app.component.*       # Componente principal
├── assets/                   # Recursos estáticos
├── environments/             # Configurações de ambiente
└── mocks/                    # Mock de dados para desenvolvimento
```

## 🎯 Funcionalidades Implementadas

### ✅ Validações
- **CPF**: Validação completa com dígitos verificadores
- **Telefone**: Suporte a telefone fixo (10 dígitos) e celular (11 dígitos)
- **Email**: Validação de formato padrão
- **Campos obrigatórios**: Todos os campos são validados

### ✅ Máscaras
- **CPF**: Formatação automática para `000.000.000-00`
- **Telefone**: Formatação automática para `(00) 00000-0000` ou `(00) 0000-0000`

### ✅ Responsividade
- **Menu adaptativo** com hamburger em dispositivos móveis
- **Formulários responsivos** que se adaptam ao tamanho da tela
- **Design mobile-first** com breakpoints otimizados

### ✅ Acessibilidade
- **ARIA labels** e atributos de acessibilidade
- **Navegação por teclado** funcionando corretamente
- **Contraste adequado** seguindo diretrizes WCAG

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🛡️ Segurança

- Validação rigorosa de dados no frontend
- Sanitização de inputs para prevenir XSS
- Validação de CPF com algoritmo oficial brasileiro
- Tratamento seguro de erros HTTP
