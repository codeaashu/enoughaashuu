import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { getRequestIP } from "@tanstack/react-start/server";

interface RateLimiter {
  limit: (opts: { key: string }) => Promise<{ success: boolean }>;
}

export const createFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { message: string; token: string })
  .handler(async ({ data }) => {
    const cfEnv = env as {
      FEEDBACK_RL?: RateLimiter;
      TURNSTILE_SECRET?: string;
      TELEGRAM_BOT_TOKEN?: string;
      TELEGRAM_CHAT_ID?: string;
    };

    // Turnstile verification
    if (cfEnv.TURNSTILE_SECRET) {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: cfEnv.TURNSTILE_SECRET, response: data.token }),
      });
      const result = await res.json<{ success: boolean; "error-codes"?: string[] }>();
      if (!result.success) throw new Error(`Turnstile failed: ${result["error-codes"]?.join(", ")}`);
    }

    // Rate limiting
    const ip = getRequestIP() ?? "unknown";
    if (cfEnv.FEEDBACK_RL) {
      const { success } = await cfEnv.FEEDBACK_RL.limit({ key: ip });
      if (!success) throw new Error("Too many requests");
    }

    const message = String(data.message ?? "").trim().slice(0, 2000);
    if (!message) throw new Error("Empty feedback");

    // Send via Telegram
    const botToken = cfEnv.TELEGRAM_BOT_TOKEN;
    const chatId = cfEnv.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) throw new Error("Telegram not configured");

    const text = `💬 *New Feedback*\n\n${message}`;
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });

    if (!res.ok) throw new Error("Failed to send Telegram message");

    return { ok: true };
  });
