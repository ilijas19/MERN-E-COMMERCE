export const formatDate = (isoString: string | Date): string => {
  return new Date(isoString).toLocaleDateString();
};
