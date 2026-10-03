# AIDA Hub

**Cockpit de Gamificação dos Alunos AIDA** — painel de progresso de inglês com gamificação completa.

## Arquitetura

```
[Aluno] → [AIDA Hub] → [AIDA Chat (LibreChat)]
              ↕
        /api/mana/* + /api/user
        (my-aida-agents-hub)
```

O Hub é o **gateway obrigatório** antes do chat. O aluno vê seu progresso, rank, XP, MANA e 5 Portais de Imersão — e a partir daí entra no chat com a persona escolhida.

## Stack

- **React 18** + **Vite** + **TypeScript**
- **shadcn/ui** + **Tailwind CSS**
- **Recharts** (radar chart de habilidades)
- **react-router-dom** v6
- **@tanstack/react-query**

## Rodar localmente

```bash
cp .env.example .env
# Editar .env com as URLs corretas

npm install
npm run dev
# → http://localhost:5173
```

> Para desenvolvimento com o LibreChat local: setar `VITE_AIDA_API_URL=http://localhost:3080`

## Deploy (Railway)

1. Criar novo serviço Railway a partir deste repo
2. Build Command: `npm run build`
3. Start Command: `npx serve dist`
4. Envs: `VITE_AIDA_CHAT_URL`, `VITE_AIDA_API_URL`

## Seções do Hub

| Seção | Descrição |
|---|---|
| 🌀 Portais | 5 portais de imersão (personas AIDA) com FREE/PRO gating |
| ⚡ Dashboard | XP, MANA bar, Streak, Rank e roadmap de evolução |
| 📋 Ficha | CharSheet com radar chart de habilidades e habilidades passivas |
| 🏆 Ranking | Leaderboard global dos alunos |
| 🎯 Quests | Quests diárias de prática |
| 🎖️ Battle Pass | Trilha de recompensas do Season |

## Integração com AIDA Chat

O Hub consome estas rotas do LibreChat (`my-aida-agents-hub`):

- `GET /api/user` — usuário logado (via cookie de sessão)
- `GET /api/mana/profile/:userId` — perfil MANA
- `GET /api/mana/leaderboard` — ranking
- `POST /api/mana/triage` — resultado do diagnóstico
- `POST /api/mana/upgrade` — upgrade FREE→PRO (admin)

## Forked from

GABLAB OS `pgt-ui` — Personal Life OS gamificado do Gabriel Ferreira.
Adaptado para o contexto AIDA com data layer completamente substituído (Supabase → MongoDB via AIDA API).
