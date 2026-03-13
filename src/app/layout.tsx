"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutDashboard } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './globals.css';
import Providers from './Provider';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#0b1120] text-slate-100 flex h-screen overflow-hidden`}>
        <Providers>
            {/* ── SIDEBAR ── */}
            <aside className="w-64 border-r border-[#1f2937] bg-[#111827] flex flex-col p-6 hidden md:flex">
                <div className="flex flex-col gap-4 mb-10 px-2">
                    {/* Logo Container: Increased to w-16 h-16 for better visibility */}
                    <div className="relative w-16 h-16 shrink-0">
                        <Image
                            src="/images/ElroiLogo.png"
                            alt="El-Roi Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>

                    {/* Brand Text: Increased font size to text-xl to match larger logo */}
                    <span className="text-xl font-bold tracking-tight text-white leading-tight">
                                El-Roi Plan<span className="text-[#10b981]">.ai</span>
                            </span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/">
                        <SidebarItem
                            icon={<LayoutDashboard size={18} />}
                            label="Dashboard"
                            active={pathname === "/"}
                        />
                    </Link>
                </nav>

                <div className="pt-6 border-t border-[#1f2937]">
                    <p className="text-[10px] font-bold text-slate-500 uppercase px-3 tracking-widest">Workspace</p>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 overflow-y-auto bg-[#0b1120]">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </Providers>
        </body>
        </html>
    );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
            active
                ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-transparent'
        }`}>
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}