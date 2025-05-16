export const getImageUrl = (name: string, logoUrl?: string | null): string => {
  if (logoUrl) {
    return logoUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
};

export const handleImageError = (event: Event, name: string): void => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}; 