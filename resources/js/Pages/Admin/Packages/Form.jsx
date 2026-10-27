import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { FiSave, FiArrowLeft, FiPlus, FiX } from "react-icons/fi";
import RichTextEditor from "@/Components/RichTextEditor";

export default function PackageForm({ package: pkg, isEdit }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: isEdit ? "PUT" : "POST",
    title: pkg?.title || "",
    destination: pkg?.destination || "",
    duration: pkg?.duration || "",
    difficulty_level: pkg?.difficulty_level || "Moderate",
    price: pkg?.price || "",
    currency: pkg?.currency || "USD",
    price_unit: pkg?.price_unit || "per_person",
    max_group_size: pkg?.max_group_size || 8,
    short_description: pkg?.short_description || "",
    full_description: pkg?.full_description || "",
    featured_image: null,
    included_services: pkg?.included_services || [
      "Certified Lead Alpine Guide",
      "Mountain Permits & Insurance",
    ],
    excluded_services: pkg?.excluded_services || [
      "International Flights",
      "Personal Porter",
    ],
    requirements: pkg?.requirements || [
      "Passport valid 6 months",
      "Medical clearance statement",
    ],
    seo_title: pkg?.seo_title || "",
    seo_description: pkg?.seo_description || "",
    is_featured: Boolean(pkg?.is_featured),
    status: pkg?.status || "draft",
    display_order: pkg?.display_order || 0,
  });

  const [previewImage, setPreviewImage] = useState(
    pkg?.featured_image ? `/storage/${pkg.featured_image}` : null,
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("featured_image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddListItem = (field, defaultValue = "") => {
    setData(field, [...data[field], defaultValue]);
  };

  const handleRemoveListItem = (field, index) => {
    setData(
      field,
      data[field].filter((_, i) => i !== index),
    );
  };

  const handleListItemChange = (field, index, value) => {
    const updated = [...data[field]];
    updated[index] = value;
    setData(field, updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      post(route("admin.packages.update", pkg.id));
    } else {
      post(route("admin.packages.store"));
    }
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit Package: ${pkg.title}` : "Create Hiking Package"}
      actions={
        <div className="flex gap-2">
          <Link
            href={route("admin.packages.index")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#242820] text-stone-300 text-xs font-semibold rounded transition"
          >
            <FiArrowLeft className="w-4 h-4" /> Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D7B77A] text-[#14251F] text-xs font-semibold rounded uppercase tracking-wider transition"
          >
            <FiSave className="w-4 h-4" /> Save Package
          </button>
        </div>
      }
    >
      <Head title={isEdit ? "Edit Package" : "Create Package"} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Package Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] focus:border-[#D7B77A] outline-none"
            />
            {errors.title && (
              <span className="text-red-400 text-xs">{errors.title}</span>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Destination
            </label>
            <input
              type="text"
              value={data.destination}
              onChange={(e) => setData("destination", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            />
            {errors.destination && (
              <span className="text-red-400 text-xs">{errors.destination}</span>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Duration (e.g. 4 Days 3 Nights)
            </label>
            <input
              type="text"
              value={data.duration}
              onChange={(e) => setData("duration", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            />
            {errors.duration && (
              <span className="text-red-400 text-xs">{errors.duration}</span>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Difficulty Level
            </label>
            <select
              value={data.difficulty_level}
              onChange={(e) => setData("difficulty_level", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Demanding">Demanding</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Max Group Size
            </label>
            <input
              type="number"
              value={data.max_group_size}
              onChange={(e) => setData("max_group_size", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.currency}
                onChange={(e) => setData("currency", e.target.value)}
                className="w-20 text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] font-mono outline-none"
              />
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className="flex-1 text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] font-mono outline-none"
              />
            </div>
            {errors.price && (
              <span className="text-red-400 text-xs">{errors.price}</span>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Price Unit
            </label>
            <select
              value={data.price_unit}
              onChange={(e) => setData("price_unit", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            >
              <option value="per_person">Per Person</option>
              <option value="per_group">Per Group</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Short Description
            </label>
            
            <textarea
              rows="2"
              value={data.short_description}
              onChange={(e) => setData("short_description", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-stone-300 font-medium mb-2">
              Full Itinerary & Detailed Description
            </label>
            <RichTextEditor
              value={data.full_description}
              onChange={(content) => setData("full_description", content)}/>
            {errors.full_description && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.full_description}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image Upload */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
          <label className="block text-xs uppercase text-stone-300 font-medium mb-2">
            Featured Image
          </label>
          <div className="flex items-center gap-6">
            {previewImage && (
              <img
                src={previewImage}
                alt="Featured Preview"
                className="w-32 h-20 object-cover rounded border border-[#242820]"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#242820] file:text-[#D7B77A] hover:file:bg-[#2c3227] cursor-pointer"
            />
          </div>
          {errors.featured_image && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.featured_image}
            </span>
          )}
        </div>

        {/* Dynamic Lists (Included & Excluded Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs uppercase text-stone-300 font-medium">
                Included Services
              </label>
              <button
                type="button"
                onClick={() => handleAddListItem("included_services")}
                className="text-xs text-[#D7B77A] inline-flex items-center gap-1 hover:underline"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {data.included_services.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(
                        "included_services",
                        idx,
                        e.target.value,
                      )
                    }
                    className="flex-1 text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-1.5 text-[#F1EBDD] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveListItem("included_services", idx)
                    }
                    className="text-stone-400 hover:text-red-400 px-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs uppercase text-stone-300 font-medium">
                Excluded Services
              </label>
              <button
                type="button"
                onClick={() => handleAddListItem("excluded_services")}
                className="text-xs text-[#D7B77A] inline-flex items-center gap-1 hover:underline"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {data.excluded_services.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(
                        "excluded_services",
                        idx,
                        e.target.value,
                      )
                    }
                    className="flex-1 text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-1.5 text-[#F1EBDD] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveListItem("excluded_services", idx)
                    }
                    className="text-stone-400 hover:text-red-400 px-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Publishing & Ordering */}
        <div className="bg-[#0E1A16] border border-[#242820] rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Status
            </label>
            <select
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            >
              <option value="draft">Draft (Hidden from Public)</option>
              <option value="published">Published (Live on Website)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-stone-300 font-medium mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={data.display_order}
              onChange={(e) => setData("display_order", e.target.value)}
              className="w-full text-xs bg-[#14251F] border border-[#242820] rounded px-3 py-2 text-[#F1EBDD] outline-none"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="inline-flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_featured}
                onChange={(e) => setData("is_featured", e.target.checked)}
                className="rounded bg-[#14251F] border-[#242820] text-[#D7B77A] focus:ring-0"
              />
              Mark as Featured Package (Homepage Highlight)
            </label>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
