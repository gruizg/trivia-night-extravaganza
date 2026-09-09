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
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--tn-pink)]">
                Get in touch
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Contact Us
            </h1>
            <p className="mt-4 max-w-xl text-gray-700 dark:text-gray-300">
                Question, bug report, or a theme you want to see next? Send it our way and
                it'll land in {CONTACT_EMAIL}.
            </p>

            {status === "sent" ? (
                <div className="mt-8 max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="font-bold text-gray-900 dark:text-white">Message sent.</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Thanks for reaching out — we'll get back to you soon.
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-4 text-sm font-bold text-[var(--tn-pink)] hover:underline"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Name
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Your name"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Message
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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