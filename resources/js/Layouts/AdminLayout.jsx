import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  FiHome, FiLayout, FiSliders, FiCompass, FiImage, 
  FiMessageSquare, FiMail, FiSettings, FiLogOut, FiMenu, FiX, FiCheckCircle, FiExternalLink 
} from 'react-icons/fi';

export default function AdminLayout({ children, title, actions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { flash, auth } = usePage().props;

  const navigation = [
    { name: 'Dashboard', href: route('admin.dashboard'), icon: FiHome },
    { name: 'Home Content', href: route('admin.pages.home'), icon: FiLayout },
    { name: 'Appearance & Theme', href: route('admin.appearance'), icon: FiSliders },
    { name: 'Hiking Packages', href: route('admin.packages.index'), icon: FiCompass },
    { name: 'Booking Inquiries', href: route('admin.inquiries.index'), icon: FiMail },
    { name: 'General Settings', href: route('admin.settings.index'), icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-[#14251F] text-[#F1EBDD] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0E1A16] border-r border-[#242820]">
        <div className="h-16 flex items-center px-6 border-b border-[#242820]">
          <span className="text-[#D7B77A] font-bold tracking-widest text-lg font-serif">SUMMIT SOUL</span>
          <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded bg-[#14251F] text-[#D7B77A] border border-[#D7B77A]/30">CMS</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#14251F] hover:text-[#D7B77A]"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#242820]">
          <div className="text-xs text-gray-400 mb-2">Signed in as {auth?.user?.name || 'Admin'}</div>
          <Link
            href={route('admin.logout')}
            method="post"
            as="button"
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full"
          >
            <FiLogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#14251F] border-b border-[#242820] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold text-[#F1EBDD] font-serif">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={route('admin.preview')} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#242820] text-[#D7B77A] hover:bg-[#2c3227] transition border border-[#D7B77A]/20"
            >
              <FiExternalLink className="w-3.5 h-3.5" /> Preview Draft
            </a>
            {actions}
          </div>
        </header>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded flex items-center gap-2 text-sm">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}