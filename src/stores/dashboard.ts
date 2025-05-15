import { defineStore } from 'pinia'
import { managerService } from '@/services/managerService'
import { logger } from '@/config/logger'
import { notificationService } from '@/services/notificationService'

interface Affiliate {
  id: number;
  name: string;
  ref: string;
  date: string;
  status: string;
}

interface Offer {
  id: number;
  date: string;
  client: string;
  token: string;
  status: string;
  paymentMethod: string;
  volume: string;
  valueBRL: string;
}

interface Withdrawal {
  id: number;
  date: string;
  valueBRL: string;
  destination: string;
  type: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastAccess: string;
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    affiliates: [] as Affiliate[],
    offers: [] as Offer[],
    withdrawals: [] as Withdrawal[],
    users: [] as User[],
  }),

  actions: {
    // Load mock data
    loadMockData() {
      this.loadAffiliates()
      this.loadOffers()
      this.loadWithdrawals()
      this.loadUsers()
    },

    // Affiliates
    loadAffiliates() {
      this.affiliates = [
        {
          id: 1,
          name: 'David Jahnsen',
          ref: 'ref_david',
          date: '03/10/2025',
          status: 'Approved'
        }
      ]
    },

    // Offers
    async loadOffers() {
      try {
        const params = { page: 1, per_page: 20 };
        const response = await managerService.sales.list(params);
        // Map API sales to Offer interface
        this.offers = response.data.map((sale: any) => {
          const product = (sale.products && sale.products.length > 0) ? sale.products[0] : null;
          return {
            id: sale.id,
            date: sale.created_at ? new Date(sale.created_at).toLocaleString('pt-BR') : '',
            client: sale.customer?.name || '',
            token: product ? product.name : '',
            status: sale.status || '',
            paymentMethod: sale.payment_method || '',
            volume: product ? product.amount : '',
            valueBRL: product ? (Number(product.price) * Number(product.amount)).toFixed(2) : '',
          };
        });
      } catch (error) {
        logger.error('Failed to load offers:', error);
        notificationService.error('Erro ao carregar ofertas');
        this.offers = [];
      }
    },

    // Withdrawals
    loadWithdrawals() {
      this.withdrawals = [
        {
          id: 1,
          date: 'March 1, 2025',
          valueBRL: '$ 5.90',
          destination: '053********35',
          type: 'CPF',
          status: 'Completed'
        },
        {
          id: 2,
          date: 'March 1, 2025',
          valueBRL: '$ 5.90',
          destination: 'motti***@gmail.com',
          type: 'Email',
          status: 'Pending'
        },
        {
          id: 3,
          date: 'March 1, 2025',
          valueBRL: '$ 5.90',
          destination: 'motti***@gmail.com',
          type: 'Email',
          status: 'Rejected'
        }
      ]
    },

    // Users
    loadUsers() {
      this.users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 3,
          name: 'Bob Smith',
          email: 'email@email.com',
          status: 'Blocked',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        }
      ]
    },

    // Actions for Affiliates
    async approveAffiliate(id: string) {
      try {
        logger.info('Approve affiliate:', id)
        await managerService.affiliates.approve(id)
        notificationService.success('Afiliado aprovado com sucesso')
      } catch (error) {
        logger.error('Erro ao aprovar afiliado:', error)
        notificationService.error('Erro ao aprovar afiliado')
      }
    },

    async blockAffiliate(id: string) {
      try {
        logger.info('Block affiliate:', id)
        await managerService.affiliates.block(id)
        notificationService.success('Afiliado bloqueado com sucesso')
      } catch (error) {
        logger.error('Erro ao bloquear afiliado:', error)
        notificationService.error('Erro ao bloquear afiliado')
      }
    },

    async deleteAffiliate(id: string) {
      try {
        logger.info('Delete affiliate:', id)
        await managerService.affiliates.delete(id)
        notificationService.success('Afiliado excluído com sucesso')
      } catch (error) {
        logger.error('Erro ao excluir afiliado:', error)
        notificationService.error('Erro ao excluir afiliado')
      }
    },

    // Actions for Offers
    async approveOffer(id: string) {
      try {
        logger.info('Approve offer:', id)
        await managerService.applications.approve(id)
        notificationService.success('Oferta aprovada com sucesso')
      } catch (error) {
        logger.error('Erro ao aprovar oferta:', error)
        notificationService.error('Erro ao aprovar oferta')
      }
    },

    async blockOffer(id: string) {
      try {
        logger.info('Block offer:', id)
        await managerService.applications.block(id)
        notificationService.success('Oferta bloqueada com sucesso')
      } catch (error) {
        logger.error('Erro ao bloquear oferta:', error)
        notificationService.error('Erro ao bloquear oferta')
      }
    },

    async deleteOffer(id: string) {
      try {
        logger.info('Delete offer:', id)
        await managerService.applications.delete(id)
        notificationService.success('Oferta excluída com sucesso')
      } catch (error) {
        logger.error('Erro ao excluir oferta:', error)
        notificationService.error('Erro ao excluir oferta')
      }
    },

    // Actions for Withdrawals
    async approveWithdrawal(id: string) {
      try {
        logger.info('Approve withdrawal:', id)
        await managerService.withdrawals.approve(id)
        notificationService.success('Saque aprovado com sucesso')
      } catch (error) {
        logger.error('Erro ao aprovar saque:', error)
        notificationService.error('Erro ao aprovar saque')
      }
    },

    async blockWithdrawal(id: string) {
      try {
        logger.info('Block withdrawal:', id)
        await managerService.withdrawals.reject(id)
        notificationService.success('Saque bloqueado com sucesso')
      } catch (error) {
        logger.error('Erro ao bloquear saque:', error)
        notificationService.error('Erro ao bloquear saque')
      }
    },

    async deleteWithdrawal(id: string) {
      try {
        logger.info('Delete withdrawal:', id)
        await managerService.withdrawals.delete(id)
        notificationService.success('Saque excluído com sucesso')
      } catch (error) {
        logger.error('Erro ao excluir saque:', error)
        notificationService.error('Erro ao excluir saque')
      }
    },

    // Actions for Users
    async blockUser(id: string) {
      try {
        logger.info('Block user:', id)
        await managerService.customers.block(id)
        notificationService.success('Usuário bloqueado com sucesso')
      } catch (error) {
        logger.error('Erro ao bloquear usuário:', error)
        notificationService.error('Erro ao bloquear usuário')
      }
    },

    async editUserPermission(id: string) {
      try {
        logger.info('Edit user permission:', id)
        // Implementar lógica de edição de permissão
        notificationService.success('Permissão do usuário atualizada com sucesso')
      } catch (error) {
        logger.error('Erro ao editar permissão do usuário:', error)
        notificationService.error('Erro ao editar permissão do usuário')
      }
    },

    async resetUserPassword(id: string) {
      try {
        logger.info('Reset user password:', id)
        await managerService.customers.resetPassword(id)
        notificationService.success('Senha do usuário resetada com sucesso')
      } catch (error) {
        logger.error('Erro ao resetar senha do usuário:', error)
        notificationService.error('Erro ao resetar senha do usuário')
      }
    },

    async deleteUser(id: string) {
      try {
        logger.info('Delete user:', id)
        await managerService.customers.delete(id)
        notificationService.success('Usuário excluído com sucesso')
      } catch (error) {
        logger.error('Erro ao excluir usuário:', error)
        notificationService.error('Erro ao excluir usuário')
      }
    }
  }
})