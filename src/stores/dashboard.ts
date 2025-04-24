import { defineStore } from 'pinia'

interface Afiliado {
  id: number;
  nome: string;
  ref: string;
  data: string;
  status: string;
}

interface Oferta {
  id: number;
  data: string;
  cliente: string;
  token: string;
  status: string;
  metodoPagamento: string;
  volume: string;
  valorBRL: string;
}

interface Saque {
  id: number;
  data: string;
  valorBRL: string;
  destino: string;
  tipo: string;
  status: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  status: string;
  dataCadastro: string;
  ultimoAcesso: string;
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    afiliados: [] as Afiliado[],
    ofertas: [] as Oferta[],
    saques: [] as Saque[],
    usuarios: [] as Usuario[],
  }),

  actions: {
    // Carregar dados mockados
    carregarDadosMockados() {
      this.carregarAfiliados()
      this.carregarOfertas()
      this.carregarSaques()
      this.carregarUsuarios()
    },

    // Afiliados
    carregarAfiliados() {
      this.afiliados = [
        {
          id: 1,
          nome: 'David Jahnsen',
          ref: 'ref_david',
          data: '10/03/2025',
          status: 'Aprovado'
        }
      ]
    },

    // Ofertas
    carregarOfertas() {
      this.ofertas = [
        {
          id: 1,
          data: '01/03/2025',
          cliente: 'Alison Souza',
          token: 'Binance Coin',
          status: 'Pago',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 2,
          data: '01/03/2025',
          cliente: 'Juliana Gonçalves',
          token: 'Binance Coin',
          status: 'Pendente',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 3,
          data: '01/03/2025',
          cliente: 'Lucas Pereira',
          token: 'Binance Coin',
          status: 'Cancelado',
          metodoPagamento: 'Cartão Crédito',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        }
      ]
    },

    // Saques
    carregarSaques() {
      this.saques = [
        {
          id: 1,
          data: '01 de março de 2025',
          valorBRL: 'R$ 5.90',
          destino: '053********35',
          tipo: 'CPF',
          status: 'Concluído'
        },
        {
          id: 2,
          data: '01 de março de 2025',
          valorBRL: 'R$ 5.90',
          destino: 'motti***@gmail.com',
          tipo: 'Email',
          status: 'Pendente'
        },
        {
          id: 3,
          data: '01 de março de 2025',
          valorBRL: 'R$ 5.90',
          destino: 'motti***@gmail.com',
          tipo: 'Email',
          status: 'Recusado'
        }
      ]
    },

    // Usuários
    carregarUsuarios() {
      this.usuarios = [
        {
          id: 1,
          nome: 'João Silva',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 2,
          nome: 'Maria Souza',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 3,
          nome: 'Carlos Lima',
          email: 'email@email.com',
          status: 'Bloqueado',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        }
      ]
    },

    // Ações para Afiliados
    async aprovarAfiliado(id: number) {
      // Implementar lógica de aprovação
      console.log('Aprovar afiliado:', id)
    },

    async bloquearAfiliado(id: number) {
      // Implementar lógica de bloqueio
      console.log('Bloquear afiliado:', id)
    },

    async excluirAfiliado(id: number) {
      // Implementar lógica de exclusão
      console.log('Excluir afiliado:', id)
    },

    // Ações para Ofertas
    async aprovarOferta(id: number) {
      // Implementar lógica de aprovação
      console.log('Aprovar oferta:', id)
    },

    async bloquearOferta(id: number) {
      // Implementar lógica de bloqueio
      console.log('Bloquear oferta:', id)
    },

    async excluirOferta(id: number) {
      // Implementar lógica de exclusão
      console.log('Excluir oferta:', id)
    },

    // Ações para Saques
    async aprovarSaque(id: number) {
      // Implementar lógica de aprovação
      console.log('Aprovar saque:', id)
    },

    async bloquearSaque(id: number) {
      // Implementar lógica de bloqueio
      console.log('Bloquear saque:', id)
    },

    async excluirSaque(id: number) {
      // Implementar lógica de exclusão
      console.log('Excluir saque:', id)
    },

    // Ações para Usuários
    async bloquearUsuario(id: number) {
      // Implementar lógica de bloqueio
      console.log('Bloquear usuário:', id)
    },

    async editarPermissaoUsuario(id: number) {
      // Implementar lógica de edição de permissão
      console.log('Editar permissão do usuário:', id)
    },

    async resetarSenhaUsuario(id: number) {
      // Implementar lógica de reset de senha
      console.log('Resetar senha do usuário:', id)
    },

    async excluirUsuario(id: number) {
      // Implementar lógica de exclusão
      console.log('Excluir usuário:', id)
    }
  }
}) 