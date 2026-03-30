# Dynamic Appointment

Sistema de agendamento dinâmico em tempo real para negócios baseados em serviços (barbearias, clínicas veterinárias, consultórios médicos, etc.). Permite que clientes agendem horários com profissionais disponíveis, consultando disponibilidade em tempo real com base na duração do serviço e na agenda do profissional.

## Stack Tecnológica

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Backend      | Java 17, Spring Boot 4.0.3         |
| ORM          | Spring Data JPA / Hibernate         |
| Banco        | PostgreSQL                          |
| Segurança    | Spring Security (JWT em andamento)  |
| E-mail       | Spring Mail (SMTP / Gmail)          | |

---

## Arquitetura C4

A arquitetura segue o modelo C4 com diagramas PlantUML disponíveis em `src/main/resources/C4 Model/`.

### Nível 1 — Contexto do Sistema (C1)

Visão de alto nível do sistema e suas interações externas.

```
┌─────────┐       HTTPS        ┌──────────────────────────────┐       SMTP       ┌──────────────────┐
│ Cliente  │ ◄───────────────► │  Sistema de Agendamento      │ ───────────────► │ Sistema de E-mail │
│ (Pessoa) │                   │  Dinâmico                    │                  │ (Externo)         │
└─────────┘                    │  Agendamento, disponibilidade│                  └────────┬─────────┘
                               │  e gestão de horários        │                           │
                               └──────────────────────────────┘                           │
                                                                                 E-mail   │
                               ┌─────────┐ ◄─────────────────────────────────────────────┘
                               │ Cliente  │
                               └─────────┘
```

**Atores:** Cliente (realiza, consulta e cancela agendamentos)
**Sistemas externos:** Sistema de E-mail (confirmações, lembretes, cancelamentos)

### Nível 2 — Containers (C2)

Decomposição do sistema em containers executáveis.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Sistema de Agendamento Dinâmico                   │
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  Interface        │    │  Web Application  │    │  API          │  │
│  │  Gráfica (React)  │──►│  Java/Spring Boot │──►│  Application  │  │
│  │                    │    │                    │    │  REST API     │  │
│  └──────────────────┘    └──────────────────┘    └──────┬────────┘  │
│                                                          │           │
│                                                          ▼           │
│                                                    ┌───────────────┐ │
│                                                    │  PostgreSQL   │ │
│                                                    │  Database     │ │
│                                                    └───────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
         │                                                    │
         │                                                    ▼
         │                                          ┌──────────────────┐
         │                                          │ Sistema de E-mail│
         │◄─────────────────────────────────────────│ (SMTP)           │
         │              E-mail                      └──────────────────┘
```

### Nível 3 — Componentes (C3) — API Application

Componentes internos da API e suas responsabilidades.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Application                                │
│                                                                             │
│  ┌─────────────────────────┐                                                │
│  │  SchedulingOrchestrator │──────────────────────────┐                     │
│  │  (Orquestração)         │                          │                     │
│  └────────┬────────────────┘                          │                     │
│           │                                           ▼                     │
│           ▼                                  ┌─────────────────┐            │
│  ┌─────────────────────┐                     │  Auth / JWT     │            │
│  │  Modules/Appointment │                    │  (Segurança)    │            │
│  │  Controller, Service │                    └────────┬────────┘            │
│  │  Repository          │                             │                     │
│  └────────┬─────────────┘                             ▼                     │
│           │                                  ┌─────────────────┐            │
│           ▼                                  │  Notificação    │            │
│  ┌────────────────────────┐                  │  E-mail/WhatsApp│            │
│  │  AvailabilityEngine    │                  └─────────────────┘            │
│  │  (Motor de             │                                                 │
│  │   Disponibilidade)     │                                                 │
│  └────┬──────────┬────────┘                                                 │
│       │          │                                                          │
│       ▼          ▼                                                          │
│  ┌──────────┐ ┌────────────────┐                                            │
│  │Modules/  │ │Modules/        │                                            │
│  │Professio.│ │Services        │                                            │
│  └──────────┘ └────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────┘
          │              │              │
          ▼              ▼              ▼
    ┌──────────────────────────────────────┐
    │           PostgreSQL Database         │
    └──────────────────────────────────────┘
```

---

## Estrutura do Projeto

O projeto segue princípios de **Inversão de Dependência** e **DDD**, com separação clara entre Core, Módulos e Infraestrutura.

