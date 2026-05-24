"use client";

import { useState } from "react";

export type SeoFormValues = {
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
};

type SeoFieldsProps = {
  values: SeoFormValues;
  onChange: (values: SeoFormValues) => void;
};

export default function SeoFields({ values, onChange }: SeoFieldsProps) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof SeoFormValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-700"
      >
        SEO Settings
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-gray-200 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              value={values.metaTitle ?? ""}
              onChange={(e) => update("metaTitle", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={values.metaDesc ?? ""}
              onChange={(e) => update("metaDesc", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <input
              type="text"
              value={values.keywords ?? ""}
              onChange={(e) => update("keywords", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              OG Image URL
            </label>
            <input
              type="url"
              value={values.ogImage ?? ""}
              onChange={(e) => update("ogImage", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Canonical URL
            </label>
            <input
              type="url"
              value={values.canonicalUrl ?? ""}
              onChange={(e) => update("canonicalUrl", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
