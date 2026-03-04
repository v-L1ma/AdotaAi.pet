# 🐾 AdotaAi.pet — Documentação do Backend

## Visão Geral

O backend do **AdotaAi.pet** é uma API REST desenvolvida com **Spring Boot 3.5.5** e **Java 21**, utilizando **PostgreSQL** como banco de dados. A documentação interativa da API está disponível via Swagger UI em `/swagger-ui.html` após iniciar a aplicação.

---

## Stack Tecnológica

| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.5 |
| Spring Data JPA / Hibernate | (gerenciado pelo Boot) |
| PostgreSQL (driver) | (gerenciado pelo Boot) |
| SpringDoc OpenAPI (Swagger) | 2.8.11 |
| Maven | (wrapper incluso) |

---

## Estrutura do Projeto

```
backend/
└── src/
    └── main/
        ├── java/com/adotaai/adotaai/
        │   ├── AdotaaiApplication.java       # Ponto de entrada da aplicação
        │   ├── Controller/
        │   │   ├── UsuarioController.java
        │   │   ├── PetController.java
        │   │   └── EventoController.java
        │   ├── Service/
        │   │   ├── UsuarioService.java
        │   │   ├── PetService.java
        │   │   └── EventoService.java
        │   ├── Repository/
        │   │   ├── UsuarioRepository.java
        │   │   ├── PetRepository.java
        │   │   └── EventoRepository.java
        │   ├── Entity/
        │   │   ├── UsuarioEntity.java
        │   │   ├── PetEntity.java
        │   │   └── EventoEntity.java
        │   └── DTO/
        │       ├── UsuarioDTO.java
        │       ├── PetDTO.java
        │       └── EventoDTO.java
        └── resources/
            └── application.properties        # Configurações da aplicação
```

---

## Configuração do Banco de Dados

As configurações estão em `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/projeto
spring.datasource.username=postgres
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

> ⚠️ **Atenção:** `ddl-auto=create-drop` recria o schema do banco a cada reinicialização da aplicação, resultando em **perda de dados**. As credenciais também estão hardcoded no arquivo de configuração.

---

## ✅ O que já foi implementado

### Entidades e Tabelas

#### `UsuarioEntity` — Tabela `USUARIO`

| Campo | Tipo | Restrições |
|---|---|---|
| `id` | Long | PK, auto-increment, único, não nulo |
| `nome` | String | não nulo |
| `cpfcnpj` | String | único, não nulo |
| `email` | String | único, não nulo |
| `senha` | String | não nulo |
| `telefone` | String | não nulo |
| `cargo` | String | não nulo |
| `link_foto` | String | não nulo |
| `endereco` | String | não nulo |
| `cep` | String | não nulo |
| `bairro` | String | não nulo |
| `cidade` | String | não nulo |
| `sg_estado` | String | não nulo |
| `status` | String | não nulo |

#### `PetEntity` — Tabela `PET`

| Campo | Tipo | Restrições |
|---|---|---|
| `id` | Long | PK, auto-increment |
| `nome` | String | não nulo |
| `status` | String | não nulo |
| `descricao` | String | não nulo |
| `dt_nasc` | Date | não nulo |
| `porte` | String | não nulo |
| `raca` | String | não nulo |
| `especie` | String | não nulo |
| `link_foto` | String | não nulo |
| `user` (user_id) | FK → USUARIO | ManyToOne, ON DELETE CASCADE |

#### `EventoEntity` — Tabela `EVENTO`

| Campo | Tipo | Restrições |
|---|---|---|
| `id` | Long | PK, auto-increment |
| `nome` | String | não nulo |
| `endereco` | String | não nulo |
| `bairro` | String | não nulo |
| `cidade` | String | não nulo |
| `cep` | String | não nulo |
| `hrinicio` | Time | não nulo |
| `hrfim` | String | não nulo |
| `descricao` | String | não nulo |
| `data` | Date | não nulo |
| `status` | String | não nulo |
| `nmorganizador` | String | não nulo |
| `user` (user_id) | FK → USUARIO | ManyToOne, ON DELETE CASCADE |

---

### Endpoints da API

#### Usuários — `/usuario`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/usuario` | Lista todos os usuários |
| `POST` | `/usuario` | Cria um novo usuário (valida e-mail e CPF/CNPJ duplicados) |
| `PUT` | `/usuario/{id}` | Atualiza os dados de um usuário existente |
| `DELETE` | `/usuario/{id}` | Remove um usuário e seus pets (cascade) |

#### Pets — `/pets`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/pets` | Lista todos os pets |
| `POST` | `/pets` | Cria um novo pet vinculado a um usuário |
| `PUT` | `/pets/{id}` | Atualiza os dados de um pet |
| `DELETE` | `/pets/{id}` | Remove um pet |

#### Eventos — `/eventos`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/eventos` | Lista todos os eventos |
| `POST` | `/eventos` | Cria um novo evento vinculado a um usuário |
| `PUT` | `/eventos/{id}` | Atualiza os dados de um evento |
| `DELETE` | `/eventos/{id}` | Remove um evento |

