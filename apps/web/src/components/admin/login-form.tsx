"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-night px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-fog/60 focus:border-signal focus:ring-1 focus:ring-signal";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Username</span>
        <input
          name="username"
          type="text"
          required
          autoComplete="username"
          defaultValue="superadmin"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className={inputClass}
        />
      </label>
      {state.error ? (
        <p id="login-error" role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-cobalt text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