```
src/main/java/com/leonardo/DynamicAppointment/
│
├── core/                          # Lógica de domínio pura (sem dependência de framework)
│   ├── availability/
│   │   └── AvailabilityEngine     # Calcula slots disponíveis com base na agenda e serviço
│   ├── domain/
│   │   └── Slot                   # Value Object — intervalo de tempo (startTime, endTime)
│   ├── scheduling/
│   │   └── SchedulingOrchestrator # Orquestra disponibilidade + notificações
│   └── util/
│       └── UpdateHelper           # Utilitário genérico para atualizações parciais
│
├── modules/                       # Módulos de negócio (CRUD + API)
│   ├── appointment/               # Agendamentos
│   │   ├── controller/            #   REST endpoints
│   │   ├── service/               #   IAppointmentService + implementação
│   │   ├── repository/            #   JPA Repository
│   │   ├── entity/                #   Entidade Appointment
│   │   ├── dto/                   #   Request, Response e Summary DTOs
│   │   ├── status/                #   Enum: PENDING, CONFIRMED, CANCELLED, COMPLETED
│   │   └── exception/             #   ResourceNotFoundException
│   │
│   ├── professional/              # Profissionais (barbeiro, médico, etc.)
│   │   ├── controller/
│   │   ├── service/               #   IProfessionalService + implementação
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── status/                #   Enum: ACTIVE, INACTIVE, ON_VACATION, SUSPENDED
│   │
│   └── services/                  # Serviços oferecidos (corte, barba, consulta)
│       ├── controller/
│       ├── service/               #   IBusinessServiceService + implementação
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── category/              #   Enum: HAIR, BEARD, COMBO, GROOMING, BATH, CONSULTATION, OTHER
│       └── status/                #   Enum: ACTIVE, INACTIVE
│
├── infrastructure/                # Integrações com sistemas externos
│   ├── email/
│   │   └── EmailService           # Envio de e-mails via Spring Mail / SMTP
│   └── whatsapp/
│       └── WhatsAppService        # Placeholder para integração futura
│
├── security/                      # Autenticação e autorização
│   ├── auth/
│   │   ├── AuthController         # Placeholder
│   │   └── AuthService            # Placeholder
│   ├── config/
│   │   └── SecurityConfig         # Configuração Spring Security (stateless, JWT-ready)
│   └── jwt/
│       ├── JwtTokenProvider       # Placeholder
│       └── JwtAuthenticationFilter# Placeholder
│
└── config/                        # Configurações gerais
    ├── AppConfig
    └── ModelMapperConfig          # Bean do ModelMapper para mapeamento DTO ↔ Entity
```

---

## API Endpoints

### Agendamentos (`/api/appointments`)

| Método | Rota                              | Descrição                                     |
|--------|-----------------------------------|-----------------------------------------------|
| POST   | `/api/appointments`               | Criar agendamento                             |
| GET    | `/api/appointments/{id}`          | Buscar agendamento por ID                     |
| GET    | `/api/appointments/availability`  | Consultar slots disponíveis (date, serviceId, professionalId) |
| GET    | `/api/appointments/scheduled`     | Buscar agendamentos por intervalo de datas    |
| PUT    | `/api/appointments/{id}`          | Atualizar agendamento                         |
| DELETE | `/api/appointments`               | Deletar agendamento                           |

### Profissionais (`/api/professionals`)

| Método | Rota                        | Descrição                     |
|--------|-----------------------------|-------------------------------|
| POST   | `/api/professionals`        | Cadastrar profissional        |
| GET    | `/api/professionals/{id}`   | Buscar profissional por ID    |
| PUT    | `/api/professionals/{id}`   | Atualizar profissional        |
| DELETE | `/api/professionals/{id}`   | Remover profissional          |

### Serviços (`/api/services`)

| Método | Rota                   | Descrição                |
|--------|------------------------|--------------------------|
| POST   | `/api/services`        | Cadastrar serviço        |
| GET    | `/api/services/{id}`   | Buscar serviço por ID    |
| PUT    | `/api/services/{id}`   | Atualizar serviço        |
| DELETE | `/api/services/{id}`   | Remover serviço          |

---

## Modelo de Dados

```
┌──────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│   professionals   │       │ professional_services│       │     services      │
├──────────────────┤       ├─────────────────────┤       ├──────────────────┤
│ id          (PK) │◄──────│ professional_id (FK) │       │ id          (PK) │
│ name             │       │ service_id      (FK) │──────►│ name             │
│ email            │       └─────────────────────┘       │ description      │
│ status           │                                      │ category         │
│ start_time       │                                      │ duration_minutes │
│ end_time         │       ┌─────────────────────┐       │ cleanup_minutes  │
│ created_at       │       │    appointments      │       │ price            │
│ updated_at       │       ├─────────────────────┤       │ status           │
└──────────────────┘       │ id            (PK)  │       │ created_at       │
         ▲                 │ guest_name          │       │ updated_at       │
         │                 │ guest_email         │       └──────────────────┘
         │                 │ guest_phone         │                ▲
         └─────────────────│ professional_id (FK)│                │
                           │ service_id     (FK) │────────────────┘
                           │ scheduled_at        │
                           │ status              │
                           │ access_token        │
                           │ created_at          │
                           │ updated_at          │
                           └─────────────────────┘
```

---

## Como Executar

### Pre-requisitos

- Java 17+
- PostgreSQL rodando na porta `5433`
- Banco de dados `appointment` criado

### Setup

1. Clone o repositório:
   ```bash
   git clone https://github.com/LeonardoAFer/DynamicAppointment.git
   cd DynamicAppointment
   ```

2. Configure o banco em `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5433/appointment
   spring.datasource.username=postgres
   spring.datasource.password=SUA_SENHA
   ```

3. Execute a aplicação:
   ```bash
   ./mvnw spring-boot:run
   ```

4. A API estará disponível em `http://localhost:8080/api`

### Diagramas C4

Os diagramas PlantUML estão em `src/main/resources/C4 Model/` e podem ser renderizados com qualquer visualizador PlantUML compatível.

---

## Roadmap

- [ ] Implementar autenticação JWT completa
- [ ] Integração WhatsApp (Twilio ou similar)
- [ ] Frontend React (calendário, seleção de serviços, fluxo de agendamento)
- [ ] Validação de DTOs com Bean Validation
- [ ] Testes unitários e de integração
