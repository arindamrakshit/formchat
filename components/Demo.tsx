"use client";
import ChatForm from "./ChatForm";
import type { PublicForm } from "@/lib/types";

const demo: PublicForm = {
  title: "Quick feedback", color: "#4f46e5",
  welcome: "Hi! 👋 This is a live demo. Try answering.",
  completion: "That's it, thanks! (Demo answers aren't saved.) 🎉",
  questions: [
    { id: "n", type: "text", label: "What's your name?", required: true },
    { id: "e", type: "email", label: "What's your email?", required: true },
    { id: "c", type: "choice", label: "What would you use FormChat for?", required: false, options: ["Lead capture", "Surveys", "Support intake"] },
    { id: "y", type: "yesno", label: "Want to try it for real?", required: true },
  ],
};

export default function Demo() {
  return <div className="mx-auto h-[480px] w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl"><ChatForm form={demo} onSubmit={async () => {}} /></div>;
}
