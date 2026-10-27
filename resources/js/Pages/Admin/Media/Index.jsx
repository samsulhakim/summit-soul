import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiUploadCloud, FiTrash2, FiEdit3, FiImage, FiFilter, FiCheck, FiX } from 'react-icons/fi';

export default function MediaIndex({ media, filters }) {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const uploadForm = useForm({
    files: [],
    category: 'expedition',
  });

  const editForm = useForm({
    alt_text: '',
    caption: '',
    category: 'expedition',
    is_featured: false,
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    uploadForm.post(route('admin.media.store'), {
      onSuccess: () => {
        uploadForm.reset();
        document.getElementById('file-input').value = null;
      },
    });
  };

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    editForm.setData({
      alt_text: asset.alt_text || '',
      caption: asset.caption || '',
      category: asset.category,
      is_featured: asset.is_featured,
    });
  };

  const handleUpdateAsset = (e) => {
    e.preventDefault();
    editForm.put(route('admin.media.update', selectedAsset.id), {
      onSuccess: () => setSelectedAsset(null),
    });
  };

  const handleDeleteAsset = (id) => {
    if (confirm('Hapus gambar ini secara permanen dari server?')) {
      router.delete(route('admin.media.destroy', id), {
        onSuccess: () => setSelectedAsset(null),
      });
    }
  };

  const handleFilterCategory = (cat) => {
    router.get(route('admin.media.index'), { ...filters, category: cat }, { preserveState: true });
  };

  return (
    <AdminLayout title="Gallery & Media Manager">
      <Head title="Media Manager — SUMMIT SOUL" />

      {/* Upload Zone */}
      <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6 mb-8">
        <h2 className="text-sm font-serif font-semibold text-[#D7B77A] mb-3">Upload Media Baru</h2>
        <form onSubmit={handleUploadSubmit} className="flex flex-wrap items-center gap-4">
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => uploadForm.setData('files', Array.from(e.target.files))}
            className="text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#242820] file:text-[#D7B77A] hover:file:bg-[#2c3227] cursor-pointer"
          />

          <select
            value={uploadForm.data.category}
            onChange={(e) => uploadForm.setData('category', e.target.value)}
            className="text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
          >
            <option value="expedition">Expedition</option>
            <option value="summits">Summits & Peaks</option>
            <option value="camps">Basecamps & Gear</option>
            <option value="guides">Guides & Safety</option>
          </select>

          <button
            type="submit"
            disabled={uploadForm.processing || uploadForm.data.files.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold uppercase tracking-wider rounded transition"
          >
            <FiUploadCloud className="w-4 h-4" /> Upload Images
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#242820] pb-3 text-xs">
        {['', 'expedition', 'summits', 'camps', 'guides'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterCategory(cat)}
            className={`px-3 py-1.5 rounded uppercase font-semibold tracking-wider transition ${
              (filters.category || '') === cat ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'
            }`}
          >
            {cat === '' ? 'All Assets' : cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.data.map((item) => (
          <div
            key={item.id}
            className="group relative bg-[#0E1A16] border border-[#242820] rounded-lg overflow-hidden aspect-square flex flex-col justify-end"
          >
            <img
              src={`/storage/${item.file_path}`}
              alt={item.alt_text || 'Media preview'}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-between">
              <span className="text-[10px] text-stone-300 truncate max-w-[90px]">{item.alt_text}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1 bg-[#14251F] text-[#D7B77A] rounded hover:bg-[#242820]"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAsset(item.id)}
                  className="p-1 bg-[#14251F] text-red-400 rounded hover:bg-[#242820]"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Meta Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1A16] border border-[#242820] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-base text-[#D7B77A] font-semibold">Edit Image Details</h3>
              <button onClick={() => setSelectedAsset(null)} className="text-stone-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAsset} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-stone-300 mb-1">Alt Text (Aksesibilitas & SEO)</label>
                <input
                  type="text"
                  value={editForm.data.alt_text}
                  onChange={(e) => editForm.setData('alt_text', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Caption / Keterangan</label>
                <input
                  type="text"
                  value={editForm.data.caption}
                  onChange={(e) => editForm.setData('caption', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-stone-300 mb-1">Kategori</label>
                <select
                  value={editForm.data.category}
                  onChange={(e) => editForm.setData('category', e.target.value)}
                  className="w-full bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
                >
                  <option value="expedition">Expedition</option>
                  <option value="summits">Summits & Peaks</option>
                  <option value="camps">Basecamps & Gear</option>
                  <option value="guides">Guides & Safety</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  className="px-3 py-1.5 bg-[#242820] text-stone-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="px-4 py-1.5 bg-[#D7B77A] text-[#14251F] font-semibold rounded uppercase tracking-wider"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}