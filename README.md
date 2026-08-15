# AvaliaMais

Sistema web para gerenciamento centralizado de pré-conselhos, conselhos de classe e feedbacks educacionais. Permite que alunos, professores e equipe pedagógica colaborem de forma segura, rastreável e em tempo real.

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Perfis de Usuário](#perfis-de-usuário)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar](#como-rodar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Diagrama ER](#diagrama-er)
- [Estrutura de Pastas](#estrutura-de-pastas)

---

## Sobre o Projeto

Muitas instituições ainda utilizam processos manuais (formulários físicos, planilhas, e-mails) para gerenciar conselhos de classe. Isso gera fragmentação de dados, falta de padronização, acesso descontrolado e comunicação ineficiente.

O **AvaliaMais** centraliza e automatiza todo esse fluxo, oferecendo:

- Gestão de eventos de conselho com etapas configuráveis
- Formulários estruturados para pré-conselho de turma, pré-conselho de professores e feedback final
- Chat em tempo real com regras de hierarquia de comunicação
- Dashboards com indicadores de preenchimento e status de etapas
- Controle de acesso por perfil com JWT + Spring Security
- Auditoria completa de todas as operações

---

## Perfis de Usuário

| Perfil | Permissões |
|---|---|
| **Aluno** | Visualiza feedbacks finais após liberação pelo Pedagógico; acessa histórico de feedbacks |
| **Representante** | Mesmas permissões do aluno + preenche pré-conselho da turma após liberação |
| **Professor** | Preenche pré-conselhos individuais por aluno/UC; visualiza feedbacks das suas turmas |
| **Pedagógico** | Gerencia usuários, turmas e eventos; ativa/desativa etapas; consolida feedback final; inicia chats com qualquer usuário |
| **Supervisão** | Visualização somente leitura de todos os feedbacks e registros |
| **Administrador** | Gerencia usuários e turmas |

---

## Funcionalidades

### Gestão de Usuários
- CRUD completo para todos os perfis (em conformidade com a LGPD)
- Cadastro em massa via importação de documentos (turmas e alunos)
- Autenticação com JWT e autorização por perfil via Spring Security
- Validação de unicidade de e-mail e integridade dos dados (Bean Validation)

### Gestão de Eventos de Conselho
- Criação de eventos com data, turma, professores e UCs vinculadas
- Etapas configuráveis: Pré-conselho da Turma → Pré-conselho dos Professores → Feedback Final
- Dashboard de monitoramento com status das etapas e percentual de formulários preenchidos

### Formulários e Feedbacks
- **Pré-conselho da Turma:** Pontos Fortes, Oportunidades de Melhoria, Sugestões para Supervisão/Pedagógico/Recursos, Auto Avaliação da Classe e avaliação por Docente/UC, com assinatura dos participantes
- **Pré-conselho dos Professores:** Pontos Fortes, Oportunidades de Melhoria, Avaliação da Classe e avaliação individual de alunos por UC
- **Feedback Final (Conselho de Classe):** Consolidado pela equipe pedagógica
- Geração de PDF e exportação de relatórios
- Logs completos de auditoria (usuário, timestamp, ação)

### Chat Integrado
- Comunicação em tempo real via WebSocket
- Histórico persistente de conversas
- Regra de hierarquia: usuários só iniciam conversas com o Pedagógico; o Pedagógico pode iniciar com qualquer usuário

### Notificações
- Alertas para mensagens pendentes no chat, novos feedbacks disponíveis e formulários que precisam ser preenchidos

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│           React + TypeScript + Vite (porta 5173)        │
│  Pages: Dashboard, Login, Usuários, Turmas, Eventos,    │
│         Formulários, Feedbacks, Chat                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST + WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                        Backend                          │
│             Spring Boot 3 (porta 8080)                  │
│  Camadas: Controller → Service → Repository             │
│  Segurança: JWT + Spring Security                       │
│  Docs: Swagger UI (/swagger-ui.html)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ JDBC
┌──────────────────────▼──────────────────────────────────┐
│                    Banco de Dados                       │
│                  MySQL 8.0 (porta 3306)                 │
│              Volume persistente: mysql_data             │
└─────────────────────────────────────────────────────────┘
```

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Zustand |
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, WebSocket |
| Banco de Dados | MySQL 8.0 |
| Autenticação | JWT (JSON Web Token) |
| Documentação API | SpringDoc OpenAPI (Swagger UI) |
| Containerização | Docker + Docker Compose |

---

## Pré-requisitos

### Com Docker (recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Sem Docker
- Java 21+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0

---

## Como Rodar

### Com Docker (recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/avaliaMais.git
cd avaliaMais

# Suba todos os serviços (MySQL + Backend + Frontend)
docker compose up --build
```

Aguarde todos os containers iniciarem. Acesse:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

Para parar:
```bash
docker compose down
```

Para parar e remover os dados do banco:
```bash
docker compose down -v
```

---

### Sem Docker

**1. Banco de dados**

Crie um banco MySQL chamado `avalia_mais` e um usuário com acesso a ele.

**2. Backend**

```bash
cd backend

# Configure as variáveis de ambiente ou edite application.properties
export DB_URL=jdbc:mysql://localhost:3306/avalia_mais?createDatabaseIfNotExist=true
export DB_USERNAME=root
export DB_PASSWORD=sua_senha
export JWT_SECRET=avaliamaissecretkey2024avaliamaissecretkey2024avaliamaissecretkey

# Rode com o Maven Wrapper
./mvnw spring-boot:run        # Linux/Mac
mvnw.cmd spring-boot:run      # Windows
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Variáveis de Ambiente

### Backend

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/avalia_mais` | URL de conexão com o MySQL |
| `DB_USERNAME` | `root` | Usuário do banco |
| `DB_PASSWORD` | `root` | Senha do banco |
| `JWT_SECRET` | — | Chave secreta para assinar tokens JWT (mínimo 64 caracteres) |
| `JWT_EXPIRATION` | `86400000` | Validade do token em milissegundos (padrão: 24h) |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Origens permitidas pelo CORS |

### Frontend

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | URL base da API do backend |

---

## Endpoints da API

| Método | Endpoint | Descrição | Perfis |
|---|---|---|---|
| POST | `/api/auth/login` | Autenticação e geração de JWT | Todos |
| GET/POST/PUT/DELETE | `/api/usuarios` | Gestão de usuários | Pedagógico, Admin |
| GET/POST/PUT/DELETE | `/api/turmas` | Gestão de turmas | Pedagógico, Admin |
| POST/GET/PUT | `/api/eventos` | Gestão de eventos de conselho | Pedagógico |
| POST | `/api/formularios/pre-conselho/turma` | Submissão pré-conselho da turma | Representante |
| POST | `/api/formularios/pre-conselho/professor` | Submissão pré-conselho do professor | Professor |
| GET | `/api/feedbacks` | Consulta histórico de feedbacks | Aluno, Representante, Professor, Pedagógico, Supervisão |
| GET/POST | `/api/chat` | Histórico e envio de mensagens | Todos |

Documentação interativa completa disponível em: `http://localhost:8080/swagger-ui.html`

---

## Diagrama ER

```
usuario (id, nome, email, senha, perfil, turma_id, is_representative, data_criacao, data_atualizacao)
   │
   ├──< formulario (id, tipo, usuario_id, evento_id, respostas_json, data_submissao)
   ├──< feedback (id, evento_id, aluno_id, feedback_final, data)
   ├──< mensagem_chat remetente (id, remetente_id, destinatario_id, mensagem, data_envio, lido)
   └──< mensagem_chat destinatario

turma (id, nome, ano, curso, data_criacao)
   │
   ├──< usuario
   └──< evento_conselho

evento_conselho (id, data, turma_id, status_etapas, disciplinas, meta_preenchimento)
   │
   ├──< formulario
   └──< feedback
```

---

## Estrutura de Pastas

```
avaliaMais/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/avaliaplus/
│       ├── config/          # Configurações (Security, WebSocket, OpenAPI)
│       ├── controller/      # Endpoints REST
│       ├── dto/             # Data Transfer Objects
│       ├── exception/       # Tratamento global de exceções
│       ├── model/           # Entidades JPA
│       ├── repository/      # Interfaces Spring Data
│       ├── security/        # JWT Filter, UserDetailsService
│       └── service/         # Regras de negócio
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── components/      # Componentes reutilizáveis (AppShell, Sidebar)
        ├── pages/           # Páginas da aplicação
        ├── services/        # Chamadas HTTP à API
        ├── store/           # Gerenciamento de estado (Zustand)
        └── types/           # Tipos TypeScript
```
