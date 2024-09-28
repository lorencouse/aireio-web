import { useRouter, usePathname } from 'next/navigation';
import { ReadonlyURLSearchParams } from 'next/navigation';

const useUpdateUrlQuery = () => {
  const router = useRouter();
  const pathname = usePathname();

  const updateUrlQuery = (
    name: string,
    value: string,
    searchParams: ReadonlyURLSearchParams
  ): void => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set(name, value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const updateUrlQueries = (
    updates: { name: string; value: string }[],
    searchParams: ReadonlyURLSearchParams
  ): void => {
    const params = new URLSearchParams(searchParams.toString());
    updates.forEach(({ name, value }) => {
      params.set(name, value);
    });
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  return { updateUrlQuery, updateUrlQueries };
};

export default useUpdateUrlQuery;
