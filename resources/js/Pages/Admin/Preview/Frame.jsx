import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  FiMonitor, FiTablet, FiSmartphone, FiArrowLeft, 
  FiRefreshCw, FiExternalLink, FiUploadCloud 
} from 'react-icons/fi';

export default function PreviewFrame() {
  const [device, setDevice] = useState('desktop');
  const [iframeKey, setIframeKey] = useState(1);

  const deviceWidths = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[95%] rounded-xl shadow-2xl border-4 border-[#242820]',
    mobile: 'w-[375px] h-[85%] rounded-2xl shadow-2xl border-4 border-[#242820]',
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handlePublish = () => {
    if (confirm('Terbitkan seluruh perubahan draft ke website publik sekarang?')) {
      router.post(route('admin.appearance.publish'));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0A120F] overflow-hidden select-none">
      <Head title="Live Draft Preview — SUMMIT SOUL" />

      {/* Top Controller Bar */}
      <header className="h-14 bg-[#14251F] border-b border-[#242820] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href={route('admin.appearance')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#242820] text-stone-300 hover:text-white text-xs font-medium transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Appearance
          </Link>
          <span className="hidden sm:inline-block text-xs font-serif text-[#D7B77A] font-semibold border-l border-[#242820] pl-3">
            DRAFT PREVIEW MODE
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-[#0E1A16] p-1 rounded-lg border border-[#242820]">
          <button
            onClick={() => setDevice('desktop')}
            title="Desktop View (100%)"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
              device === 'desktop' ? 'bg-[#242820] text-[#D7B77A] font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <FiMonitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet View (768px)"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
              device === 'tablet' ? 'bg-[#242820] text-[#D7B77A] font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <FiTablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDevice('mobile')}
            title="Mobile View (375px)"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
              device === 'mobile' ? 'bg-[#242820] text-[#D7B77A] font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <FiSmartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Reload Preview"
            className="p-2 rounded bg-[#242820] text-stone-300 hover:text-white transition"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#D7B77A] hover:bg-[#c2a366] text-[#14251F] text-xs font-semibold tracking-wider transition uppercase"
          >
            <FiUploadCloud className="w-4 h-4" /> Publish Now
          </button>
        </div>
      </header>

      {/* Main Preview Screen */}
      <main className="flex-1 bg-[#070D0B] flex items-center justify-center p-4 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out ${deviceWidths[device]} flex flex-col bg-white overflow-hidden`}>
          <iframe
            key={iframeKey}
            src={route('admin.preview.render')}
            title="Website Draft Preview"
            className="w-full h-full border-0"
          />
        </div>
      </main>
    </div>
  );
}