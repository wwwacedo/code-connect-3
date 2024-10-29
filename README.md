##### 1 - Instalar as dependências do projeto:

```bash
pnpm i
```

##### 2 - Garantir que o docker esteja executando o nosso container do postgres:

```bash
docker compose up -d
```

##### 3 - Executar as migrations e o seeder:

```bash
npx prisma migrate dev && npx prisma generate && npx prisma db seed
```

##### 4 - Executar a aplicação:

```bash
pnpm dev
```

#### 5 - Instalar Next-Auth:

```bash
pnpm i next-auth@4
```