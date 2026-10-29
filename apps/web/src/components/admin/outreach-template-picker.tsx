"use client";

import type { MailTemplateRecord } from "@statin/types";
import Link from "next/link";
import { useState, useTransition, type KeyboardEvent } from "react";
import { createTemplateFromOutreach, removeTemplateFromOutreach } from "@/app/admin/mail-templates/actions";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt";
const smallButton =
  "inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-ink/15 px-4 text-sm font-medium transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Template row on the outreach page: pick a saved template (fills subject and
 * message), save the current subject and message as a new one, or delete the
 * selected one. Lives inside the outreach <form>, so every button is
 * type="button" and nothing here has a name (none of it is sent with the mail).
 */
export function OutreachTemplatePicker({
  templates,
  selectedId,
  subject,
  body,
  onSelect,
  onSaved,
  onDeleted,
}: {
  templates: MailTemplateRecord[];
  selectedId: string;
  subject: string;
  body: string;
  onSelect: (id: string) => void;
  onSaved: (template: MailTemplateRecord) => void;
  onDeleted: (id: string) => void;
}) {
  const [mode, setMode] = useState<"idle" | "saving" | "deleting">("idle");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = templates.find((template) => template.id === selectedId);
  const canSave = subject.trim() !== "" && body.trim().length >= 10;

  function openSave() {
    setName(subject.trim().slice(0, 80));
    setNotice(null);
    setMode("saving");
  }

  function save() {
    if (!name.trim() || pending) return;
    startTransition(async () => {
      const result = await createTemplateFromOutreach({ name, subject, body });
      if (!result.ok) {
        setNotice({ tone: "error", text: result.message });
        return;
      }
      onSaved(result.template);
      setMode("idle");
      setNotice({ tone: "ok", text: `Saved “${result.template.name}”.` });
    });
  }

  function remove() {
    if (!selected || pending) return;
    startTransition(async () => {
      const result = await removeTemplateFromOutreach(selected.id);
      if (!result.ok) {
        setNotice({ tone: "error", text: result.message ?? "Could not delete the template." });
        return;
      }
      onDeleted(selected.id);
      setMode("idle");
      setNotice({ tone: "ok", text: `Deleted “${selected.name}”. The subject and message stay as they are.` });
    });
  }

  // Enter in the name field saves the template instead of sending the mail.
  function onNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      setMode("idle");
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">Template</span>
        <Link href="/admin/mail-templates" className="text-xs text-mist transition-colors hover:text-ink">
          Manage templates →
        </Link>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <select
          aria-label="Template"
          value={selectedId}
          onChange={(event) => {
            setNotice(null);
            setMode("idle");
            onSelect(event.target.value);
          }}
          className={`${inputClass} sm:flex-1`}
        >
          <option value="">{templates.length > 0 ? "Write manually" : "No saved templates yet"}</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={openSave}
          disabled={!canSave || pending}
          title={canSave ? undefined : "Write a subject and message first"}
          className={smallButton}
        >
          Save as template
        </button>
        {selected ? (
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              setMode("deleting");
            }}
            disabled={pending}
            className={`${smallButton} border-danger/40 text-danger hover:border-danger hover:bg-danger hover:text-white`}
          >
            Delete
          </button>
        ) : null}
      </div>

      {mode === "saving" ? (
        <div className="mt-3 rounded-2xl border border-line bg-paper p-4">
          <label className="block">
            <span className="text-xs font-medium">Template name</span>
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={onNameKeyDown}
              maxLength={80}
              placeholder="Product introduction"
              className={`${inputClass} mt-1.5`}
            />
          </label>
          <p className="mt-2 text-xs text-mist">Saves the subject and message below as they are now.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!name.trim() || pending}
              className="inline-flex h-9 items-center rounded-full bg-cobalt px-4 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:opacity-60"
            >
              {pending ? "Saving" : "Save template"}
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {mode === "deleting" && selected ? (
        <div className="mt-3 rounded-2xl border border-danger/20 bg-white p-4">
          <p className="text-sm">
            Delete <span className="font-medium">“{selected.name}”</span>? Emails already sent are not affected.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="inline-flex h-9 items-center rounded-full bg-danger px-4 text-sm font-medium text-white disabled:opacity-60"
            >
              {pending ? "Deleting" : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm"
            >
              Keep it
            </button>
          </div>
        </div>
      ) : null}

      {notice ? (
        <p role="status" className={`mt-2 text-xs ${notice.tone === "error" ? "text-danger" : "text-emerald-700"}`}>
          {notice.text}
        </p>
      ) : (
        <p className="mt-2 text-xs text-mist">
          {templates.length > 0
            ? "Picking a template fills the subject and message below. You can still edit both before sending."
            : "Write a subject and message, then save them as a template to reuse next time."}
        </p>
      )}
    </div>
  );
}
