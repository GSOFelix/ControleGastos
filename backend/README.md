# Controle de Gastos - Backend

API REST robusta para controle financeiro desenvolvida com .NET 9, seguindo princípios de Clean Architecture, Domain-Driven Design (DDD) e SOLID.

## 🚀 Tecnologias

- Framework: .NET 9
- Linguagem: C#
- Banco de Dados: PostgreSQL
- ORM: Entity Framework Core (EF Core)
- Documentação: Swagger
- Validação: FluentValidation (com AutoValidation)
- Mapeamento: Extension Methods (Pattern Mappers)

## 🏛️ Arquitetura

O projeto foi organizado em camadas para garantir escalabilidade e facilidade de testes:

- API: Porta de entrada. Contém os Controllers, Middlewares de exceção global e configurações de Dependency Injection.
- Application: Orquestração da aplicação. Divide-se em Services para operações de CRUD simples e Use Cases para fluxos de negócio complexos.
- Domain: O coração do sistema. Contém Entidades ricas, Enums, Interfaces de Repositórios e as principais Regras de Negócio.
- Infrastructure: Camada de implementação técnica. Contém o AppDbContext, Migrations e a implementação dos Repositórios.
- Shared: Componentes reutilizáveis por todas as camadas, como DTOs e Exceções customizadas.

## 📋 Pré-requisitos

- .NET SDK 9.0: https://dotnet.microsoft.com/download/dotnet/9.0
- PostgreSQL instalado e rodando: https://www.postgresql.org/
- Porta padrão da API: http://localhost:5161

## 🔧 Instalação e Configuração

1. Clone o repositório:

    git clone https://github.com/GSOFelix/ControleGastos.git
    cd ControleGastos/backend

2. Restaure as dependências do projeto:

    dotnet restore

3. Configure a Connection String no arquivo appsettings.json (se necessário).

4. Execute as migrations para criar o banco de dados:

    dotnet ef database update --project ../ControleGastos.Infrastructure --startup-project ../ControleGastos.Api

## ▶️ Executando o Projeto

Execute o projeto em modo de desenvolvimento:

    dotnet run --project ControleGastos.Api

Acesse o Swagger para testar os endpoints: http://localhost:5161/index.html

## 🎯 Funcionalidades e Endpoints

- Pessoas (/api/pessoa)
  - CRUD completo de pessoas.
  - Gerenciamento de dados básicos (Nome, Idade).

- Categorias (/api/categoria)
  - CRUD completo de categorias.
  - Definição de finalidade (Receita, Despesa ou Ambos).

- Transações (/api/transacao)
  - Lançamento de movimentações financeiras.
  - Validação inteligente baseada no perfil do usuário.

- Relatórios e Consultas (/api/transacao/relatorio-categoria)
- Relatórios e Consultas (/api/transacao/relatorio-pessoa)
  - Resumo por Pessoa: Totais de receitas, despesas e saldo líquido por usuário.
  - Resumo por Categoria: Agrupamento financeiro por tipo de gasto.

## 🔒 Regras de Negócio Implementadas

- Proteção de Menores: O sistema impede que pessoas menores de 18 anos cadastrem transações do tipo "Receita".
- Consistência de Categoria: Uma transação só pode ser vinculada a uma categoria que aceite aquele tipo de operação (ex.: não é possível usar uma categoria exclusiva de "Despesa" em uma "Receita").
- Tratamento Global de Erros: Middleware customizado que captura exceções de domínio e as transforma em respostas HTTP adequadas (400 Bad Request, 404 Not Found, 422 Unprocessable Entity).
- Validação Rigorosa: Uso de FluentValidation para garantir integridade dos dados (ex.: nome mínimo de 3 caracteres).

## ⚙️ Estrutura de Pastas Útil

- Application/UseCase: Contém os fluxos de negócio isolados.
- Application/Service: Contém os CRUDs diretos.
- Domain/Entities: Contém o modelo rico com as regras de validação no construtor.
- Api/Middlewares: Contém o ExceptionMiddleware para respostas padronizadas.

## 🐛 Solução de Problemas

- Erro de Conexão com Banco:
  - Certifique-se de que o serviço do PostgreSQL está iniciado e que as credenciais no appsettings.json estão corretas.

- Erros de Reflection/Carregamento:
  - Caso ocorra erro ao iniciar, limpe os resíduos de compilação:

    dotnet clean
    dotnet build

Este backend foi desenvolvido focado em boas práticas de mercado e performance.
