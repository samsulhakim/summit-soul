import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiCompass, FiMail, FiMessageCircle, FiClock, FiPlusCircle, FiEdit3 } from 'react-icons/fi';

export default function Dashboard({ metrics, recentInquiries }) {
  const statCards = [
    { label: 'Published Packages', value: metrics.published_packages, icon: FiCompass, color: 'text-emerald-400' },
    { label: 'Draft Packages', value: metrics.draft_packages, icon: FiClock, color: 'text-amber-400' },
    { label: 'New Inquiries', value: metrics.new_inquiries, icon: FiMail, color: 'text-sky-400' },
    { label: 'Active Inquiries', value: metrics.in_progress_inquiries, icon: FiMessageCircle, color: 'text-[#D7B77A]' },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <Head title="Admin Dashboard — SUMMIT SOUL" />

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/admin/pages/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#242820] hover:bg-[#2c3227] text-[#D7B77A] text-xs font-semibold uppercase tracking-wider rounded border border-[#D7B77A]/20 transition"
        >
          <FiEdit3 className="w-4 h-4" /> Edit Homepage Content
        </Link>
        <Link
          href="/admin/packages/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <FiPlusCircle className="w-4 h-4" /> Add Hiking Package
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#0E1A16] border border-[#242820] rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400 tracking-wide uppercase">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold font-serif text-[#F1EBDD] mt-3">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#D7B77A] font-serif mb-4">Recent Booking Inquiries</h2>
        
        {recentInquiries.length === 0 ? (
          <div className="text-sm text-stone-400 text-center py-8">
            Belum ada data booking inquiry yang masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-stone-400 uppercase border-b border-[#242820]">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242820]">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-[#14251F]/40 transition">
                    <td className="py-3 px-4 font-medium text-[#F1EBDD]">
                      {inquiry.customer_name}
                      <span className="block text-xs text-stone-400">{inquiry.email}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-300">{inquiry.package_title || 'General Expedition'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-xs rounded uppercase font-semibold bg-[#242820] text-[#D7B77A] border border-[#D7B77A]/20">
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-400">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}