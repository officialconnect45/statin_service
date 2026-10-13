"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/app/actions";
import { initialInquiryState, type InquiryField } from "@/lib/inquiry";
import { inquiryOptions } from "@/lib/inquiry-options";
import { site } from "@/lib/site";

export function ContactForm() {
  const [epoch, setEpoch] = useState(0);

  return (
    <InquiryForm key={epoch} onAnother={() => setEpoch((value) => value + 1)} />
  );
}

function InquiryForm({ onAnother }: { onAnother: () => void }) {
  const [state, action, pending] = useActionState(
    submitInquiry,
    initialInquiryState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-ink md:p-12" role="status">
        <p className="t-eyebrow text-cobalt">Brief received</p>
        <h2 className="mt-5 text-3xl font-medium tracking-tight text-balance md:text-4xl">
          {state.message}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
          If you would rather start in your own inbox, write to{" "}
          <a className="text-ink underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onAnother}
          className="mt-8 inline-flex h-11 items-center rounded-full border border-cobalt/30 px-5 text-sm font-medium text-cobalt transition-colors hover:bg-cobalt hover:text-white"
        >
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="relative rounded-3xl border border-line bg-white p-6 text-ink shadow-[0_40px_80px_-40px_rgb(6_9_20/0.5)] md:p-10" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          error={state.errors?.name}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          error={state.errors?.email}
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          error={state.errors?.company}
        />
        <SelectField
          label="What do you want to build?"
          name="practice"
          placeholder="Select a practice"
          options={inquiryOptions.practices}
          error={state.errors?.practice}
        />
        <SelectField
          label="Stage"
          name="stage"
          placeholder="Where are you now?"
          options={inquiryOptions.stages}
        />
        <SelectField
          label="Timing"
          name="timeline"
          placeholder="When should it exist?"
          options={inquiryOptions.timelines}
        />
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-medium">What are you building?</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={20}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          className={inputClass(Boolean(state.errors?.message))}
          placeholder="The offer, who it is for, and what has to be true on launch day."
        />
        {state.errors?.message ? (
          <FieldError id="message-error">{state.errors.message}</FieldError>
        ) : null}
      </label>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company URL
          <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && state.message ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full bg-cobalt px-6 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending the brief" : "Send the brief"}
        </button>
        <p className="max-w-xs text-xs leading-relaxed text-mist">
          We use this only to reply. We do not add you to a mailing list.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: InquiryField;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(Boolean(error))}
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  error?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        name={name}
        defaultValue=""
        required={name === "practice"}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(Boolean(error))}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <span id={id} className="mt-1.5 block text-xs text-danger">
      {children}
    </span>
  );
}

function inputClass(invalid: boolean) {
  return `mt-2 w-full rounded-xl border bg-paper px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-mist ${
    invalid ? "border-danger" : "border-line focus:border-cobalt focus:ring-1 focus:ring-cobalt"
  }`;
}
