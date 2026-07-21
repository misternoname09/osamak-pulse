import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant compatibilité sanguine — OSAMAK" },
      { name: "description", content: "Posez vos questions sur la compatibilité des groupes sanguins et obtenez des conseils pratiques adaptés au Sénégal." },
      { property: "og:title", content: "Assistant compatibilité sanguine — OSAMAK" },
      { property: "og:description", content: "Chatbot expert en transfusion sanguine : qui peut donner à qui, où donner au CNTS Dakar." },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "Je suis O+, à qui puis-je donner ?",
  "De qui peut recevoir un patient AB- ?",
  "Où donner mon sang à Dakar ?",
];

function AssistantPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const initialMessages: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text:
            "Bonjour 👋 Je suis votre assistant OSAMAK sur la **compatibilité sanguine**. Indiquez-moi votre groupe (ex. O+, AB-) et je vous dirai à qui vous pouvez donner ou de qui vous pouvez recevoir.",
        },
      ],
    },
  ];

  const { messages, sendMessage, status } = useChat({
    id: "osamak-assistant",
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await sendMessage({ text: trimmed });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <span>🩸</span> Assistant OSAMAK
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Compatibilité sanguine
          </h1>
          <p className="mt-2 text-muted-foreground">
            Un assistant IA pour vous guider sur les dons et transfusions au Sénégal.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-[70vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={"flex " + (isUser ? "justify-end" : "justify-start")}>
                  <div
                    className={
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed " +
                      (isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm")
                    }
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-2 prose-strong:text-foreground">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/50 hover:text-primary transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 flex items-end gap-2 bg-background"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ex : Je suis A+, à qui puis-je donner ?"
              className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition"
            >
              Envoyer
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-center text-muted-foreground">
          Cet assistant fournit une information générale. Consultez toujours un professionnel de santé au CNTS ou en hôpital.
        </p>
      </section>
    </SiteLayout>
  );
}
