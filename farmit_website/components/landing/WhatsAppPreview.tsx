"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  Mic,
  Plus,
  SendHorizontal,
} from "lucide-react";
import logo from "@/assets/farmit-logo.png";

type Turn = {
  from: "bot" | "user";
  text: string;
};

type ChatMessage = Turn & {
  id: string;
  ticks: 0 | 1 | 2 | 3;
};

const SCRIPT: Turn[] = [
  { from: "user", text: "Hie. Yellow spots on my maize leaves." },
  {
    from: "bot",
    text: "Hi. I am **FarmIT**, your farming assistant for Zimbabwe.\n\nSend a clear photo of the affected leaf — front and back if you can.",
  },
  { from: "user", text: "Sent the photo." },
  {
    from: "bot",
    text: "This looks like **northern leaf blight** on maize.\n\n**Chemical:** a registered fungicide on the label.\n**Organic:** remove badly affected leaves and improve spacing.",
  },
  { from: "user", text: "Should I spray today?" },
  {
    from: "bot",
    text: "If more than a third of the plant is spotted, treat this week. Follow the product label and Zimbabwean law.\n\nNeed a shop near Chiredzi? Reply **shop**.",
  },
];

const TIME = "09:18";

const WALLPAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1.2' opacity='0.07'%3E%3Cpath d='M24 38c8-10 22-8 28 2 4 8 2 18-6 24-10 8-24 4-28-8-3-8 0-14 6-18z'/%3E%3Cpath d='M160 52c12 0 20 10 18 22-2 10-12 16-22 14-12-2-18-14-14-24 3-8 10-12 18-12z'/%3E%3Cpath d='M70 128l18-8 8 18-18 8z'/%3E%3Ccircle cx='48' cy='176' r='10'/%3E%3Cpath d='M178 150c14 4 18 18 10 28-8 10-24 8-30-4-5-10 4-28 20-24z'/%3E%3Cpath d='M110 28c6 0 10 8 6 14s-14 6-16 0 4-14 10-14z'/%3E%3Cpath d='M30 92h22m-11-11v22'/%3E%3Cpath d='M132 186c8-6 20-2 22 8 2 8-6 16-14 16-10 0-16-10-8-24z'/%3E%3C/g%3E%3C/svg%3E\")";

