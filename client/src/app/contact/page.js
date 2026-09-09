"use client"

import { useState } from "react";

// No real inbox is wired up yet - this simulates a send to a placeholder
// address so the page is functional and demo-able before a mail service
// is connected on the backend.
const CONTACT_EMAIL = "hello@trivianightextravaganza.com";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | sent

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (status === "sending") return;
        setStatus("sending");

        // Simulated send - swap for a real request once a contact
        // endpoint exists.
        setTimeout(() => {
            setStatus("sent");
            setForm({ name: "", email: "", message: "" });
        }, 600);
    }

    return (
        <div className="marketing-page page-container overflow-y-auto">
            <p className="label-caps-accent">
                Get in touch
            </p>
            <h1 className="mt-2 text-3xl heading sm:text-4xl">
                Contact Us
            </h1>
            <p className="mt-4 max-w-xl text-secondary">
                Question, bug report, or a theme you want to see next? Send it our way and
                it'll land in {CONTACT_EMAIL}.
            </p>

            {status === "sent" ? (
                <div className="mt-8 max-w-md card p-6">
                    <p className="heading">Message sent.</p>
                    <p className="mt-1 text-sm text-muted">
                        Thanks for reaching out — we'll get back to you soon.
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-4 text-sm btn-link"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex max-w-md flex-col gap-4 card p-6"
                >
                    <label className="flex flex-col gap-1 field-label">
                        Name
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="input-field px-3 py-2"
                            placeholder="Your name"
                        />
                    </label>

                    <label className="flex flex-col gap-1 field-label">
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="input-field px-3 py-2"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="flex flex-col gap-1 field-label">
                        Message
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="input-field px-3 py-2"
                            placeholder="What's on your mind?"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="rounded-lg bg-[var(--tn-pink)] px-4 py-3 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60"
                    >
                        {status === "sending" ? "Sending..." : "Send Message"}
                    </button>
                </form>
            )}
        </div>
    );
}