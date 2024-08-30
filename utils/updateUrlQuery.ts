const updateUrlQuery = (
  name: string,
  value: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string => {
  const params = new URLSearchParams(searchParams as Record<string, string>);
  params.set(name, value);
  return params.toString();
};

export default updateUrlQuery;
