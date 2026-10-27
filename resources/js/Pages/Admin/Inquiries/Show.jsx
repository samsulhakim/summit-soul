import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiArrowLeft, FiMessageCircle, FiSave, FiCalendar, FiUsers, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';

export default function InquiryShow({ inquiry, whatsappUrl }) {
  const statusForm = useForm({
    status: inquiry.status,
  });

  const notesForm = useForm({
    internal_notes: inquiry.internal_notes || '',
  });

  const handleStatusChange = (newStatus) => {
    statusForm.setData('status', newStatus);
    statusForm.patch(route('admin.inquiries.update_status', inquiry.id));
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    notesForm.post(route('admin.inquiries.notes', inquiry.id));
  };

  return (
    <AdminLayout
      title={`Inquiry Details #${inquiry.id}`}
      actions={
        <div className="flex gap-2">
          <Link
            href={route('admin.inquiries.index')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#242820] text-stone-300 text-xs font-semibold rounded transition"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Inquiries
          </Link>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition"
            >
              <FiMessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          )}
        </div>
      }
    >
      <Head title={`Inquiry #${inquiry.id} — SUMMIT SOUL`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inquiry Info & Client Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-4">Traveler Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <FiMail className="w-4 h-4 text-[#D7B77A]" />
                <span className="font-semibold">Email:</span>
                <span className="font-mono">{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <FiPhone className="w-4 h-4 text-[#D7B77A]" />
                <span className="font-semibold">WhatsApp:</span>
                <span className="font-mono">{inquiry.phone_whatsapp || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <FiGlobe className="w-4 h-4 text-[#D7B77A]" />
                <span className="font-semibold">Nationality:</span>
                <span>{inquiry.nationality || 'Unspecified'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <FiUsers className="w-4 h-4 text-[#D7B77A]" />
                <span className="font-semibold">Party Size:</span>
                <span>{inquiry.travelers_count} person(s)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <FiCalendar className="w-4 h-4 text-[#D7B77A]" />
                <span className="font-semibold">Preferred Date:</span>
                <span>{inquiry.preferred_travel_date ? inquiry.preferred_travel_date.split('T')[0] : 'Flexible'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-2">Requested Expedition</h2>
            <div className="p-3 bg-[#14251F] border border-[#242820] rounded mb-4 text-xs">
              {inquiry.package ? (
                <div>
                  <div className="font-semibold text-[#F1EBDD] text-sm">{inquiry.package.title}</div>
                  <div className="text-stone-400 font-mono mt-1">
                    Base: {inquiry.package.currency} {Number(inquiry.package.price).toLocaleString()} / {inquiry.package.price_unit.replace('_', ' ')}
                  </div>
                </div>
              ) : (
                <span className="text-stone-400 italic">Custom Bespoke Itinerary Request</span>
              )}
            </div>

            <h3 className="text-xs uppercase font-medium text-stone-400 mb-2">Message from Customer:</h3>
            <div className="p-4 bg-[#14251F] border border-[#242820] rounded text-stone-200 text-xs leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>
        </div>

        {/* Right Column: Status & Internal Notes */}
        <div className="space-y-6">
          {/* Status Updater */}
          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <h2 className="text-sm font-semibold text-[#D7B77A] font-serif mb-3">Update Status</h2>
            <select
              value={statusForm.data.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="awaiting_confirmation">Awaiting Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Internal Administrative Notes */}
          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <h2 className="text-sm font-semibold text-[#D7B77A] font-serif mb-2">Internal Notes</h2>
            <p className="text-[11px] text-stone-400 mb-3">Private team notes. Not visible to the client.</p>

            <form onSubmit={handleSaveNotes} className="space-y-3">
              <textarea
                rows="6"
                value={notesForm.data.internal_notes}
                onChange={(e) => notesForm.setData('internal_notes', e.target.value)}
                placeholder="Log customer preferences, medical disclosures, gear rental notes..."
                className="w-full text-xs bg-[#14251F] border border-[#242820] rounded p-3 text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
              />
              <button
                type="submit"
                disabled={notesForm.processing}
                className="w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-[#242820] hover:bg-[#2c3227] text-[#D7B77A] text-xs font-semibold rounded border border-[#D7B77A]/20 transition"
              >
                <FiSave className="w-3.5 h-3.5" /> Save Internal Notes
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}