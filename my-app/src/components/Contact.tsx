import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ Failed: ${data.error || "Server error"}`);
      }
    } catch (err: any) {
      setStatus("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0b0f1a]">
      <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Contact Us
      </h2>
      <p className="mt-3 text-gray-300">We’d love to hear from you</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-lg space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none"
        ></textarea>
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status && <p className="mt-4 text-gray-200">{status}</p>}
    </div>
  );
}