function createClock() {
  const timers = new Map<number, () => void>();
  let cancelled = false;

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      if (cancelled) {
        resolve();
        return;
      }
      const id = window.setTimeout(() => {
        timers.delete(id);
        resolve();
      }, ms);
      timers.set(id, resolve);
    });

  const cancel = () => {
    cancelled = true;
    timers.forEach((resolve, id) => {
      window.clearTimeout(id);
      resolve();
    });
    timers.clear();
  };

  return {
    wait,
    cancel,
    get cancelled() {
      return cancelled;
    },
  };
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) {
          return (
            <strong key={index} className="font-semibold">
              {bold[1]}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function Ticks({ ticks }: { ticks: ChatMessage["ticks"] }) {
  if (ticks <= 0) return null;
  if (ticks === 1) {
    return <Check className="h-3 w-3 text-[#8696a0]" strokeWidth={2.4} />;
  }
  return (
    <CheckCheck
      className={`h-3.5 w-3.5 ${ticks >= 3 ? "text-[#53bdeb]" : "text-[#8696a0]"}`}
      strokeWidth={2.4}
    />
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} wa-bubble-in`}>
      <div
        className={`relative max-w-[86%] px-2.5 pb-1.5 pt-1.5 text-[13px] leading-[1.35] text-[#e9edef] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] ${
          isUser
            ? "rounded-[7.5px] rounded-tr-[2px] bg-[#005c4b]"
            : "rounded-[7.5px] rounded-tl-[2px] bg-[#202c33]"
        }`}
      >
        <p className="whitespace-pre-wrap pr-10">
          <RichText text={message.text} />
        </p>
        <span className="absolute bottom-1 right-1.5 flex items-center gap-0.5 text-[10px] leading-none text-[#8696a0]">
          {TIME}
          {isUser ? <Ticks ticks={message.ticks} /> : null}
        </span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start wa-bubble-in">
      <div className="flex items-center gap-1 rounded-[7.5px] rounded-tl-[2px] bg-[#202c33] px-3 py-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="wa-dot h-1.5 w-1.5 rounded-full bg-[#8696a0]"
            style={{ animationDelay: `${dot * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WhatsAppPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [headerTyping, setHeaderTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, botTyping, composer]);

  useEffect(() => {
    const clock = createClock();
    let seq = 0;

    const stillActive = () => !clock.cancelled;

    const run = async () => {
      while (stillActive()) {
        setMessages([]);
        setComposer("");
        setBotTyping(false);
        setHeaderTyping(false);
        await clock.wait(700);
        if (!stillActive()) return;

        for (let index = 0; index < SCRIPT.length; index += 1) {
          if (!stillActive()) return;
          const turn = SCRIPT[index];

          if (turn.from === "user") {
            for (let i = 1; i <= turn.text.length; i += 1) {
              if (!stillActive()) return;
              setComposer(turn.text.slice(0, i));
              await clock.wait(42 + Math.floor(Math.random() * 36));
            }
            await clock.wait(320);
            if (!stillActive()) return;

            seq += 1;
            const id = `user-${index}-${seq}`;
            setComposer("");
            setMessages((prev) => [...prev, { ...turn, id, ticks: 1 }]);
            await clock.wait(180);
            if (!stillActive()) return;
            setMessages((prev) =>
              prev.map((item) => (item.id === id ? { ...item, ticks: 2 } : item))
            );
            await clock.wait(420);
            if (!stillActive()) return;
            setMessages((prev) =>
              prev.map((item) => (item.id === id ? { ...item, ticks: 3 } : item))
            );
            await clock.wait(280);
          } else {
            setHeaderTyping(true);
            await clock.wait(380);
            if (!stillActive()) return;
            setBotTyping(true);
            await clock.wait(980 + Math.min(turn.text.length * 12, 1400));
            if (!stillActive()) return;
            setBotTyping(false);
            setHeaderTyping(false);
            seq += 1;
            setMessages((prev) => [
              ...prev,
              { ...turn, id: `bot-${index}-${seq}`, ticks: 0 },
            ]);
            await clock.wait(560);
          }
        }

        await clock.wait(4200);
      }
    };

    void run();

    return () => {
      clock.cancel();
    };
  }, []);

  const sending = composer.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[320px]">
      <div className="relative overflow-hidden rounded-[2.1rem] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.55)]">
        <div className="absolute -left-[13px] top-[7.5rem] h-8 w-[3px] rounded-l-sm bg-[#2a2a2a]" />
        <div className="absolute -left-[13px] top-[10.5rem] h-12 w-[3px] rounded-l-sm bg-[#2a2a2a]" />
        <div className="absolute -right-[13px] top-[9.5rem] h-16 w-[3px] rounded-r-sm bg-[#2a2a2a]" />

        <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[1.45rem] bg-[#0b141a] font-[system-ui,-apple-system,sans-serif] sm:h-[600px]">
          <div className="absolute left-1/2 top-2 z-30 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

          <div className="relative z-20 flex items-end justify-between bg-[#1f2c34] px-5 pb-1 pt-2 text-[11px] font-semibold text-white">
            <span>{TIME}</span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-wide">
              <span>LTE</span>
              <span className="inline-block h-2.5 w-4 rounded-[1px] border border-white/80">
                <span className="block h-full w-[70%] bg-white" />
              </span>
            </span>
          </div>

          <header className="relative z-10 flex items-center gap-2 bg-[#1f2c34] px-2 pb-2.5 pt-1.5">
            <ArrowLeft className="h-5 w-5 shrink-0 text-white" strokeWidth={2.2} />
            <span className="text-[11px] font-semibold text-white/80">469</span>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#f5b7c5]">
              <Image
                src={logo}
                alt=""
                width={28}
                height={28}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-tight text-white">
                Farmit
              </p>
              <p className="text-[11px] leading-tight text-[#8696a0]">
                {headerTyping ? "typing…" : "online"}
              </p>
            </div>
          </header>

          <div
            ref={scrollerRef}
            className="relative flex-1 space-y-[3px] overflow-y-auto px-2 py-2"
            style={{
              backgroundColor: "#0b141a",
              backgroundImage: WALLPAPER,
              backgroundSize: "220px 220px",
            }}
          >
            <p className="mx-auto mb-2 max-w-[92%] rounded-md bg-[#182229]/90 px-2 py-1.5 text-center text-[11px] leading-snug text-[#00a884]">
              This business uses a secure service from Meta to manage this chat.
              Tap to learn more.
            </p>
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {botTyping ? <TypingBubble /> : null}
          </div>

          <div className="flex items-center gap-1.5 bg-[#1f2c34] px-1.5 py-1.5">
            <button
              type="button"
              tabIndex={-1}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[#8696a0]"
              aria-hidden
            >
              <Plus className="h-6 w-6" strokeWidth={1.8} />
            </button>
            <div className="flex h-9 min-w-0 flex-1 items-center rounded-full bg-[#2a3942] px-3.5 text-[14px] text-[#e9edef]">
              {composer}
            </div>
            {sending ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
                <SendHorizontal className="h-4 w-4" strokeWidth={2.4} />
              </div>
            ) : (
              <>
                <Camera className="mx-0.5 h-5 w-5 shrink-0 text-[#8696a0]" strokeWidth={1.8} />
                <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#8696a0]">
                  <Mic className="h-5 w-5" strokeWidth={1.8} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
