import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiSave, FiPhone, FiMail, FiMapPin, FiGlobe, FiShare2 } from 'react-icons/fi';

export default function SettingsIndex({ contact, seo }) {
  const { data, setData, put, processing, errors } = useForm({
    contact: {
      business_name: contact?.business_name || 'SUMMIT SOUL Luxury Adventure',
      guide_name: contact?.guide_name || 'Chief Mountain Guide',
      email: contact?.email || 'contact@summitsoul.com',
      whatsapp: contact?.whatsapp || '+6281234567890',
      location: contact?.location || 'East Java, Indonesia',
      instagram: contact?.instagram || 'https://instagram.com/summitsoul',
    },
    seo: {
      meta_title: seo?.meta_title || 'SUMMIT SOUL — Private Mountain Expeditions',
      meta_description: seo?.meta_description || 'Bespoke hiking and mountaineering experiences led by certified international mountain guides.',
      canonical_url: seo?.canonical_url || 'https://summitsoul.com',
      og_title: seo?.og_title || 'SUMMIT SOUL — Private Mountain Expeditions',
      og_description: seo?.og_description || 'Exclusive private guided expeditions across premier alpine peaks.',
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.settings.update'));
  };

  return (
    <AdminLayout
      title="General Settings & SEO"
      actions={
        <button
          onClick={handleSubmit}
          disabled={processing}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold rounded uppercase tracking-wider transition"
        >
          <FiSave className="w-4 h-4" /> Save Settings
        </button>
      }
    >
      <Head title="General Settings & SEO — SUMMIT SOUL" />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-1">
            <FiPhone className="text-[#D7B77A] w-4 h-4" />
            <h2 className="text-base font-serif font-semibold text-[#D7B77A]">Centralized Contact Details</h2>
          </div>
          <p className="text-xs text-stone-400 mb-6">
            Informasi kontak ini otomatis digunakan di header, footer, dan tombol WhatsApp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Business Display Name *</label>
              <input
                type="text"
                required
                value={data.contact.business_name}
                onChange={(e) => setData('contact', { ...data.contact, business_name: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
              {errors['contact.business_name'] && <span className="text-red-400 mt-1 block">{errors['contact.business_name']}</span>}
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Lead Guide Display Name *</label>
              <input
                type="text"
                required
                value={data.contact.guide_name}
                onChange={(e) => setData('contact', { ...data.contact, guide_name: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={data.contact.email}
                onChange={(e) => setData('contact', { ...data.contact, email: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
              {errors['contact.email'] && <span className="text-red-400 mt-1 block">{errors['contact.email']}</span>}
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">WhatsApp Hotline (+KodeNegara) *</label>
              <input
                type="text"
                required
                value={data.contact.whatsapp}
                onChange={(e) => setData('contact', { ...data.contact, whatsapp: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] font-mono outline-none"
              />
              {errors['contact.whatsapp'] && <span className="text-red-400 mt-1 block">{errors['contact.whatsapp']}</span>}
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Base Location *</label>
              <input
                type="text"
                required
                value={data.contact.location}
                onChange={(e) => setData('contact', { ...data.contact, location: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={data.contact.instagram}
                onChange={(e) => setData('contact', { ...data.contact, instagram: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global SEO & Social Sharing */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-1">
            <FiGlobe className="text-[#D7B77A] w-4 h-4" />
            <h2 className="text-base font-serif font-semibold text-[#D7B77A]">Search Engine Optimization (SEO)</h2>
          </div>
          <p className="text-xs text-stone-400 mb-6">
            Optimasi tag meta untuk peringkat pencarian Google serta kartu pratinjau sosial media.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">
                Default Meta Title (Max 70 Karakter)
              </label>
              <input
                type="text"
                maxLength={70}
                required
                value={data.seo.meta_title}
                onChange={(e) => setData('seo', { ...data.seo, meta_title: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
              <div className="text-[11px] text-stone-400 mt-1">{data.seo.meta_title.length}/70 karakter</div>
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">
                Default Meta Description (Max 160 Karakter)
              </label>
              <textarea
                rows="3"
                maxLength={160}
                required
                value={data.seo.meta_description}
                onChange={(e) => setData('seo', { ...data.seo, meta_description: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
              />
              <div className="text-[11px] text-stone-400 mt-1">{data.seo.meta_description.length}/160 karakter</div>
            </div>

            <div>
              <label className="block uppercase text-stone-300 font-medium mb-1">Canonical URL *</label>
              <input
                type="url"
                required
                value={data.seo.canonical_url}
                onChange={(e) => setData('seo', { ...data.seo, canonical_url: e.target.value })}
                className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] font-mono outline-none"
              />
            </div>

            <div className="border-t border-[#242820] pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-stone-300 font-medium mb-1">Open Graph Title</label>
                <input
                  type="text"
                  value={data.seo.og_title}
                  onChange={(e) => setData('seo', { ...data.seo, og_title: e.target.value })}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-stone-300 font-medium mb-1">Open Graph Description</label>
                <input
                  type="text"
                  value={data.seo.og_description}
                  onChange={(e) => setData('seo', { ...data.seo, og_description: e.target.value })}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}