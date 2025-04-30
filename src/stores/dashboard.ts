import { defineStore } from 'pinia'
import { managerService } from '@/services/managerService'

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
        console.error('Failed to load offers:', error);
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
    async approveAffiliate(id: number) {
      // Implement approval logic
      console.log('Approve affiliate:', id)
    },

    async blockAffiliate(id: number) {
      // Implement block logic
      console.log('Block affiliate:', id)
    },

    async deleteAffiliate(id: number) {
      // Implement delete logic
      console.log('Delete affiliate:', id)
    },

    // Actions for Offers
    async approveOffer(id: number) {
      // Implement approval logic
      console.log('Approve offer:', id)
    },

    async blockOffer(id: number) {
      // Implement block logic
      console.log('Block offer:', id)
    },

    async deleteOffer(id: number) {
      // Implement delete logic
      console.log('Delete offer:', id)
    },

    // Actions for Withdrawals
    async approveWithdrawal(id: number) {
      // Implement approval logic
      console.log('Approve withdrawal:', id)
    },

    async blockWithdrawal(id: number) {
      // Implement block logic
      console.log('Block withdrawal:', id)
    },

    async deleteWithdrawal(id: number) {
      // Implement delete logic
      console.log('Delete withdrawal:', id)
    },

    // Actions for Users
    async blockUser(id: number) {
      // Implement block logic
      console.log('Block user:', id)
    },

    async editUserPermission(id: number) {
      // Implement permission edit logic
      console.log('Edit user permission:', id)
    },

    async resetUserPassword(id: number) {
      // Implement password reset logic
      console.log('Reset user password:', id)
    },

    async deleteUser(id: number) {
      // Implement delete logic
      console.log('Delete user:', id)
    }
  }
})