---

### Regras de Negócio Implementadas

- **Unicidade de usuário:** ao criar um usuário, o sistema verifica se já existe outro cadastro com o mesmo e-mail ou CPF/CNPJ.
- **Exclusão em cascata:** ao deletar um usuário, seus pets associados são removidos previamente via `petRepository.deleteByUserId(id)`.
- **Vínculo pet-usuário:** ao criar ou atualizar um pet, é validado se o `user_id` informado corresponde a um usuário existente.
- **Vínculo evento-usuário:** ao criar ou atualizar um evento, é validado se o `user_id` informado corresponde a um usuário existente.

---

### Documentação da API

- **Swagger UI** disponível em: `http://localhost:8080/swagger-ui.html`
- Gerada automaticamente via **SpringDoc OpenAPI** a partir das anotações dos controllers.

---

## ❌ O que ainda falta implementar

### 🔐 Autenticação e Autorização
- [ ] Implementar autenticação com **Spring Security + JWT** (JSON Web Token)
- [ ] Criar endpoint de login (`POST /auth/login`) que retorne um token de acesso
- [ ] Criar endpoint de refresh de token
- [ ] Proteger rotas com base no `cargo` do usuário (ex.: administrador vs. adotante)
- [ ] Senhas devem ser armazenadas com hash seguro (ex.: **BCrypt**) — atualmente estão em texto puro

### 📦 Funcionalidade de Adoção
- [ ] Criar entidade/tabela `AdocaoEntity` para registrar o processo de adoção
- [ ] Implementar endpoint para **solicitar adoção** de um pet (`POST /adocoes`)
- [ ] Implementar endpoint para **aprovar ou rejeitar** uma solicitação de adoção
- [ ] Atualizar automaticamente o `status` do pet ao ser adotado

### ❤️ Favoritos
- [ ] Criar entidade/tabela `FavoritoEntity` (relacionando usuário e pet)
- [ ] Implementar endpoint para **adicionar** pet aos favoritos (`POST /favoritos`)
- [ ] Implementar endpoint para **listar** pets favoritos de um usuário (`GET /favoritos/{userId}`)
- [ ] Implementar endpoint para **remover** pet dos favoritos (`DELETE /favoritos/{id}`)

### 🔍 Filtros e Busca
- [ ] Implementar busca de pets por filtros: espécie, porte, raça, cidade, status
- [ ] Implementar paginação nas listagens (`/pets`, `/eventos`, `/usuario`)
- [ ] Implementar busca de eventos por data, cidade ou status

### 🖼️ Upload de Imagens
- [ ] Integrar serviço de armazenamento de imagens (ex.: AWS S3, Cloudinary ou armazenamento local)
- [ ] Criar endpoint para upload de foto de perfil do usuário
- [ ] Criar endpoint para upload de foto do pet
- [ ] Atualmente `link_foto` aceita apenas URLs externas (string)

### ⚙️ Melhorias de Infraestrutura e Configuração
- [ ] Substituir credenciais hardcoded por variáveis de ambiente (`.env` ou `application-prod.properties`)
- [ ] Alterar `ddl-auto` de `create-drop` para `validate` ou `update` em ambiente de produção (evitar perda de dados)
- [ ] Configurar **CORS** para permitir requisições do frontend mobile
- [ ] Implementar tratamento global de exceções (`@ControllerAdvice`) com respostas de erro padronizadas

### ✅ Validação de Dados
- [ ] Adicionar anotações de validação (`@NotBlank`, `@Email`, `@Size`, etc.) nos DTOs com **Spring Validation**
- [ ] Validar formato de CPF/CNPJ na criação de usuário
- [ ] Validar formato de CEP
- [ ] Retornar mensagens de erro descritivas com código HTTP adequado (400, 404, 409, etc.)

### 🧪 Testes
- [ ] Escrever testes unitários para os Services (`UsuarioService`, `PetService`, `EventoService`)
- [ ] Escrever testes de integração para os Controllers
- [ ] Configurar banco de dados em memória (H2) para testes automatizados

---

## Resumo Geral do Status

| Módulo | Status |
|---|---|
| CRUD de Usuários | ✅ Implementado |
| CRUD de Pets | ✅ Implementado |
| CRUD de Eventos | ✅ Implementado |
| Autenticação / JWT | ❌ Não iniciado |
| Autorização por perfil | ❌ Não iniciado |
| Hash de senha | ❌ Não iniciado (senha em texto puro) |
| Adoção (fluxo completo) | ❌ Não iniciado |
| Favoritos | ❌ Não iniciado |
| Filtros e paginação | ❌ Não iniciado |
| Upload de imagens | ❌ Não iniciado |
| Validação de dados (Bean Validation) | ❌ Não iniciado |
| Tratamento global de erros | ❌ Não iniciado |
| Configuração por ambiente (prod/dev) | ❌ Não iniciado |
| Testes automatizados | ❌ Não iniciado |
