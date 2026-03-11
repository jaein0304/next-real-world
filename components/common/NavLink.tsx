import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { UrlObject } from 'url';

interface NavLinkProps {
  href: string | UrlObject;
  children: React.ReactNode;
  className?: string;
  hoverClass?: string;
  activeClass?: string;
}

export default function NavLink({ href, className, hoverClass, activeClass, children }: NavLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const asPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
  const active = decodeURIComponent(asPath) === decodeURIComponent(href as string);
  const ariaCurrent = active ? 'page' : undefined;
  return (
    <Link
      href={href}
      className={`${className} ${hoverClass} ${active ? activeClass : ''}`}
      aria-current={ariaCurrent}>

      {children}

    </Link>
  );
}
