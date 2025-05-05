# Upyex Manager

Sistema de gerenciamento para a Upyex.

## 🚀 Tecnologias

- Vue 3 - Framework JavaScript progressivo
- TypeScript - Superset JavaScript com tipagem estática
- Vite - Build tool e servidor de desenvolvimento
- Tailwind CSS - Framework CSS utilitário
- Pinia - Gerenciamento de estado
- Vue Router - Roteamento oficial do Vue
- Axios - Cliente HTTP
- Zod - Validação de esquemas TypeScript

## 📋 Pré-requisitos

- Node.js 18+ (recomendado: LTS)
- npm 9+ ou yarn 1.22+
- Git

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/upyex-manager.git
cd upyex-manager
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

## 📁 Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos (imagens, fontes, etc)
├── components/     # Componentes Vue
│   ├── common/     # Componentes reutilizáveis (botões, inputs, etc)
│   ├── layout/     # Componentes de layout (header, footer, sidebar)
│   ├── forms/      # Componentes de formulário
│   └── features/   # Componentes específicos de features
├── composables/    # Hooks personalizados do Vue
├── config/         # Configurações do projeto
├── router/         # Configuração de rotas
├── services/       # Serviços de API e integrações
├── stores/         # Stores Pinia para gerenciamento de estado
├── types/          # Definições de tipos TypeScript
├── utils/          # Funções utilitárias
├── validators/     # Schemas de validação Zod
├── styles/         # Estilos globais e configurações Tailwind
└── views/          # Páginas/componentes de rota
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Executa o linter (ESLint)
- `npm run format` - Formata o código (Prettier)
- `npm run test` - Executa os testes
- `npm run test:coverage` - Executa os testes com relatório de cobertura

## 🔐 Autenticação e Segurança

- O sistema utiliza JWT para autenticação
- O controle de autenticação está em `src/stores/auth.ts`
- As rotas protegidas e regras de acesso estão em `src/router/index.ts`
- Todas as requisições são interceptadas para adicionar o token de autenticação

## 🌐 Ambiente de Produção

Para rodar em produção:

1. Configure as variáveis de ambiente de produção
2. Execute o build:
```bash
npm run build
```
3. Os arquivos de produção serão gerados na pasta `dist`

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NomeDaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/NomeDaFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Testes
- `chore:` - Tarefas gerais

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@upyex.com ou abra uma issue no GitHub.
