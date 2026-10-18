"use client";

import Link from "next/link";
import { useActionState, useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { deleteTestimonial, saveTestimonial, type TestimonialFormState } from "@/app/admin/testimonials/actions";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";

export type TestimonialFormValues = {
  id?: string;
  name: string;
  description: string;
  quote: string;
  logo: string;
  sortOrder: number;
  published: boolean;
  highlight: boolean;
};

const MAX_UPLOAD_BYTES = 500 * 1024;
const LOGO_PX = 256;
const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";

const initialState: TestimonialFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt aria-invalid:border-danger";

function readAsDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Raster logos are scaled to fit 256px and stored as WebP; SVGs are kept as-is. */
async function logoToDataUrl(file: File) {
  if (file.type === "image/svg+xml") return readAsDataUrl(file);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, LOGO_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
  return readAsDataUrl(blob ?? file);
}

export function TestimonialForm({ initial }: { initial: TestimonialFormValues }) {
  const [state, action, pending] = useActionState(saveTestimonial, initialState);
  const [values, setValues] = useState(initial);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const formId = useId();

  const isUpload = values.logo.startsWith("data:");
  const errors = state.errors ?? {};
  const set = <K extends keyof TestimonialFormValues>(key: K, value: TestimonialFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function applyFile(file: File | undefined) {
    if (!file) return;
    setLogoError(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setLogoError("Use a PNG, JPG, WebP, or SVG image.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setLogoError("Logo must be 500 KB or smaller.");
      return;
    }
    try {
      set("logo", await logoToDataUrl(file));
    } catch {
      setLogoError("Could not read that image. Try another file.");
    }
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    void applyFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form id={formId} action={action} className="space-y-6 lg:col-span-7">
        {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
        <input type="hidden" name="logo" value={values.logo} />

        <Field label="Business name" error={errors.name}>
          <input
            name="name"
            required
            maxLength={80}
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Business description" hint="Industry, size, or one-line company context." error={errors.description}>
          <input
            name="description"
            maxLength={120}
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="B2B software · Series B"
            aria-invalid={errors.description ? true : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Quote" error={errors.quote}>
          <textarea
            name="quote"
            required
            minLength={10}
            maxLength={600}
            rows={5}
            value={values.quote}
            onChange={(event) => set("quote", event.target.value)}
            aria-invalid={errors.quote ? true : undefined}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Sort order" hint="Lower numbers appear first." error={errors.sortOrder}>
            <input
              name="sortOrder"
              type="number"
              step={1}
              value={values.sortOrder}
              onChange={(event) => set("sortOrder", event.target.valueAsNumber || 0)}
              aria-invalid={errors.sortOrder ? true : undefined}
              className={inputClass}
            />
          </Field>
          <div className="space-y-3 sm:pt-9">
            <Check
              name="published"
              label="Published on home page"
              checked={values.published}
              onChange={(checked) => set("published", checked)}
            />
            <Check
              name="highlight"
              label="Highlight card (accent border)"
              checked={values.highlight}
              onChange={(checked) => set("highlight", checked)}
            />
          </div>
        </div>

        {state.message ? (
          <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cobalt px-6 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Saving" : values.id ? "Save changes" : "Add testimonial"}
          </button>
          <Link
            href="/admin/testimonials"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium transition-colors hover:border-ink"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="space-y-6 lg:col-span-5">
        <div>
          <p className="text-sm font-medium">Business logo</p>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              void applyFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-2 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? "border-cobalt bg-cobalt/5" : "border-line bg-white hover:border-cobalt/50"
            }`}
          >
            <span className="font-medium">Click or drag logo here</span>
            <span className="mt-1 text-sm text-mist">PNG, JPG, WebP, or SVG · up to 500 KB</span>
          </button>

          {values.logo ? (
            <div className="mt-3 flex items-center gap-4 rounded-2xl border border-line bg-white p-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={values.logo} alt="" className="h-full w-full object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Logo ready</span>
                <span className="block truncate text-xs text-mist">
                  {isUpload ? "Uploaded from your computer" : values.logo}
                </span>
              </span>
              <button
                type="button"
                onClick={() => set("logo", "")}
                className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm transition-colors hover:border-ink"
              >
                Remove
              </button>
            </div>
          ) : null}

          <label className="mt-5 block">
            <span className="text-sm font-medium">Or paste logo URL</span>
            <input
              type="url"
              inputMode="url"
              placeholder="https://example.com/logo.png"
              value={isUpload ? "" : values.logo}
              onChange={(event) => {
                setLogoError(null);
                set("logo", event.target.value.trim());
              }}
              aria-invalid={logoError || errors.logo ? true : undefined}
              className={inputClass}
            />
          </label>
          <p className={`mt-2 text-xs ${logoError || errors.logo ? "text-danger" : "text-mist"}`}>
            {logoError ?? errors.logo ?? "Leave empty to show an initials placeholder on the home page."}
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-paper-deep p-5">
          <p className="t-eyebrow text-mist">Card preview</p>
          <div className="mt-4">
            <TestimonialCard item={values} />
          </div>
          {!values.published ? <p className="mt-3 text-xs text-mist">Draft: not shown on the home page.</p> : null}
        </div>

        {values.id ? (
          <form action={deleteTestimonial} className="rounded-2xl border border-danger/20 bg-white p-5">
            <input type="hidden" name="id" value={values.id} />
            <p className="text-sm font-medium">Delete testimonial</p>
            <p className="mt-1 text-xs text-mist">Removes it from the home page and the database.</p>
            {confirmDelete ? (
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-full bg-danger px-4 text-sm font-medium text-white"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm"
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-4 inline-flex h-9 items-center rounded-full border border-danger/40 px-4 text-sm text-danger transition-colors hover:bg-danger hover:text-white"
              >
                Delete
              </button>
            )}
          </form>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-mist">{hint}</span>
      ) : null}
    </label>
  );
}

function Check({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-cobalt"
      />
      {label}
    </label>
  );
}
