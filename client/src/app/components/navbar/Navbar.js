"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    function handleNav() {
        setMenuOpen(!menuOpen);
    }

    const navItems = [
        { label: "About Us", href: "/about" },
        { label: "Rules", href: "/rules" },
        { label: "Play Now!", href: "/play" },
        { label: "Contact Us", href: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full h-24 shadow-md bg-gray-100 border-b border-gray-300 z-50">
            <div className="flex justify-between items-center h-full w-full px-6 2xl:px-16">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={205}
                        height={75}
                        className="cursor-pointer object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Navigation - Hidden on screens smaller than `lg` (1024px) */}
                <div className="hidden lg:flex">
                    <ul className="flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-lg font-bold uppercase tracking-wide transition-all ${
                                            isActive
                                                ? "bg-[#ff1493] text-white shadow-sm"
                                                : "text-gray-900 hover:text-[#ff1493] hover:bg-gray-200"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Mobile/Tablet Hamburger Button - Visible on screens below `lg` */}
                <button
                    type="button"
                    onClick={handleNav}
                    className="lg:hidden cursor-pointer p-2 rounded-lg text-gray-900 hover:bg-gray-200"
                    aria-label="Toggle Navigation Menu"
                    aria-expanded={menuOpen}
                >
                    <FaBars size={25} />
                </button>
            </div>

            {/* Mobile/Tablet Drawer Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={handleNav}
                />
            )}

            {/* Mobile/Tablet Navigation Drawer */}
            <div
                className={`fixed left-0 top-0 w-[75%] sm:w-[50%] lg:hidden h-screen bg-gray-100 p-8 z-50 border-r border-gray-300 transition-all duration-300 ease-in-out ${
                    menuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center pb-6 border-b border-gray-300">
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={140}
                            height={50}
                            className="object-contain"
                        />
                    </Link>
                    <button
                        onClick={handleNav}
                        className="p-2 text-gray-900 hover:bg-gray-200 rounded-lg"
                    >
                        <FaXmark size={25} />
                    </button>
                </div>

                {/* Mobile Nav Links */}
                <ul className="flex flex-col gap-3 mt-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block w-full px-4 py-3 rounded-lg text-lg font-bold uppercase transition-all ${
                                        isActive
                                            ? "bg-[#ff1493] text-white"
                                            : "text-gray-900 hover:bg-gray-200"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}