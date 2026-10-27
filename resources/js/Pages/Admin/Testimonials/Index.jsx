import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiUser, FiGlobe, FiX } from 'react-icons/fi';

export default function TestimonialIndex({ testimonials }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    _method: 'POST',
    customer_name: '',
    country: '',
    review_text: '',
    customer_avatar: null,
    rating: 5,
    is_featured: false,
    is_published: true,
    display_order: 0,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setData({
      _method: 'POST',
      customer_name: '',
      country: '',
      review_text: '',
      customer_avatar: null,
      rating: 5,
      is_featured: false,
      is_published: true,
      display_order: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setData({
      _method: 'PUT',
      customer_name: item.customer_name,
      country: item.country || '',
      review_text: item.review_text,
      customer_avatar: null,
      rating: item.rating,
      is_featured: item.is_featured,
      is_published: item.is_published,
      display_order: item.display_order,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      post(route('admin.testimonials.update', editingItem.id), {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      post(route('admin.testimonials.store'), {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (id, name) => {
    if (confirm(`Hapus ulasan dari "${name}"?`)) {
      router.delete(route('admin.testimonials.destroy', id));
    }
  };

  return (
    <AdminLayout
      title="Verified Testimonials"
      actions={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold rounded uppercase tracking-wider transition"
        >
          <FiPlus className="w-4 h-4" /> Add Testimonial
        </button>
      }
    >
      <Head title="Testimonials — SUMMIT SOUL" />

      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg overflow-hidden">
        {testimonials.data.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            Belum ada ulasan klien yang terdaftar.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-[#14251F]/60 text-stone-400 border-b border-[#242820]">
              <tr>
                <th className="py-3 px-4">Climber</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242820]">
              {testimonials.data.map((item) => (
                <tr key={item.id} className="hover:bg-[#14251F]/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.customer_avatar ? (
                        <img
                          src={`/storage/${item.customer_avatar}`}
                          alt={item.customer_name}
                          className="w-8 h-8 rounded-full object-cover border border-[#242820]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#242820] flex items-center justify-center text-stone-400 text-xs">
                          <FiUser />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-[#F1EBDD]">{item.customer_name}</div>
                        <div className="text-xs text-stone-400 flex items-center gap-1">
                          <FiGlobe className="w-3 h-3 text-[#D7B77A]" />
                          <span>{item.country || 'International'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-300 max-w-sm truncate">
                    "{item.review_text}"
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs uppercase font-semibold px-2 py-0.5 rounded ${
                        item.is_published
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {item.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-stone-300 hover:text-[#D7B77A] bg-[#14251F] rounded border border-[#242820]"
                    >
                      <FiEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.customer_name)}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-[#14251F] rounded border border-[#242820]"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1A16] border border-[#242820] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-base text-[#D7B77A] font-semibold">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-stone-300 mb-1">Climber Name *</label>
                  <input
                    type="text"
                    required
                    value={data.customer_name}
                    onChange={(e) => setData('customer_name', e.target.value)}
                    className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-stone-300 mb-1">Country / Nationality</label>
                  <input
                    type="text"
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                    className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Rating</label>
                <select
                  value={data.rating}
                  onChange={(e) => setData('rating', Number(e.target.value))}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Review Text *</label>
                <textarea
                  rows="4"
                  required
                  value={data.review_text}
                  onChange={(e) => setData('review_text', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Customer Portrait (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData('customer_avatar', e.target.files[0])}
                  className="text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#242820] file:text-[#D7B77A] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.is_published}
                    onChange={(e) => setData('is_published', e.target.checked)}
                    className="rounded bg-[#14251F] border-[#242820] text-[#D7B77A]"
                  />
                  Published
                </label>
                <label className="inline-flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.is_featured}
                    onChange={(e) => setData('is_featured', e.target.checked)}
                    className="rounded bg-[#14251F] border-[#242820] text-[#D7B77A]"
                  />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 bg-[#242820] text-stone-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-[#D7B77A] text-[#14251F] font-semibold rounded uppercase tracking-wider"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}