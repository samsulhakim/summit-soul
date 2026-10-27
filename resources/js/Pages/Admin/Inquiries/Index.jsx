import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiMail, FiSearch, FiEye, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi';

const statusBadgeClasses = {
  new: 'bg-sky-950 text-sky-400 border-sky-800',
  contacted: 'bg-amber-950 text-amber-400 border-amber-800',
  awaiting_confirmation: 'bg-purple-950 text-purple-400 border-purple-800',
  confirmed: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  completed: 'bg-stone-800 text-stone-300 border-stone-700',
  cancelled: 'bg-rose-950 text-rose-400 border-rose-800',
};

export default function InquiryIndex({ inquiries, filters, statuses }) {
  const handleFilter = (key, value) => {
    router.get(
      route('admin.inquiries.index'),
      { ...filters, [key]: value },
      { preserveState: true }
    );
  };

  return (
    <AdminLayout title="Booking Inquiries">
      <Head title="Booking Inquiries — SUMMIT SOUL" />

      {/* Filter and Status Filter Bar */}
      <div className="bg-[#0E1A16] border border-[#242820] p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-3 text-stone-500 w-4 h-4" />
          <input
            type="text"
            defaultValue={filters.search}
            placeholder="Search customer, email, or phone..."
            onKeyDown={(e) => e.key === 'Enter' && handleFilter('search', e.target.value)}
            className="w-full bg-[#14251F] border border-[#242820] rounded pl-9 pr-3 py-2 text-xs text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Filter Status:</span>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilter('status', e.target.value)}
            className="bg-[#14251F] border border-[#242820] rounded px-3 py-1.5 text-xs text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
          >
            <option value="">All Statuses</option>
            {Object.entries(statuses).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiry Table */}
      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg overflow-hidden">
        {inquiries.data.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            <FiMail className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No inquiries match your criteria.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-[#14251F]/60 text-stone-400 border-b border-[#242820]">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242820]">
              {inquiries.data.map((item) => (
                <tr key={item.id} className="hover:bg-[#14251F]/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#F1EBDD]">{item.customer_name}</div>
                    <div className="text-xs text-stone-400 font-mono">{item.email}</div>
                  </td>
                  <td className="py-3 px-4 text-stone-300">
                    {item.package ? item.package.title : <span className="italic text-stone-500">Custom Inquiry</span>}
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-300">
                    {item.preferred_travel_date ? item.preferred_travel_date.split('T')[0] : 'Flexible'}
                  </td>
                  <td className="py-3 px-4 text-stone-300">
                    {item.travelers_count} Pax
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${statusBadgeClasses[item.status] || 'bg-stone-800 text-stone-300'}`}>
                      {statuses[item.status] || item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={route('admin.inquiries.show', item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#242820] text-[#D7B77A] hover:bg-[#2c3227] text-xs font-semibold rounded transition"
                    >
                      <FiEye className="w-3.5 h-3.5" /> View Details
                    </Link>
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