export const getParamValue = (
  key: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string => {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value || '';
};
