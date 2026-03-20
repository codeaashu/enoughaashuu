import { Button, Popover, TextArea, Tooltip } from "@heroui/react";
import { Comment } from "@gravity-ui/icons";
import { useEffect, useRef, useState } from "react";
import { createFeedbackFn } from "#/server/feedback.create";
import { trackEvent } from "#/lib/analytics";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, opts: object) => string;
      execute: (widgetId: string, opts?: object) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = "0x4AAAAAACsp6BY1heuKsB5N";

type Status = "idle" | "loading" | "success" | "error";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const widgetRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const tryRender = () => {
      if (!containerRef.current || !window.turnstile || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        execution: "execute",
        appearance: "interaction-only",
        callback: () => {}, // overridden per-submit
        "error-callback": () => {},
      });
    };

    if (window.turnstile) {
      tryRender();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) { clearInterval(interval); tryRender(); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getToken = (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!window.turnstile || !widgetRef.current) {
        return reject(new Error("Turnstile not ready"));
      }
      const id = widgetRef.current;
      window.turnstile.reset(id);
      // Re-render fresh widget with this submit's callbacks
      window.turnstile.remove(id);
      widgetRef.current = null;
      widgetRef.current = window.turnstile.render(containerRef.current!, {
        sitekey: TURNSTILE_SITE_KEY,
        execution: "execute",
        appearance: "interaction-only",
        callback: (t: string) => resolve(t),
        "error-callback": () => reject(new Error("Turnstile error")),
        "expired-callback": () => reject(new Error("Turnstile expired")),
      });
      const tid = setTimeout(() => reject(new Error("Turnstile timeout")), 15000);
      // Wrap resolve/reject to clear timeout
      const origResolve = resolve;
      resolve = (t) => { clearTimeout(tid); origResolve(t); };
      window.turnstile.execute(widgetRef.current);
    });

  const submit = async () => {
    if (!message.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const token = await getToken();
      await createFeedbackFn({ data: { message, token } });
      setStatus("success");
      setMessage("");
      trackEvent("feedback submitted");
      setTimeout(() => { setIsOpen(false); setStatus("idle"); }, 1500);
    } catch {
      setStatus("error");
      trackEvent("feedback failed");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setMessage("");
      setStatus("idle");
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    }
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <Button variant="outline" aria-label="Send feedback" data-umami-event="open feedback">
              <Comment width={18} height={18} />
              Feedback
            </Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content placement="left">
          <p className="text-xs">What's missing?</p>
        </Tooltip.Content>
      </Tooltip>

      <Popover.Content placement="left">
        <Popover.Dialog>
          <div className="flex w-72 flex-col gap-3">
            <p className="text-sm font-medium">Send feedback</p>
            <p className="text-xs text-muted">Any bugs, ideas, or requests?</p>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your feedback..."
              rows={4}
              className="resize-none"
              variant="secondary"
            />
            <div ref={containerRef} className="sr-only" />
            <Button
              size="sm"
              onPress={() => void submit()}
              isDisabled={!message.trim() || status === "loading" || status === "success" || status === "error"}
              className="w-full"
              data-umami-event="feedback submit"
            >
              {status === "loading" ? "Sending…" : status === "success" ? "Sent!" : status === "error" ? "Try again later" : "Send"}
            </Button>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
