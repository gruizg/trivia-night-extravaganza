"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function NavLink({href, children}) {

    const pathname = usePathname();
    const isActive = pathname===href

return (
        <Link href={href} aria-current={isActive ? 'page' : undefined} className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
            {children}
        </Link>
    );
}