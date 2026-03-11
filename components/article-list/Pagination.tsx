import { usePathname, useSearchParams } from 'next/navigation';
import { range } from 'ramda';
import CustomLink from '../common/CustomLink';

export function Pagination({
  currentPage,
  count,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  count: number;
  itemsPerPage: number;
  onPageChange?: (index: number) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const asPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
  return (
    <nav>
      <ul className='pagination'>
        {Math.ceil(count / itemsPerPage) > 1 &&
          range(1, Math.ceil(count / itemsPerPage) + 1).map((index) => (
            <li
              key={index}
              className={`page-item${currentPage !== index ? '' : ' active'}`}
              onClick={onPageChange && (() => onPageChange(index))}
            >
              <CustomLink aria-label={`Go to page number ${index}`} href={asPath} shallow>
                {index}
              </CustomLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
