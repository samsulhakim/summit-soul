import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiCompass } from 'react-icons/fi';

export default function PackageIndex({ packages, filters }) {
  const handleDelete = (id, title) => {
    if (confirm(`Hapus paket "${title}"? Data gambar terkait akan dibersihkan.`)) {
      router.delete(route('admin.packages.destroy', id));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const search = e.target.elements.search.value;
    router.get(route('admin.packages.index'), { search }, { preserveState: true });
  };

  return (
    <AdminLayout
      title="Hiking Packages"
      actions={
        <Link
          href={route('admin.packages.create')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold rounded uppercase tracking-wider transition"
        >
          <FiPlus className="w-4 h-4" /> Add Package
        </Link>
      }
    >
      <Head title="Hiking Packages — SUMMIT SOUL" />

      {/* Filter & Search Bar */}
      <div className="bg-[#0E1A16] border border-[#242820] p-4 rounded-lg mb-6 flex justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm flex items-center gap-2">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-3 text-stone-500 w-4 h-4" />
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Cari destinasi atau judul paket..."
              className="w-full bg-[#14251F] border border-[#242820] rounded pl-9 pr-3 py-2 text-xs text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-[#242820] text-[#D7B77A] text-xs font-semibold rounded">
            Search
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg overflow-hidden">
        {packages.data.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            <FiCompass className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Belum ada paket hiking yang tersedia.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-[#14251F]/60 text-stone-400 border-b border-[#242820]">
              <tr>
                <th className="py-3 px-4">Package Title</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242820]">
              {packages.data.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-[#14251F]/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-serif font-semibold text-[#F1EBDD]">{pkg.title}</div>
                    <span className="text-xs text-stone-400 font-mono">/{pkg.slug}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-300">{pkg.destination}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#242820] border border-[#242820] text-stone-300">
                      {pkg.difficulty_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#D7B77A]">
                    {pkg.currency} {Number(pkg.price).toLocaleString()}
                    <span className="block text-[10px] text-stone-400">/{pkg.price_unit.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs uppercase font-semibold px-2 py-0.5 rounded ${
                        pkg.status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={route('admin.packages.edit', pkg.id)}
                      className="inline-flex p-1.5 text-stone-300 hover:text-[#D7B77A] bg-[#14251F] rounded border border-[#242820]"
                    >
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.title)}
                      className="inline-flex p-1.5 text-red-400 hover:text-red-300 bg-[#14251F] rounded border border-[#242820]"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}