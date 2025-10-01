 # 🛒 Sistema de Carrinho de Compras

API RESTful para um sistema de carrinho de compras, desenvolvida como parte de um desafio técnico. A aplicação permite criar carrinhos, adicionar e gerenciar produtos, aplicar descontos e finalizar a compra, convertendo o carrinho em um pedido.

---

## ✨ Funcionalidades

- Criação automática de carrinho de compras.
- Adição, atualização e remoção de produtos no carrinho.
- Cálculo de subtotal e total do carrinho.
- Aplicação de cupons de desconto.
- Cálculo de frete.
- Finalização da compra com criação de um pedido no banco de dados.
- Histórico de pedidos.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução do JavaScript no servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Express**: Framework para criação de APIs REST.
- **Sequelize**: ORM (Object-Relational Mapper) para Node.js, utilizado para interagir com o banco de dados.
- **PostgreSQL** (ou outro banco de dados SQL compatível com Sequelize).
- **tsx**: Executa arquivos TypeScript diretamente, otimizado para desenvolvimento.

---

## 🏁 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Um banco de dados SQL (ex: PostgreSQL) rodando localmente ou em um container Docker.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <https://github.com/Alexsandro-J-Ludwig/shopping_carts_system>
    cd shopping_carts_system
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    URL: <URL_DO_SEU_BANCO_DE_DADOS>
    PORT: <PORTA_DO_SEU_SERVIDOR>
    ```

4.  **Rode a aplicação em modo de desenvolvimento:**
    O servidor iniciará e ficará observando alterações nos arquivos.
    ```bash
    npm run dev
    ```

A API estará disponível em `http://localhost:3000`.

---

## 📖 Endpoints da API

| Método | Rota | Descrição | Corpo da Requisição (Exemplo) |
| :--- | :--- | :--- | :--- |
| `POST` | `/carrinho/:id` | Adiciona um produto ao carrinho. Se o ID for inválido, um novo carrinho é criado. | `{ "itens": "uuid-do-produto", "qtd": 2, "valor": 25.50 }` |
| `PUT` | `/carrinho/:id` | Altera a quantidade de um produto específico no carrinho. | `{ "itens": "uuid-do-produto", "qtd": 5 }` |
| `GET` | `/carrinho/:id` | Retorna todos os itens de um carrinho específico. | N/A |
| `GET` | `/carrinho/total/:id` | Calcula o total do carrinho (sem descontos). | N/A |
| `DELETE` | `/carrinho/:id` | Remove um produto do carrinho. | `{ "itens": "uuid-do-produto" }` |
| `POST` | `/carrinho/finalizar/:id` | Finaliza a compra, aplica descontos e cria um pedido. | `{ "cupom": "NOME_DO_CUPOM" }` |

### Cupons

| Método | Rota | Descrição | Corpo da Requisição (Exemplo) |
| :--- | :--- | :--- | :--- |
| `POST` | `/cupom` | Cria um novo cupom de desconto. | `{ "cupom": "PROMO10", "valor_desconto": 10, "data_expiracao": "2025-12-31", "uso_maximo": 100 }` |
| `GET` | `/cupom` | Lista todos os cupons de desconto válidos. | N/A |
| `DELETE` | `/cupom/:cupom` | Deleta um cupom específico pelo nome. | N/A |

---

## 📂 Estrutura do Projeto

O código-fonte está organizado da seguinte forma para facilitar a manutenção e escalabilidade:

- `/src/controller`: Responsável por receber as requisições HTTP e enviar as respostas.
- `/src/service`: Contém a lógica de negócio da aplicação.
- `/src/repository`: Camada de abstração para acesso ao banco de dados (operações de CRUD).
- `/src/model`: Definições dos modelos do Sequelize, que representam as tabelas do banco.
- `/src/dto`: Data Transfer Objects, para validar e tipar os dados que trafegam entre as camadas.