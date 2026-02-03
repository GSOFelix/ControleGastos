# Controle de Gastos - Frontend

Sistema de controle de gastos desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Lucide React (ícones)
- **Tailwind CSS** para estilização

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- API rodando em http://localhost:5161/api

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

## ▶️ Executando o Projeto

1. Certifique-se de que a API está rodando em `http://localhost:5161/api`

2. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador: `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para testar o build:

```bash
npm run preview
```


## 🎯 Funcionalidades

### Dashboard
- Visualização de totais (receitas, despesas, saldo líquido)
- Lista de transações recentes
- Criar novas transações
- Deletar transações
- Cards com gradientes e animações

### Pessoas
- Listar pessoas cadastradas
- Criar nova pessoa
- Editar pessoa
- Deletar pessoa (deleta também suas transações)
- Indicador visual para menores de idade
- Grid responsivo com hover effects

### Categorias
- Listar categorias
- Criar nova categoria
- Editar categoria
- Deletar categoria
- Configurar finalidade (Receita/Despesa/Ambos)
- Cores dinâmicas baseadas na finalidade

### Relatórios
- Relatório por pessoa (totais e saldo de cada pessoa)
- Relatório por categoria (totais e saldo de cada categoria)
- Totais gerais consolidados
- Tabelas responsivas

## 🔒 Regras de Negócio Implementadas

1. **Menores de idade**: Apenas despesas são aceitas para menores de 18 anos
2. **Categorias**: Filtradas automaticamente baseado no tipo de transação
3. **Validações**: Campos obrigatórios e limites de tamanho respeitados
4. **Confirmações**: Alertas antes de deletar registros

## ⚙️ Configuração da API

Se sua API estiver em um endereço diferente, edite o arquivo:

`src/utils/constants.ts`

```typescript
export const API_BASE_URL = 'http://seu-servidor:porta/api';
```

## 🎨 Personalização com Tailwind

O projeto usa Tailwind CSS com uma paleta de cores moderna baseada em roxo/violeta.

### Cores principais:
- **Roxo**: `purple-600`, `purple-900` (tema principal)
- **Verde**: `green-500`, `green-600` (receitas)
- **Vermelho**: `red-500`, `red-600` (despesas)
- **Laranja**: `orange-500`, `orange-600` (alertas)

### Customização do Tailwind

Edite o arquivo `tailwind.config.js` para personalizar:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Adicione suas cores customizadas aqui
      },
      fontFamily: {
        // Altere a fonte padrão aqui
      },
    },
  },
}
```

## 🐛 Solução de Problemas


### Erro de conexão
Verifique se a API está rodando e se a URL está correta em `constants.ts`.

### Dependências
Se houver problemas com dependências, tente:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind não está aplicando estilos
Certifique-se de que:
1. O arquivo `tailwind.config.js` está configurado corretamente
2. O arquivo `postcss.config.js` existe
3. O `index.css` importa o Tailwind corretamente

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
