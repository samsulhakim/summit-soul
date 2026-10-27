import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiSliders, FiMonitor, FiSmartphone, FiCheck, FiImage, FiSave, FiUploadCloud, FiX } from 'react-icons/fi';

export default function AppearanceIndex({ themeColors, typography, heroLayout, heroContent }) {
  const [activeDeviceTab, setActiveDeviceTab] = useState('desktop');
  const [selectedBackgroundPreview, setSelectedBackgroundPreview] = useState(null);

  const { data, setData, post, processing, errors, transform } = useForm({
    themeColors: {
      primary_color: themeColors?.primary_color || '#14251F',
      secondary_color: themeColors?.secondary_color || '#F1EBDD',
      accent_color: themeColors?.accent_color || '#D7B77A',
      dark_bg: themeColors?.dark_bg || '#242820',
      main_text: themeColors?.main_text || '#F1EBDD',
    },
    typography: {
      heading_font: typography?.heading_font || 'Playfair Display',
      body_font: typography?.body_font || 'Inter',
      heading_size_preset: typography?.heading_size_preset || 'large',
      body_size_preset: typography?.body_size_preset || 'regular',
    },
    heroLayout: {
      desktop_height: heroLayout?.desktop_height || 'screen',
      mobile_height: heroLayout?.mobile_height || 'large',
      content_alignment: heroLayout?.content_alignment || 'left',
      mobile_text_alignment: heroLayout?.mobile_text_alignment || 'center',
      container_width: heroLayout?.container_width || 'wide',
    },
    heroBackground: null,
  });

  useEffect(() => {
    if (!data.heroBackground) {
      setSelectedBackgroundPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(data.heroBackground);
    setSelectedBackgroundPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [data.heroBackground]);

  const currentBackground = heroContent?.background_image;
  const currentBackgroundUrl = currentBackground
    ? /^(https?:)?\/\//i.test(currentBackground) || currentBackground.startsWith('/')
      ? currentBackground
      : `/storage/${currentBackground}`
    : null;
  const backgroundPreviewUrl = selectedBackgroundPreview || currentBackgroundUrl;

  const saveDraft = (options = {}) => {
    transform((formData) => ({ ...formData, _method: 'put' }))
      .post(route('admin.appearance.update_draft'), {
        ...options,
        onFinish: (visit) => {
          transform((formData) => formData);
          options.onFinish?.(visit);
        },
      });
  };

  const publishChanges = () => {
    transform(({ heroBackground, ...formData }) => formData)
      .post(route('admin.appearance.publish'), {
        onFinish: () => transform((formData) => formData),
      });
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    saveDraft({
      onSuccess: () => setData('heroBackground', null),
    });
  };

  const handlePublish = () => {
    if (confirm('Apakah Anda yakin ingin menerbitkan perubahan tema ini ke website publik?')) {
      if (data.heroBackground) {
        saveDraft({
          onSuccess: () => {
            setData('heroBackground', null);
            publishChanges();
          },
        });
      } else {
        publishChanges();
      }
    }
  };

  return (
    <AdminLayout
      title="Appearance & Theme Controls"
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={processing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#242820] hover:bg-[#2c3227] text-[#D7B77A] text-xs font-semibold rounded border border-[#D7B77A]/20 transition"
          >
            <FiSave className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={processing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold rounded transition"
          >
            <FiUploadCloud className="w-4 h-4" /> Publish Changes
          </button>
        </div>
      }
    >
      <Head title="Appearance & Theme — SUMMIT SOUL" />

      <form onSubmit={handleSaveDraft} className="space-y-8">
        {/* Section 1: Brand Colors */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-1">Color Palette</h2>
          <p className="text-xs text-stone-400 mb-6">Sesuaikan skema warna brand SUMMIT SOUL.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-medium text-stone-300 mb-2">
                Primary Color (Forest Green)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.themeColors.primary_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, primary_color: e.target.value })}
                  className="w-10 h-10 rounded border border-[#242820] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={data.themeColors.primary_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, primary_color: e.target.value })}
                  className="w-28 text-xs bg-[#14251F] border border-[#242820] rounded px-2.5 py-2 text-[#F1EBDD] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-medium text-stone-300 mb-2">
                Secondary Color (Warm Sand)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.themeColors.secondary_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, secondary_color: e.target.value })}
                  className="w-10 h-10 rounded border border-[#242820] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={data.themeColors.secondary_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, secondary_color: e.target.value })}
                  className="w-28 text-xs bg-[#14251F] border border-[#242820] rounded px-2.5 py-2 text-[#F1EBDD] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-medium text-stone-300 mb-2">
                Accent Color (Muted Gold)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.themeColors.accent_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, accent_color: e.target.value })}
                  className="w-10 h-10 rounded border border-[#242820] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={data.themeColors.accent_color}
                  onChange={(e) => setData('themeColors', { ...data.themeColors, accent_color: e.target.value })}
                  className="w-28 text-xs bg-[#14251F] border border-[#242820] rounded px-2.5 py-2 text-[#F1EBDD] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Typography */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-1">Typography Settings</h2>
          <p className="text-xs text-stone-400 mb-6">Pilih font heading dan body serta ukuran standar.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Heading Font</label>
              <select
                value={data.typography.heading_font}
                onChange={(e) => setData('typography', { ...data.typography, heading_font: e.target.value })}
                className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
              >
                <option value="Playfair Display">Playfair Display (Serif - Recommended)</option>
                <option value="Cinzel">Cinzel (Classical Elegant)</option>
                <option value="Montserrat">Montserrat (Clean Sans)</option>
                <option value="Inter">Inter (Modern Sans)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Body Font</label>
              <select
                value={data.typography.body_font}
                onChange={(e) => setData('typography', { ...data.typography, body_font: e.target.value })}
                className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
              >
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="Roboto">Roboto (Neutral Sans)</option>
                <option value="Lora">Lora (Contemporary Serif)</option>
                <option value="Merriweather">Merriweather (Classic Editorial)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-1">Homepage Background Photo</h2>
          <p className="text-xs text-stone-400 mb-5">
            Ganti foto latar hero halaman Home. Simpan sebagai draft untuk preview admin atau langsung terbitkan.
          </p>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:items-start">
            <div>
              <label htmlFor="hero-background" className="block text-xs uppercase font-medium text-stone-300 mb-2">
                Choose a new background image
              </label>
              <input
                id="hero-background"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setData('heroBackground', event.target.files?.[0] ?? null)}
                className="block w-full text-xs text-stone-300 file:mr-3 file:rounded file:border-0 file:bg-[#D7B77A] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#14251F] hover:file:bg-[#c2a366]"
              />
              <p className="mt-2 text-[11px] text-stone-500">Format JPG, PNG, atau WebP. Maksimal 5 MB.</p>
              {errors.heroBackground && <p className="mt-2 text-xs text-rose-400">{errors.heroBackground}</p>}
              {data.heroBackground && (
                <button
                  type="button"
                  onClick={() => setData('heroBackground', null)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-stone-300 transition hover:text-white"
                >
                  <FiX className="h-3.5 w-3.5" /> Remove selected image
                </button>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs uppercase font-medium text-stone-300">
                {data.heroBackground ? 'New background preview' : 'Current background'}
              </p>
              {backgroundPreviewUrl ? (
                <img
                  src={backgroundPreviewUrl}
                  alt="Homepage hero background preview"
                  className="h-40 w-full rounded border border-[#242820] object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center gap-2 rounded border border-dashed border-[#3b473f] text-xs text-stone-500">
                  <FiImage className="h-4 w-4" /> No background image selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Responsive Layout Controls (Desktop vs Mobile) */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-serif font-semibold text-[#D7B77A] mb-1">Responsive Layout Controls</h2>
              <p className="text-xs text-stone-400">Atur tata letak dan penataan spesifik layar desktop dan mobile.</p>
            </div>

            {/* Device Switcher Tabs */}
            <div className="flex bg-[#14251F] p-1 rounded border border-[#242820]">
              <button
                type="button"
                onClick={() => setActiveDeviceTab('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                  activeDeviceTab === 'desktop' ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'
                }`}
              >
                <FiMonitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setActiveDeviceTab('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                  activeDeviceTab === 'mobile' ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'
                }`}
              >
                <FiSmartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>

          {activeDeviceTab === 'desktop' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Desktop Hero Height</label>
                <select
                  value={data.heroLayout.desktop_height}
                  onChange={(e) => setData('heroLayout', { ...data.heroLayout, desktop_height: e.target.value })}
                  className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
                >
                  <option value="screen">Full Screen (100vh)</option>
                  <option value="large">Large (85vh)</option>
                  <option value="screen_padded">Full Screen with Padding</option>
                  <option value="auto">Auto / Content-based</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Content Alignment</label>
                <select
                  value={data.heroLayout.content_alignment}
                  onChange={(e) => setData('heroLayout', { ...data.heroLayout, content_alignment: e.target.value })}
                  className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Container Width</label>
                <select
                  value={data.heroLayout.container_width}
                  onChange={(e) => setData('heroLayout', { ...data.heroLayout, container_width: e.target.value })}
                  className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
                >
                  <option value="boxed">Boxed (Max 1280px)</option>
                  <option value="wide">Wide (Max 1536px)</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Mobile Hero Height</label>
                <select
                  value={data.heroLayout.mobile_height}
                  onChange={(e) => setData('heroLayout', { ...data.heroLayout, mobile_height: e.target.value })}
                  className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
                >
                  <option value="full">100% Viewport Height</option>
                  <option value="large">Large (75vh)</option>
                  <option value="medium">Medium (60vh)</option>
                  <option value="auto">Auto Fit Content</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-stone-300 mb-2">Mobile Text Alignment</label>
                <select
                  value={data.heroLayout.mobile_text_alignment}
                  onChange={(e) => setData('heroLayout', { ...data.heroLayout, mobile_text_alignment: e.target.value })}
                  className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD]"
                >
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}