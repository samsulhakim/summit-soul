import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiHelpCircle, FiX } from 'react-icons/fi';

export default function FaqIndex({ faqs }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const { data, setData, post, put, processing, reset } = useForm({
    question: '',
    answer: '',
    is_published: true,
    display_order: 0,
  });

  const openCreateModal = () => {
    setEditingFaq(null);
    reset();
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingFaq(item);
    setData({
      question: item.question,
      answer: item.answer,
      is_published: item.is_published,
      display_order: item.display_order,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingFaq) {
      put(route('admin.faqs.update', editingFaq.id), {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      post(route('admin.faqs.store'), {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Hapus butir pertanyaan FAQ ini?')) {
      router.delete(route('admin.faqs.destroy', id));
    }
  };

  return (
    <AdminLayout
      title="Frequently Asked Questions (FAQ)"
      actions={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold rounded uppercase tracking-wider transition"
        >
          <FiPlus className="w-4 h-4" /> Add FAQ
        </button>
      }
    >
      <Head title="FAQs — SUMMIT SOUL" />

      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg overflow-hidden">
        {faqs.data.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            <FiHelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Belum ada daftar FAQ yang dibuat.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-[#14251F]/60 text-stone-400 border-b border-[#242820]">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Answer Overview</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242820]">
              {faqs.data.map((faq) => (
                <tr key={faq.id} className="hover:bg-[#14251F]/40 transition">
                  <td className="py-3 px-4 font-mono text-stone-400 text-xs">#{faq.display_order}</td>
                  <td className="py-3 px-4 font-semibold text-[#F1EBDD] max-w-xs">{faq.question}</td>
                  <td className="py-3 px-4 text-xs text-stone-400 max-w-sm truncate">{faq.answer}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs uppercase font-semibold px-2 py-0.5 rounded ${
                        faq.is_published
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {faq.is_published ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(faq)}
                      className="p-1.5 text-stone-300 hover:text-[#D7B77A] bg-[#14251F] rounded border border-[#242820]"
                    >
                      <FiEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
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
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-stone-300 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the required fitness level for Mount Semeru?"
                  value={data.question}
                  onChange={(e) => setData('question', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Answer *</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Detailed explanation, gear requirements, or logistics guidelines..."
                  value={data.answer}
                  onChange={(e) => setData('answer', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-stone-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={data.display_order}
                    onChange={(e) => setData('display_order', Number(e.target.value))}
                    className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.is_published}
                      onChange={(e) => setData('is_published', e.target.checked)}
                      className="rounded bg-[#14251F] border-[#242820] text-[#D7B77A]"
                    />
                    Published on Website
                  </label>
                </div>
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}