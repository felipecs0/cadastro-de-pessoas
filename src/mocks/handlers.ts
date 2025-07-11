import { http, HttpResponse } from 'msw';
import { environment } from '../environments/environment';
import { PessoaDados } from '../app/core/interfaces/pessoas.interface';

// Base de dados mock
const pessoasDatabase: PessoaDados[] = [
  {
    nome: 'João Silva Santos',
    cpf: '123.456.789-09',
    sexo: 'masculino',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-8888'
  },
  {
    nome: 'Maria Oliveira Costa',
    cpf: '607.590.260-09',
    sexo: 'feminino',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 88888-7777'
  },
  {
    nome: 'Pedro Santos Lima',
    cpf: '456.789.123-45',
    sexo: 'masculino',
    email: 'pedro.lima@email.com',
    telefone: '(11) 77777-6666'
  },
  {
    nome: 'Ana Carolina Ferreira',
    cpf: '987.654.321-00',
    sexo: 'feminino',
    email: 'ana.ferreira@email.com',
    telefone: '(11) 66666-5555'
  },
  {
    nome: 'Carlos Eduardo Silva',
    cpf: '789.123.456-78',
    sexo: 'masculino',
    email: 'carlos.eduardo@email.com',
    telefone: '(11) 55555-4444'
  }
];

// Função para remover máscara do CPF
function removeCpfMask(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

// Função para adicionar máscara ao CPF
function addCpfMask(cpf: string): string {
  const cleanCpf = removeCpfMask(cpf);
  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para validar CPF
function isValidCpf(cpf: string): boolean {
  const cleanCpf = removeCpfMask(cpf);

  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

  return true;
}

export const handlers = [
  // GET /pessoas - Buscar pessoa por CPF
  http.get(`${environment.apiBaseUrl}/pessoas`, ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const cpfParam = url.searchParams.get('cpf');

    if (!cpfParam) {
      return HttpResponse.json(
        {
          title: 'CPF é obrigatório',
          message: 'Parâmetro CPF deve ser fornecido'
        },
        { status: 400 }
      );
    }

    const cleanCpf = removeCpfMask(cpfParam);

    if (!isValidCpf(cleanCpf)) {
      return HttpResponse.json(
        {
          title: 'CPF inválido',
          message: 'O CPF fornecido não é válido'
        },
        { status: 400 }
      );
    }

    // Buscar pessoa pelo CPF
    const pessoa = pessoasDatabase.find(p =>
      removeCpfMask(p.cpf) === cleanCpf
    );

    if (!pessoa) {
      return HttpResponse.json(
        {
          title: 'Pessoa não encontrada',
          message: 'Nenhuma pessoa foi encontrada com o CPF fornecido'
        },
        { status: 404 }
      );
    }

    // Simular delay de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(pessoa));
      }, 1000); // 1 segundo de delay
    });
  }),

  // POST /pessoas - Cadastrar nova pessoa
  http.post(`${environment.apiBaseUrl}/pessoas`, async ({ request }: { request: Request }) => {
    try {
      const novaPessoa = await request.json() as PessoaDados;

      // Validações básicas
      if (!novaPessoa.nome || !novaPessoa.cpf || !novaPessoa.sexo || !novaPessoa.email || !novaPessoa.telefone) {
        return HttpResponse.json(
          {
            title: 'Dados incompletos',
            message: 'Todos os campos são obrigatórios'
          },
          { status: 400 }
        );
      }

      const cleanCpf = removeCpfMask(novaPessoa.cpf);

      // Validar CPF
      if (!isValidCpf(cleanCpf)) {
        return HttpResponse.json(
          {
            title: 'CPF inválido',
            message: 'O CPF fornecido não é válido'
          },
          { status: 400 }
        );
      }

      // Verificar se CPF já existe
      const cpfExists = pessoasDatabase.some(p =>
        removeCpfMask(p.cpf) === cleanCpf
      );

      if (cpfExists) {
        return HttpResponse.json(
          {
            error: 'CPF já cadastrado',
            message: 'Já existe uma pessoa cadastrada com este CPF'
          },
          { status: 409 }
        );
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(novaPessoa.email)) {
        return HttpResponse.json(
          {
            error: 'Email inválido',
            message: 'O email fornecido não tem um formato válido'
          },
          { status: 400 }
        );
      }

      // Verificar se email já existe
      const emailExists = pessoasDatabase.some(p =>
        p.email.toLowerCase() === novaPessoa.email.toLowerCase()
      );

      if (emailExists) {
        return HttpResponse.json(
          {
            title: 'Email já cadastrado',
            message: 'Já existe uma pessoa cadastrada com este email'
          },
          { status: 409 }
        );
      }

      // Normalizar dados
      const pessoaNormalizada: PessoaDados = {
        nome: novaPessoa.nome.trim(),
        cpf: addCpfMask(cleanCpf),
        sexo: novaPessoa.sexo,
        email: novaPessoa.email.toLowerCase().trim(),
        telefone: novaPessoa.telefone.trim()
      };

      // Adicionar à base de dados
      pessoasDatabase.push(pessoaNormalizada);

      // Simular delay de rede
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(HttpResponse.json(
            pessoaNormalizada,
            { status: 201 }
          ));
        }, 1500); // 1.5 segundos de delay
      });

    } catch (error) {
      return HttpResponse.json(
        {
          title: 'Erro interno',
          message: 'Erro ao processar requisição'
        },
        { status: 500 }
      );
    }
  }),

  // GET /pessoas - Listar todas as pessoas
  http.get(`${environment.apiBaseUrl}/pessoas`, () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          pessoas: pessoasDatabase,
          total: pessoasDatabase.length
        }));
      }, 500);
    });
  }),

  // DELETE /pessoas/:cpf - Remover pessoa (endpoint adicional)
  http.delete(`${environment.apiBaseUrl}/pessoas/:cpf`, ({ params }: { params: Record<string, string> }) => {
    const { cpf } = params;
    const cleanCpf = removeCpfMask(cpf);

    const index = pessoasDatabase.findIndex(p =>
      removeCpfMask(p.cpf) === cleanCpf
    );

    if (index === -1) {
      return HttpResponse.json(
        {
          title: 'Pessoa não encontrada',
          message: 'Nenhuma pessoa foi encontrada com o CPF fornecido'
        },
        { status: 404 }
      );
    }

    const pessoaRemovida = pessoasDatabase.splice(index, 1)[0];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          message: 'Pessoa removida com sucesso',
          pessoa: pessoaRemovida
        }));
      }, 800);
    });
  })
];
