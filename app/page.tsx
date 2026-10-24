import Link from "next/link";
import Demo from "@/components/Demo";

const features = [
  ["💬", "Chat-style forms", "Ask one question at a time in a friendly conversation that people actually finish."],
  ["🧩", "Simple builder", "Text, email, multiple choice and yes/no. Reorder, require and preview in seconds."],
  ["🔗", "Share or embed", "Every form gets a public link, plus a one-line script for a floating widget."],
  ["📥", "Responses dashboard", "See every submission with timestamps, and publish or unpublish any time."],
];
const steps = ["Build your form", "Publish it", "Share the link or paste the snippet", "Review responses in your dashboard"];

export default function Home() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="text-lg font-bold text-indigo-600">FormChat</span>
        <nav className="flex items-center gap-4 text-sm"><a href="#features" className="hidden sm:block">Features</a><a href="#how">How it works</a><Link href="/dashboard" className="btn-primary">Dashboard</Link></nav>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Forms that feel like a conversation</h1>
        <p className="mt-5 text-lg text-gray-600">Build chat-style forms, embed a widget on any website, and collect responses in one simple dashboard.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/dashboard" className="btn-primary px-6 py-3">Get started</Link><a href="#demo" className="btn-ghost px-6 py-3">Try the demo</a></div>
      </section>
      <section id="features" className="bg-gray-50 py-16"><div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold">Everything you need</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([i, t, d]) => (<div key={t} className="rounded-xl border bg-white p-5"><div className="text-2xl">{i}</div><h3 className="mt-2 font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-600">{d}</p></div>))}
        </div></div></section>
      <section id="how" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-4">
          {steps.map((s, k) => (<li key={s} className="rounded-xl border p-4 text-center"><div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{k + 1}</div><p className="text-sm">{s}</p></li>))}
        </ol></section>
      <section id="demo" className="bg-gray-50 px-4 py-16"><h2 className="mb-8 text-center text-3xl font-bold">Live chatbot demo</h2><Demo /></section>
      <footer className="py-8 text-center text-sm text-gray-500">© FormChat</footer>
    </>
  );
}
