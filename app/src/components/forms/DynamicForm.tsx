"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Plus,
  Minus,
  Music,
  Image as ImageIcon,
  Video,
  Calendar,
  Type,
  AlignLeft,
  List,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { TemplateField, TemplateSchema } from "@/types";

interface DynamicFormProps {
  schema: TemplateSchema;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onMediaUpload: (fieldKey: string, file: File) => Promise<string>;
}

const FIELD_ICONS: Record<string, React.ElementType> = {
  text: Type,
  long_text: AlignLeft,
  image: ImageIcon,
  images: ImageIcon,
  video: Video,
  audio: Music,
  music_select: Music,
  text_array: List,
  countdown_date: Calendar,
};

const MUSIC_LIBRARY: Record<string, string> = {
  royalty_free_1: "🎵 Gentle Birthday (Piano)",
  royalty_free_2: "🎶 Celebration Joy (Upbeat)",
  royalty_free_3: "🎼 Starlit Serenade (Orchestral)",
  custom_upload: "📁 Upload your own",
};

// Preset AI Wish & Letter Ideas for Instant Generation
const AI_PRESETS: Record<string, string[]> = {
  romantic_letter: [
    "On this beautiful day, I want you to know how incredibly special you are to me. Your smile lights up every room, and your kindness inspires me daily. May this new year of your life bring you boundless joy, love, and all the dreams your heart holds dear.",
    "Happy Birthday to my favorite person in the entire universe. Every moment spent with you is a memory I treasure. Thank you for filling my world with laughter, warmth, and pure magic. Here's to a lifetime of adventures together!",
  ],
  romantic_reasons: [
    "Your laugh is my absolute favorite sound in the world.",
    "You have an unmatched kindness that touches everyone around you.",
    "You always know how to make me smile even on difficult days.",
    "You turn ordinary moments into timeless stories.",
    "Your smile brings peace to my heart.",
    "You inspire me to be a better person every single day.",
  ],
  friendship_wishes: [
    "May your year ahead be as radiant, joyful, and wonderful as your soul!",
    "Wishing you endless success, golden opportunities, and endless laughter.",
    "Like a sunflower, may you always turn towards the light and bloom beautifully.",
    "Here's to celebrating the most incredible human today and always!",
  ],
};

export default function DynamicForm({
  schema,
  values,
  onChange,
  onMediaUpload,
}: DynamicFormProps) {
  return (
    <div className="space-y-5">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
          onMediaUpload={onMediaUpload}
        />
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  onMediaUpload,
}: {
  field: TemplateField;
  value: unknown;
  onChange: (value: unknown) => void;
  onMediaUpload: (fieldKey: string, file: File) => Promise<string>;
}) {
  const Icon = FIELD_ICONS[field.type] || Type;

  return (
    <motion.div
      className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#e6cb9c]/40 p-5 shadow-sm hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1e1b2e]">
          <span className="p-1.5 rounded-lg bg-[#bcf6f0]/50 text-[#0f766e]">
            <Icon size={15} />
          </span>
          <span>{field.label}</span>
          {field.required && <span className="text-pink-500 font-bold">*</span>}
        </label>

        {/* AI Quick Generator for text/letter/reasons */}
        {(field.type === "long_text" || field.key === "specialMessage" || field.key === "letterContent") && (
          <button
            type="button"
            onClick={() => {
              const options = AI_PRESETS.romantic_letter;
              const pick = options[Math.floor(Math.random() * options.length)];
              onChange(pick);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#ebcae8] to-[#bcf6f0] text-[#1e1b2e] hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles size={11} className="text-[#86198f]" />
            <span>AI Wish Ideas</span>
          </button>
        )}
      </div>

      {field.type === "text" && (
        <TextInput field={field} value={value as string} onChange={onChange} />
      )}

      {field.type === "long_text" && (
        <LongTextInput field={field} value={value as string} onChange={onChange} />
      )}

      {field.type === "image" && (
        <SingleImageUpload
          field={field}
          value={value as string}
          onChange={onChange}
          onUpload={onMediaUpload}
        />
      )}

      {field.type === "images" && (
        <MultiImageUpload
          field={field}
          value={(value as string[]) || []}
          onChange={onChange}
          onUpload={onMediaUpload}
        />
      )}

      {field.type === "video" && (
        <VideoUpload
          field={field}
          value={value as string}
          onChange={onChange}
          onUpload={onMediaUpload}
        />
      )}

      {field.type === "audio" && (
        <AudioUpload
          field={field}
          value={value as string}
          onChange={onChange}
          onUpload={onMediaUpload}
        />
      )}

      {field.type === "music_select" && (
        <MusicSelect field={field} value={value as string} onChange={onChange} />
      )}

      {field.type === "text_array" && (
        <TextArrayInput
          field={field}
          value={(value as string[]) || []}
          onChange={onChange}
        />
      )}

      {field.type === "countdown_date" && (
        <DateInput field={field} value={value as string} onChange={onChange} />
      )}

      {field.note && (
        <p className="text-[11px] text-[#4a4458]/70 mt-2 font-medium">{field.note}</p>
      )}
    </motion.div>
  );
}

// --- Field Components ---

function TextInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const displayVal = value !== undefined && value !== null ? value : (field.default as string) || "";
  return (
    <input
      type="text"
      value={displayVal}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || ""}
      maxLength={field.maxLength}
      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e6cb9c]/60 text-[#1e1b2e] text-sm placeholder:text-[#4a4458]/40 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] transition-all font-medium"
    />
  );
}

function LongTextInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const displayVal = value !== undefined && value !== null ? value : (field.default as string) || "";
  return (
    <div>
      <textarea
        value={displayVal}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ""}
        maxLength={field.maxLength}
        rows={5}
        className="w-full px-4 py-3 rounded-xl bg-white border border-[#e6cb9c]/60 text-[#1e1b2e] text-sm placeholder:text-[#4a4458]/40 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] transition-all resize-y font-medium leading-relaxed"
      />
      {field.maxLength && (
        <p className="text-right text-xs text-[#4a4458]/60 mt-1 font-medium">
          {(displayVal || "").length}/{field.maxLength}
        </p>
      )}
    </div>
  );
}

function SingleImageUpload({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
  onUpload: (key: string, file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(field.key, file);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const hasValue = typeof value === "string" && value.trim().length > 0;

  return (
    <div>
      {hasValue ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden group shadow-md border border-[#e6cb9c]/60">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-[#e6cb9c] bg-white/50 cursor-pointer hover:bg-[#bcf6f0]/20 hover:border-[#0f766e] transition-all group">
          {uploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
          ) : (
            <>
              <Upload size={22} className="text-[#4a4458]/50 group-hover:text-[#0f766e] transition-colors mb-1" />
              <span className="text-[10px] font-semibold text-[#4a4458]/70">Upload Image</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}

function MultiImageUpload({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: TemplateField;
  value: string[];
  onChange: (v: string[]) => void;
  onUpload: (key: string, file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const initialList =
    Array.isArray(value) && value.length > 0
      ? value
      : (field.default as unknown as string[]) || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(field.key, file);
      onChange([...initialList, url]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    onChange(initialList.filter((_, i) => i !== idx));
  };

  const max = field.max || 10;
  const validImages = initialList.filter((u) => typeof u === "string" && u.trim().length > 0);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {validImages.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group shadow-sm border border-[#e6cb9c]/60">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {validImages.length < max && (
          <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-[#e6cb9c] bg-white/50 cursor-pointer hover:border-[#0f766e] hover:bg-[#bcf6f0]/20 transition-all group">
            {uploading ? (
              <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full" />
            ) : (
              <>
                <Plus size={18} className="text-[#4a4458]/50 group-hover:text-[#0f766e] transition-colors mb-1" />
                <span className="text-[9px] font-semibold text-[#4a4458]/70">Add Photo</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
      <p className="text-xs text-[#4a4458]/60 mt-2 font-medium">
        {validImages.length}/{max} photos (min {field.min || 0})
      </p>
    </div>
  );
}

function VideoUpload({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
  onUpload: (key: string, file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(field.key, file);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return value ? (
    <div className="relative max-w-xs rounded-2xl overflow-hidden group shadow-md border border-[#e6cb9c]">
      <video src={value} controls className="w-full" />
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  ) : (
    <label className="flex items-center justify-center w-48 h-28 rounded-2xl border-2 border-dashed border-[#e6cb9c] bg-white/50 cursor-pointer hover:border-[#0f766e] transition-all gap-2 group">
      {uploading ? (
        <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
      ) : (
        <>
          <Video size={18} className="text-[#4a4458]/50 group-hover:text-[#0f766e]" />
          <span className="text-xs font-semibold text-[#4a4458]/70">Upload video</span>
        </>
      )}
      <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
    </label>
  );
}

function AudioUpload({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
  onUpload: (key: string, file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(field.key, file);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return value ? (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#e6cb9c]/60 shadow-xs">
      <audio src={value} controls className="flex-1 h-8" />
      <button
        type="button"
        onClick={() => onChange("")}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X size={14} className="text-gray-500" />
      </button>
    </div>
  ) : (
    <label className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-[#e6cb9c] bg-white/50 cursor-pointer hover:border-[#0f766e] transition-all group">
      {uploading ? (
        <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full" />
      ) : (
        <>
          <Music size={16} className="text-[#4a4458]/50 group-hover:text-[#0f766e]" />
          <span className="text-xs font-semibold text-[#4a4458]/70">Upload custom audio</span>
        </>
      )}
      <input type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
    </label>
  );
}

function MusicSelect({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = value || (field.default as string) || "royalty_free_1";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {(field.options || Object.keys(MUSIC_LIBRARY)).map((option) => {
        const isSel = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer shadow-xs"
            style={{
              backgroundColor: isSel ? "#bcf6f0" : "rgba(255,255,255,0.9)",
              border: isSel ? "1.5px solid #0f766e" : "1px solid rgba(230, 203, 156, 0.6)",
              color: isSel ? "#0f766e" : "#1e1b2e",
            }}
          >
            {MUSIC_LIBRARY[option] || option}
          </button>
        );
      })}
    </div>
  );
}

function TextArrayInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const min = field.min || 1;
  const max = field.max || 10;

  const currentList =
    Array.isArray(value) && value.length > 0
      ? value
      : (field.default as unknown as string[]) || [];

  const updateItem = (idx: number, text: string) => {
    const next = [...currentList];
    next[idx] = text;
    onChange(next);
  };

  const addItem = () => {
    if (currentList.length < max) {
      onChange([...currentList, ""]);
    }
  };

  const removeItem = (idx: number) => {
    if (currentList.length > min) {
      onChange(currentList.filter((_, i) => i !== idx));
    }
  };

  const autofillIdeas = () => {
    if (field.key === "reasons") {
      onChange(AI_PRESETS.romantic_reasons);
    } else if (field.key === "wishes") {
      onChange(AI_PRESETS.friendship_wishes);
    }
  };

  return (
    <div className="space-y-2.5">
      {field.key === "reasons" && (
        <div className="flex justify-end mb-1">
          <button
            type="button"
            onClick={autofillIdeas}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ebcae8]/60 hover:bg-[#ebcae8] text-[#86198f] transition-all cursor-pointer"
          >
            <Wand2 size={11} /> <span>Fill with AI Reasons</span>
          </button>
        </div>
      )}

      {currentList.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#4a4458]/60 w-5 text-right">{i + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={field.placeholders?.[i] || `Message or Reason ${i + 1}`}
            maxLength={field.maxLength}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e6cb9c]/60 text-[#1e1b2e] text-sm placeholder:text-[#4a4458]/40 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] font-medium"
          />
          {currentList.length > min && (
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Minus size={15} />
            </button>
          )}
        </div>
      ))}

      {currentList.length < max && (
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0f766e] hover:text-[#115e59] transition-colors mt-2 px-3 py-1.5 rounded-lg hover:bg-[#bcf6f0]/30 cursor-pointer"
        >
          <Plus size={14} /> Add another item ({currentList.length}/{max})
        </button>
      )}
    </div>
  );
}

function DateInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const displayVal = value || (field.default as string) || "2026-12-31T00:00";
  return (
    <input
      type="datetime-local"
      value={displayVal}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 rounded-xl bg-white border border-[#e6cb9c]/60 text-[#1e1b2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] transition-all font-medium shadow-xs"
    />
  );
}
