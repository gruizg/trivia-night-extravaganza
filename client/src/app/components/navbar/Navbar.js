"use client"

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import NavLink from "@/app/components/navbar/NavLink";
import { FaBars, FaXmark } from 'react-icons/fa6';
import {useState} from "react";
export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    function handleNav() {
        setMenuOpen(!menuOpen);
    }
return (
        <nav className={"fixed w-full h-24 shadow-xl bg-white"}>
            <div className={"flex justify-between items-center h-full w-full px-4 2xl:px-16"}>
                <Link href={"/"}>
                    <Image src={"/logo.png"} alt={"Logo"} width={205} height={75} className={"cursor-pointer"} priority/>
                </Link>
                <div className={"hidden sm:flex"}>
                    <ul className={"hidden sm:flex"}>
                        <NavLink href={"/about"}>About Us</NavLink>
                        <NavLink href={"/rules"}>Rules</NavLink>
                        <NavLink href={"/play"}>Play Now!</NavLink>
                        <NavLink href={"/contact"}>Contact Us</NavLink>
                    </ul>
                </div>
                <div onClick={handleNav} className={"md:hidden cursor-pointer pl-24"}>
                    <FaBars size={25} />
                </div>
            </div>
            <div className={menuOpen ?
                "fixed left-0 top-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
                :
                "fixed left-[-100%] top-0 p-10 ease-in duration-500"}>

            </div>

        </nav>
    )
}