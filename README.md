# Controle de Gastos — Repositório

Aplicação completa para controle financeiro pessoal, composta por:
- Backend: API REST em .NET 9
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS

## Funcionalidades do App

- Pessoas
  - CRUD de pessoas (nome, idade)
- Categorias
  - CRUD de categorias
  - Definição de finalidade (Receita, Despesa ou Ambos)
- Transações
  - Registro de receitas e despesas
  - Validações de negócio (perfil do usuário e finalidade da categoria)
- Relatórios
  - Resumo por Pessoa (total de receitas, despesas e saldo)
  - Resumo por Categoria (agrupamento por tipo de gasto)
- Regras de Negócio
  - Proteção de menores: menores de 18 anos não podem registrar “Receita”
  - Consistência de categoria: transação compatível com a finalidade da categoria
  - Tratamento global de erros e validações rigorosas

## Estrutura do Repositório

- backend/
  - ControleGastos.Api
  - ControleGastos.Application
  - ControleGastos.Domain
  - ControleGastos.Infrastructure
  - ControleGastos.Shared
- frontend/
  - Projeto React + Vite (TypeScript e Tailwind)

## Pré-requisitos

- .NET SDK 9.0
- PostgreSQL em execução
- Node.js (versão 16 ou superior)
- npm ou yarn

## Como Rodar

Backend:

    cd backend
    dotnet restore
    dotnet ef database update --project ../ControleGastos.Infrastructure --startup-project ../ControleGastos.Api
    dotnet run --project ControleGastos.Api

API disponível em:

    http://localhost:5161/api
    http://localhost:5161/index.html (Swagger)

Frontend:

    cd frontend
    npm install
    # ou: yarn
    # configure a URL da API (ex.: .env)
    # VITE_API_URL=http://localhost:5161/api
    npm run dev
    # ou: yarn dev

Aplicação web:

    http://localhost:5173
