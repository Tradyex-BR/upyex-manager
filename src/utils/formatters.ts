/**
 * Formata um ID de carteira para exibição
 * @param id ID da carteira
 * @returns ID formatado
 */
export const formatWalletId = (id: string | undefined): string => {
  if (!id) return '-';
  if (id.length <= 8) return id;
  return `${id.slice(0, 4)}...${id.slice(-6)}`;
}

/**
 * Formata um ID de transação para exibição
 * @param id ID da transação
 * @returns ID formatado
 */
export const formatTransactionId = (id: string): string => {
  if (!id) return '-';
  if (id.length <= 8) return id;
  return `${id.slice(0, 8)}...`;
}

/**
 * Formata um link para exibição
 * @param link Link completo
 * @returns Link formatado
 */
export const formatLink = (link: string): string => {
  if (!link) return '-';
  const url = new URL(link);
  const pathParts = url.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  return `@${url.hostname}.../${lastPart}`;
} 