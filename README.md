# API - Mini e-commerce


API REST de e-commerce desenvolvida em **Node.js** com **Express** e **Prisma ORM** com **PostgreSQL** como banco de dados.
<br>
A API oferece autenticação, controle de permissões (admin/customer) e gerenciamento de produtos e pedidos.

**Necessário ter docker instalado para rodar**


<br>

## ⚙️ Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- JWT para autenticação
- OpenAPI (Swagger)

<br>

## 🧩 Funcionalidades

- Cadastro e login de usuarios
- Autenticação via JWT
- Controle de acesso por perfil (admin/customer)
- Crud de produtos (admin)
- Criação e listagem de pedidos por usuário
- Relacionamento entre usuarios, pedidos e produtos
- Banco de dados versionado por meio do prisma
- Ambiente containerizado
<br>

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/Brun0Silveir4/e-commerce-api.git
cd e-commerce-api
```

### 2. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis
```bash
DATABASE_URL="postgresql://postgres:postgres@db:5433/ecommerce"
JWT_SECRET="fb8dbd0b4631121589b17818472bdf07069527e8e1362762a6d1ca9da6ad1b05"
PORT=3000
```


### 3. Rode o projeto pela primeira vez
```bash
docker compose up --build
```

### 4. Rode as migrations

- Primeiro entre no container da aplicação
```bash
docker exec -it ecommerce_api sh
```

<br>

- Execute o comando de migração (gera usuário admin + uma pequena lista de produtos)
```bash
npx prisma db seed
```

<br>

## ROTAS

### Auth
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

<br>

**POST** `/api/auth/register`

Request body:
```json
{
    "name": "Usuario de teste",
    "email": "email1@gmail.com",
    "password": "senha1234"
}
```

<br>

**PUT** `/api/auth/update/me` - `rota protegida`

Request body:
```json
{
    "name": "name",
    "email": "emailnovo@email.com"
}
```

<br>

**PUT** `/api/auth/update/me/password` - `rota protegida`
```json
{
    "oldPassword": "senha123",
    "newPassword": "senha1234"
}
```

<br>

## PRODUTOS

**GET** `/api/products` - `rota protegida`

<br>

**POST** `api/products` - `rota protegida por admin`

Request body
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0
}
```

<br>

**GET** `/api/products/{id}` - `rota protegida`


<br>

**PUT** `/api/products/{id}` - `rota protegida por admin` - coloque apenas as informações que quer editar no body da requisição

Request body
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0
}
```

<br>

**DELETE** `/api/products/{id}` - `rota protegida por admin`

<br>

### Orders

**GET** `/api/orders/me` - `rota protegida`

<br>

**POST** `/api/orders/newOrder` - `rota protegida`
```json
{
  "items": [
    {
      "productId": 0,
      "quantity": 0
    }
  ]
}
```

<br>

**GET** `/api/orders/{orderId}` - `rota protegida`


<br>

**PUT** `/api/orders/pay/{orderId}` - `rota protegida`

<br>

**PUT** `api/orders/cancel/{orderId}` - `rota protegida`

<br>

## Authorization

- Todas as rotas protegidas precisam que coloque isso no header
```json
Authorization: Bearer <JWT_TOKEN>
```
- Se consegue esse JWT token fazendo um login no sistema.




## 🙋‍♂️ Autor

Desenvolvido por Bruno Silveira. Contato:  
• [LinkedIn](https://www.linkedin.com/in/bruno-silveira-dionisio/)  
• [GitHub](https://github.com/Brun0Silveir4)  
• bruno.silveira.dionisio@gmail.com