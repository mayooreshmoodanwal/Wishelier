"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
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

export default function DynamicForm({
  schema,
  values,
  onChange,
  onMediaUpload,
}: DynamicFormProps) {
  return (
    <div className="space-y-6">
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
      className="rounded-xl bg-white/5 border border-white/10 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
        <Icon size={16} className="text-pink-400" />
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
      </label>

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
        <p className="text-xs text-white/40 mt-2">{field.note}</p>
      )}
    </motion.div>
  );
}

// --- Field Components ---

function TextInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value || field.default || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || ""}
      maxLength={field.maxLength}
      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
    />
  );
}

function LongTextInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <textarea
        value={value || field.default || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ""}
        maxLength={field.maxLength}
        rows={5}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-y"
      />
      {field.maxLength && (
        <p className="text-right text-xs text-white/30 mt-1">
          {(value || "").length}/{field.maxLength}
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
        <div className="relative w-32 h-32 rounded-xl overflow-hidden group">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-pink-400/50 transition-colors">
          {uploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full" />
          ) : (
            <Upload size={24} className="text-white/30" />
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(field.key, file);
      onChange([...value, url]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const max = field.max || 10;

  const validImages = (value || []).filter((u) => typeof u === "string" && u.trim().length > 0);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {validImages.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}
        {validImages.length < max && (
          <label className="flex items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-white/20 cursor-pointer hover:border-pink-400/50 transition-colors">
            {uploading ? (
              <div className="animate-spin w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full" />
            ) : (
              <Plus size={20} className="text-white/30" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
      <p className="text-xs text-white/30 mt-2">
        {value.length}/{max} images (min {field.min || 0})
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
    <div className="relative max-w-xs rounded-xl overflow-hidden group">
      <video src={value} controls className="w-full" />
      <button
        onClick={() => onChange("")}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} className="text-white" />
      </button>
    </div>
  ) : (
    <label className="flex items-center justify-center w-48 h-32 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-pink-400/50 transition-colors gap-2">
      {uploading ? (
        <div className="animate-spin w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full" />
      ) : (
        <>
          <Video size={20} className="text-white/30" />
          <span className="text-xs text-white/30">Upload video</span>
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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
      <audio src={value} controls className="flex-1 h-8" />
      <button onClick={() => onChange("")} className="p-1 rounded-full hover:bg-white/10 transition-colors">
        <X size={14} className="text-white/60" />
      </button>
    </div>
  ) : (
    <label className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed border-white/20 cursor-pointer hover:border-pink-400/50 transition-colors">
      {uploading ? (
        <div className="animate-spin w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full" />
      ) : (
        <>
          <Music size={16} className="text-white/30" />
          <span className="text-sm text-white/30">Upload audio</span>
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {(field.options || Object.keys(MUSIC_LIBRARY)).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="px-4 py-3 rounded-lg text-sm text-left transition-all"
          style={{
            backgroundColor: value === option ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.03)",
            border: value === option ? "1px solid rgba(244,114,182,0.5)" : "1px solid rgba(255,255,255,0.08)",
            color: value === option ? "#f472b6" : "rgba(255,255,255,0.6)",
          }}
        >
          {MUSIC_LIBRARY[option] || option}
        </button>
      ))}
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

  const updateItem = (idx: number, text: string) => {
    const next = [...value];
    next[idx] = text;
    onChange(next);
  };

  const addItem = () => {
    if (value.length < max) {
      onChange([...value, ""]);
    }
  };

  const removeItem = (idx: number) => {
    if (value.length > min) {
      onChange(value.filter((_, i) => i !== idx));
    }
  };

  // Initialize with minimum items
  React.useEffect(() => {
    if (value.length < min) {
      onChange([...value, ...Array(min - value.length).fill("")]);
    }
  }, []);

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-white/30 w-6 text-right">{i + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={field.placeholders?.[i] || `Item ${i + 1}`}
            maxLength={field.maxLength}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          {value.length > min && (
            <button
              onClick={() => removeItem(i)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <Minus size={14} className="text-red-400" />
            </button>
          )}
        </div>
      ))}
      {value.length < max && (
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 transition-colors mt-2"
        >
          <Plus size={14} /> Add another ({value.length}/{max})
        </button>
      )}
    </div>
  );
}

function DateInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="datetime-local"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
    />
  );
}
