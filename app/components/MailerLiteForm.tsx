"use client";

import { useState } from "react";

export default function MailerLiteForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setSuccess(true);
      setEmail("");
    }
  }

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2  mt-4"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Join our mailing list"
          required
          autoComplete="email"
          className="
            flex-1
            bg-red
            border-2
            border-black
            px-4
            py-3
            text-black
            placeholder:text-black
            outline-none
          "
        />

        <button
          type="submit"
          className="
            bg-black
            text-cream
            px-6
            py-3
            font-bold
            border-2
            border-black
            hover:bg-red
          "
        >
          SUBSCRIBE
        </button>
      </form>

      {success && (
      <div className="mt-4 text-center">
        <span className="bg-black text-cream">
          Thanks for subscribing!
        </span>
      </div>
      )}
    </div>
  );
}