# Sistema de Autenticação e Autorização - AGRESE

## Visão Geral

Este sistema implementa uma solução completa de autenticação e autorização baseada no schema Prisma definido, com dados mocados para demonstração. O sistema inclui diferentes níveis de acesso baseados em roles e hierarquia de setores.

## Estrutura de Usuários e Permissões

### Roles Disponíveis

1. **ADMIN** (Presidência e Gabinete)

   - Acesso total ao sistema
   - Pode gerenciar todos os usuários, setores e eventos
   - Acesso a todas as funcionalidades

2. **MANAGER** (DAF e Diretor Técnico)

   - Acesso aos setores subordinados e próprio setor
   - Pode visualizar e gerenciar usuários dos setores acessíveis
   - Pode criar/editar usuários para seus setores
   - Pode visualizar e editar informações dos setores sob sua responsabilidade
   - Pode gerenciar eventos dos setores acessíveis
   - Funcionalidades limitadas por hierarquia setorial

3. **COLLABORATOR** (Demais setores)

   - Acesso apenas ao próprio setor
   - Pode criar e gerenciar eventos do seu setor
   - Permissões básicas

4. **IT_ADMIN** (T.I.)
   - Acesso especial para gerenciamento de usuários
   - Pode resetar senhas e gerenciar configurações do sistema
   - Não tem acesso a dados operacionais sensíveis

### Usuários de Teste

Todos os usuários de teste usam a senha: **123456**

| Email                      | Role         | Setor             | Descrição                         |
| -------------------------- | ------------ | ----------------- | --------------------------------- |
| admin@agrese.com           | ADMIN        | Presidência       | Administrador com acesso total    |
| daf@agrese.com             | MANAGER      | DAF               | Diretor Administrativo Financeiro |
| diretor.tecnico@agrese.com | MANAGER      | Diretoria Técnica | Diretor Técnico                   |
| colaborador@agrese.com     | COLLABORATOR | Setor Operacional | Colaborador padrão                |
| ti@agrese.com              | IT_ADMIN     | T.I.              | Administrador de TI               |

## Como Usar

### 1. Login

- Acesse a página de login
- Use um dos emails de teste listados acima
- Digite a senha: **123456**
- O sistema redirecionará para o dashboard

### 2. Navegação

- **Dashboard**: Página principal com calendário
- **Setores**: Gerenciamento de setores (apenas ADMIN/MANAGER)
- **Usuários**: Gerenciamento de usuários (apenas ADMIN/IT_ADMIN)
- **Notificações**: Sistema de notificações
- **Teste de Permissões**: Página especial para visualizar permissões (/permissions-test)

### 3. Funcionalidades por Role

#### ADMIN

- ✅ Criar/editar/deletar usuários
- ✅ Criar/editar/deletar setores
- ✅ Ver todos os eventos
- ✅ Gerenciar sistema
- ✅ Acesso a todos os setores

#### MANAGER

- ✅ Visualizar página de Setores
- ✅ Visualizar página de Usuários
- ✅ Criar/editar/deletar usuários (setores acessíveis)
- ✅ Visualizar e editar próprio setor
- ✅ Visualizar e gerenciar setores subordinados
- ✅ Ver eventos dos setores acessíveis
- ✅ Criar eventos nos setores acessíveis
- ❌ Acesso limitado por hierarquia setorial

#### COLLABORATOR

- ✅ Criar eventos no próprio setor
- ✅ Ver eventos do próprio setor
- ✅ Editar próprio perfil
- ❌ Gerenciar outros usuários
- ❌ Acesso a outros setores

#### IT_ADMIN

- ✅ Criar/editar usuários
- ✅ Resetar senhas
- ✅ Ver logs do sistema
- ✅ Gerenciar configurações
- ❌ Acesso limitado a dados operacionais

## Estrutura Técnica

### Contextos

- **AuthContext**: Gerencia estado de autenticação e autorização
- **ThemeContext**: Gerencia tema da aplicação

### Hooks

- **useAuth**: Hook para acessar contexto de autenticação
- **usePermissions**: Hook com funções específicas de permissão

### Componentes

- **ProtectedRoute**: Componente para proteção de rotas
- **UserHeader**: Header com informações do usuário
- **PermissionsDemo**: Componente para visualizar permissões

### Utilitários

- **localStorage.ts**: Funções para gerenciar dados no localStorage

## Armazenamento Local

O sistema salva automaticamente no localStorage:

- Dados do usuário autenticado
- Preferências do usuário
- Cache de dados (com TTL)
- Informações da sessão

### Estrutura no localStorage

```javascript
{
  "authUser": {
    "id": 1,
    "email": "admin@agrese.com",
    "name": "Administrador Sistema",
    "role": "ADMIN",
    "sectorId": 1,
    "sectorName": "Presidência",
    "isActive": true,
    "lastLogin": "2025-01-31T..."
  }
}
```

## Hierarquia de Setores

```
Presidência (ID: 1)
├── DAF - Diretoria Administrativa Financeira (ID: 2)
│   └── Setor Operacional (ID: 4)
├── Diretoria Técnica (ID: 3)
└── Tecnologia da Informação (ID: 5)
```

### Regras de Acesso por Setor

- **ADMIN**: Acesso a todos os setores
- **MANAGER (DAF)**: Acesso ao DAF e Setor Operacional
- **MANAGER (Técnico)**: Acesso apenas à Diretoria Técnica
- **COLLABORATOR**: Acesso apenas ao próprio setor
- **IT_ADMIN**: Acesso a todos os setores para funções técnicas

## Teste das Funcionalidades

### Página de Teste de Permissões

Acesse `/permissions-test` após fazer login para ver:

- Informações detalhadas do usuário
- Lista de todas as permissões com status
- Teste de acesso a cada setor
- Visualização do nível de acesso

### Testando Diferentes Roles

1. Faça login com diferentes usuários
2. Observe as diferenças na navegação disponível
3. Tente acessar rotas protegidas
4. Verifique as mensagens de acesso negado

## Segurança

### Validações Implementadas

- Verificação de autenticação em todas as rotas protegidas
- Validação de permissões por funcionalidade
- Verificação de acesso por setor
- Status do usuário (ativo/inativo)

### Tratamento de Erros

- Redirecionamento automático para login se não autenticado
- Mensagens de erro claras para acesso negado
- Tratamento de erros na autenticação

## Próximos Passos

Para implementação em produção:

1. Substituir dados mocados por API real
2. Implementar hash de senhas
3. Adicionar refresh tokens
4. Implementar logs de auditoria
5. Adicionar 2FA (autenticação de dois fatores)
6. Implementar rate limiting
7. Adicionar validação de sessão no servidor
