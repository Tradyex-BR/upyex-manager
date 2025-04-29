# Upyex Manager

Sistema de gerenciamento para a Upyex.

## 🚀 Tecnologias

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- Zod

## 📋 Pré-requisitos

- Node.js 18+
- npm 9+

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/upyex-manager.git
cd upyex-manager
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes Vue
│   ├── common/     # Componentes reutilizáveis
│   ├── layout/     # Componentes de layout
│   ├── forms/      # Componentes de formulário
│   └── features/   # Componentes específicos
├── composables/    # Hooks personalizados
├── config/         # Configurações
├── router/         # Rotas
├── services/       # Serviços de API
├── stores/         # Stores Pinia
├── types/          # Tipos TypeScript
├── utils/          # Funções utilitárias
├── validators/     # Schemas de validação
├── styles/         # Estilos globais
└── views/          # Páginas
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código
- `npm run test` - Executa os testes

## Outras informações

- O projeto utiliza Pinia para gerenciamento de estado.
- O controle de autenticação está em `src/stores/auth.ts`.
- As rotas protegidas e regras de acesso estão em `src/router/index.ts`.
- Para rodar em produção, configure corretamente as variáveis de ambiente.

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NomeDaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/NomeDaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
