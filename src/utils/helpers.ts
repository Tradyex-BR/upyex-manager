// Formatação de data
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('pt-BR')
}

// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Tratamento de erros da API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
} 