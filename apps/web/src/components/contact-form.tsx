"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/app/actions";
import { initialInquiryState, type InquiryField } from "@/lib/inquiry";
import { inquiryOptions, site } from "@/lib/site";

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
      <div className="border border-line bg-white p-8 md:p-10">
        <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
          Brief received
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-tight text-balance">
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
          className="mt-8 inline-flex h-11 items-center border border-[#244df5]/30 px-4 text-sm font-medium text-[#244df5] transition-colors hover:bg-blue-50/50"
        >
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="relative border border-line bg-white p-6 md:p-10" noValidate>
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
          className="inline-flex h-12 items-center justify-center bg-[#244df5] px-5 text-sm font-medium tracking-wide text-white shadow-sm transition-colors hover:bg-[#1a3ee8] disabled:cursor-wait disabled:opacity-70"
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
  return `mt-2 w-full border bg-paper px-3 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 ${
    invalid ? "border-danger" : "border-line focus:border-[#244df5] focus:ring-1 focus:ring-[#244df5]"
  }`;
}
