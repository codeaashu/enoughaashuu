"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  Copy,
  Download,
  FileCode2,
  ImageUp,
  LocateFixed,
  Phone,
  QrCode,
  RefreshCcw,
  Smartphone,
  Text,
  UserRound,
  Wifi,
} from "lucide-react";

type TabKey = "text" | "wifi" | "vcard" | "event" | "phone" | "sms" | "geo";
type GradientType = "linear" | "radial" | "single";
type DotStyle = "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
type CornerSquareStyle = "" | "dot" | "square" | "extra-rounded";
type CornerDotStyle = "" | "dot" | "square";

type QRCodeInstance = {
  append: (el: HTMLElement) => void;
  update: (options: Record<string, unknown>) => void;
  download: (options: { name: string; extension: "png" | "svg" }) => void;
  getRawData: (extension: "png" | "svg") => Promise<Blob>;
  _options?: { width?: number; height?: number };
};

const TAB_LABELS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "text", label: "Text / URL", icon: Text },
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "vcard", label: "vCard", icon: UserRound },
  { key: "event", label: "Event", icon: CalendarClock },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "sms", label: "SMS", icon: Smartphone },
  { key: "geo", label: "Geo", icon: LocateFixed },
];

const DOT_STYLES: DotStyle[] = ["dots", "rounded", "classy", "classy-rounded", "square", "extra-rounded"];
const CORNER_SQUARE_STYLES: CornerSquareStyle[] = ["", "dot", "square", "extra-rounded"];
const CORNER_DOT_STYLES: CornerDotStyle[] = ["", "dot", "square"];
const GRADIENT_TYPES: GradientType[] = ["linear", "radial", "single"];

const formatICalDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
};

const sanitizeFilename = (text: string) => {
  const sanitizedText = text
    ? text
        .toLowerCase()
        .replace(/https?:\/\//, "")
        .replace(/[^a-z0-9]/g, "_")
        .replace(/__+/g, "_")
        .slice(0, 30)
    : "qrcode";
  return `qr-code-${sanitizedText}`;
};

const randomHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

export default function QrCodeGenerator() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);
  const qrRef = useRef<QRCodeInstance | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("text");
  const [lightPreviewBg, setLightPreviewBg] = useState(true);

  const [textValue, setTextValue] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  const [vcardFirstName, setVcardFirstName] = useState("");
  const [vcardLastName, setVcardLastName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");

  const [eventSummary, setEventSummary] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [geoLat, setGeoLat] = useState("");
  const [geoLon, setGeoLon] = useState("");

  const [color1, setColor1] = useState("#818cf8");
  const [color2, setColor2] = useState("#c084fc");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [dotStyle, setDotStyle] = useState<DotStyle>("dots");
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareStyle>("");
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotStyle>("");

  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [currentFilename, setCurrentFilename] = useState("qrcode");
  const [isDataValid, setIsDataValid] = useState(false);
  const [busyAction, setBusyAction] = useState<"embed" | "copy" | "print" | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const tabPayload = useMemo(() => {
    let data = "";
    let filenameText = "";

    switch (activeTab) {
      case "wifi":
        filenameText = wifiSsid;
        data = `WIFI:S:${filenameText};T:${wifiEncryption};P:${wifiPass};;`;
        break;
      case "vcard":
        filenameText = `${vcardFirstName}_${vcardLastName}`;
        data = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName};${vcardFirstName}\nFN:${vcardFirstName} ${vcardLastName}\nTEL;TYPE=CELL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
        break;
      case "sms":
        filenameText = smsPhone;
        data = `SMSTO:${filenameText}:${smsMessage}`;
        break;
      case "event":
        filenameText = eventSummary;
        data = `BEGIN:VEVENT\nSUMMARY:${filenameText}\nDTSTART:${formatICalDate(eventStart)}\nDTEND:${formatICalDate(eventEnd)}\nLOCATION:${eventLocation}\nEND:VEVENT`;
        break;
      case "geo":
        filenameText = `geo_${geoLat}_${geoLon}`;
        data = `geo:${geoLat},${geoLon}`;
        break;
      case "phone":
        filenameText = phoneNumber;
        data = `tel:${filenameText}`;
        break;
      default:
        filenameText = textValue;
        data = filenameText || "https://removebanana.aashuu.tech/";
        break;
    }

    const isDataEmpty =
      !data.trim() || data.includes("::") || (data.length < 25 && (activeTab === "vcard" || activeTab === "event"));

    return {
      data,
      filename: sanitizeFilename(filenameText),
      isDataEmpty,
    };
  }, [
    activeTab,
    wifiSsid,
    wifiEncryption,
    wifiPass,
    vcardFirstName,
    vcardLastName,
    vcardPhone,
    vcardEmail,
    smsPhone,
    smsMessage,
    eventSummary,
    eventStart,
    eventEnd,
    eventLocation,
    geoLat,
    geoLon,
    phoneNumber,
    textValue,
  ]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const qrModule = await import("qr-code-styling");
      if (cancelled || !containerRef.current) return;

      const QRCodeStyling = qrModule.default;
      const qr = new QRCodeStyling({
        width: 280,
        height: 280,
        type: "svg",
        data: "https://removebanana.aashuu.tech/",
        image: "",
        dotsOptions: { type: "dots", color: "#818cf8" },
        backgroundOptions: { color: "transparent" },
        imageOptions: { crossOrigin: "anonymous", margin: 10, imageSize: 0.4 },
        qrOptions: { errorCorrectionLevel: "H" },
      });

      qrRef.current = qr as QRCodeInstance;
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);

      resizeObserverRef.current = new ResizeObserver((entries) => {
        const first = entries[0];
        const box = first?.contentRect;
        if (!box || !qrRef.current) return;

        const newSize = Math.max(180, Math.min(box.width, box.height));
        const prevWidth = qrRef.current._options?.width ?? 0;
        if (newSize !== prevWidth) {
          qrRef.current.update({ width: newSize, height: newSize });
        }
      });

      if (previewRef.current) {
        resizeObserverRef.current.observe(previewRef.current);
      }
    })();

    return () => {
      cancelled = true;
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const qr = qrRef.current;
    if (!qr) return;

    const { data, filename, isDataEmpty } = tabPayload;
    setCurrentFilename(filename);
    setIsDataValid(!isDataEmpty);

    const commonOptions =
      gradientType === "single"
        ? { color: color1, gradient: undefined }
        : {
            color: color1,
            gradient: {
              type: gradientType,
              rotation: 0,
              colorStops: [
                { offset: 0, color: color1 },
                { offset: 1, color: color2 },
              ],
            },
          };

    qr.update({
      data,
      image: logoDataUrl,
      dotsOptions: { ...commonOptions, type: dotStyle },
      cornersSquareOptions: { ...commonOptions, type: cornerSquareStyle || undefined },
      cornersDotOptions: { ...commonOptions, type: cornerDotStyle || undefined },
    });
  }, [tabPayload, gradientType, color1, color2, dotStyle, cornerSquareStyle, cornerDotStyle, logoDataUrl]);

  const onLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoDataUrl("");
      setLogoFileName("");
      return;
    }

    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const randomizeStyles = useCallback(() => {
    setColor1(randomHex());
    setColor2(randomHex());
    setGradientType(GRADIENT_TYPES[Math.floor(Math.random() * GRADIENT_TYPES.length)]);
    setDotStyle(DOT_STYLES[Math.floor(Math.random() * DOT_STYLES.length)]);
    setCornerSquareStyle(CORNER_SQUARE_STYLES[Math.floor(Math.random() * CORNER_SQUARE_STYLES.length)]);
    setCornerDotStyle(CORNER_DOT_STYLES[Math.floor(Math.random() * CORNER_DOT_STYLES.length)]);
  }, []);

  const downloadPng = () => {
    if (!isDataValid) return;
    qrRef.current?.download({ name: currentFilename, extension: "png" });
  };

  const downloadSvg = () => {
    if (!isDataValid) return;
    qrRef.current?.download({ name: currentFilename, extension: "svg" });
  };

  const downloadJpeg = async () => {
    if (!isDataValid || !qrRef.current) return;

    const blob = await qrRef.current.getRawData("png");
    const dataUrl = URL.createObjectURL(blob);

    const image = new window.Image();
    image.onload = () => {
      const width = qrRef.current?._options?.width ?? 280;
      const height = qrRef.current?._options?.height ?? 280;

      const padding = 40;
      const canvas = document.createElement("canvas");
      canvas.width = width + padding * 2;
      canvas.height = height + padding * 2;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(dataUrl);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, padding, padding, width, height);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg", 0.95);
      a.download = `${currentFilename}.jpeg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(dataUrl);
    };

    image.src = dataUrl;
  };

  const getEmbedCode = async () => {
    if (!isDataValid || !qrRef.current) return;
    setBusyAction("embed");
    try {
      const blob = await qrRef.current.getRawData("png");
      const base64Url = await blobToDataUrl(blob);
      const size = qrRef.current._options?.width ?? 280;
      const embedCode = `<img src=\"${base64Url}\" alt=\"QR Code generated by RemoveBanana\" width=\"${size}\" height=\"${size}\" />`;
      await copyText(embedCode);
      setToastMessage("Embed code copied");
      setShowToast(true);
    } finally {
      setBusyAction(null);
    }
  };

  const copyImage = async () => {
    if (!isDataValid || !qrRef.current) return;
    setBusyAction("copy");
    try {
      const blob = await qrRef.current.getRawData("png");
      if (navigator.clipboard && "ClipboardItem" in window) {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
      } else {
        const base64Url = await blobToDataUrl(blob);
        await copyText(base64Url);
      }
      setToastMessage("QR image copied");
      setShowToast(true);
    } finally {
      setBusyAction(null);
    }
  };

  const printQr = async () => {
    if (!isDataValid || !qrRef.current) return;
    setBusyAction("print");
    try {
      const blob = await qrRef.current.getRawData("png");
      const dataUrl = URL.createObjectURL(blob);
      const popup = window.open("", "PRINT", "height=600,width=800");
      if (!popup) {
        URL.revokeObjectURL(dataUrl);
        return;
      }

      popup.document.write(`
        <html>
          <head><title>Print QR Code</title></head>
          <body style="text-align:center; margin-top: 50px;">
            <img src="${dataUrl}" alt="QR code to print" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      popup.document.close();
      popup.focus();

      setToastMessage("Print window opened");
      setShowToast(true);

      setTimeout(() => URL.revokeObjectURL(dataUrl), 3000);
    } finally {
      setBusyAction(null);
    }
  };

  useEffect(() => {
    if (!showToast) return;
    const timer = window.setTimeout(() => {
      setShowToast(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [showToast]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:p-6 lg:p-8">
      <div
        className={`pointer-events-none fixed right-4 top-24 z-[70] rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur-md transition-all duration-300 ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        aria-live="polite"
      >
        {toastMessage}
      </div>

      <div className="pointer-events-none absolute -left-24 top-6 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setLightPreviewBg((prev) => !prev)}
                ref={previewRef}
                className={`flex h-[280px] w-[280px] max-w-full items-center justify-center rounded-2xl border border-white/10 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-colors ${
                  lightPreviewBg ? "bg-white" : "bg-slate-900"
                }`}
                title="Toggle preview background"
              >
                <div ref={containerRef} className="h-full w-full" aria-label="QR Code Preview" />
              </button>
            </div>

            <nav className="flex items-center gap-2 overflow-x-auto pb-2" aria-label="QR code data types">
              {TAB_LABELS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm whitespace-nowrap transition ${
                      isActive
                        ? "border-indigo-400/60 bg-indigo-500/20 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              {activeTab === "text" && (
                <textarea
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none ring-indigo-400/30 placeholder:text-slate-500 focus:ring"
                  rows={5}
                  placeholder="Enter text or URL"
                  aria-label="Text or URL"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              )}

              {activeTab === "wifi" && (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Network Name (SSID)"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                  />
                  <select
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none focus:ring focus:ring-indigo-400/30"
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Encryption</option>
                  </select>
                </div>
              )}

              {activeTab === "vcard" && (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="First Name"
                    value={vcardFirstName}
                    onChange={(e) => setVcardFirstName(e.target.value)}
                  />
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Last Name"
                    value={vcardLastName}
                    onChange={(e) => setVcardLastName(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Phone"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                  />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "event" && (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Event Title"
                    value={eventSummary}
                    onChange={(e) => setEventSummary(e.target.value)}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="datetime-local"
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none focus:ring focus:ring-indigo-400/30"
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none focus:ring focus:ring-indigo-400/30"
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                    />
                  </div>
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "phone" && (
                <input
                  type="tel"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                  placeholder="Phone Number (e.g. +15551234567)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              )}

              {activeTab === "sms" && (
                <div className="space-y-3">
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Phone Number"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                  />
                  <textarea
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none ring-indigo-400/30 placeholder:text-slate-500 focus:ring"
                    rows={3}
                    placeholder="Message"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "geo" && (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Latitude"
                    value={geoLat}
                    onChange={(e) => setGeoLat(e.target.value)}
                  />
                  <input
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 p-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring focus:ring-indigo-400/30"
                    placeholder="Longitude"
                    value={geoLon}
                    onChange={(e) => setGeoLon(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-4 text-lg font-semibold text-indigo-200">Choose Your Style</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  {gradientType === "single" ? "Color" : "First Color"}
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-slate-900/70 p-1"
                  />
                </label>

                {gradientType !== "single" && (
                  <label className="block text-sm text-slate-300">
                    Second Color
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-white/15 bg-slate-900/70 p-1"
                    />
                  </label>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Gradient Type
                  <select
                    value={gradientType}
                    onChange={(e) => setGradientType(e.target.value as GradientType)}
                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 p-2.5 text-slate-100"
                  >
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                    <option value="single">Single Color</option>
                  </select>
                </label>

                <label className="block text-sm text-slate-300">
                  Dot Style
                  <select
                    value={dotStyle}
                    onChange={(e) => setDotStyle(e.target.value as DotStyle)}
                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 p-2.5 text-slate-100"
                  >
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Corner Container
                  <select
                    value={cornerSquareStyle}
                    onChange={(e) => setCornerSquareStyle(e.target.value as CornerSquareStyle)}
                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 p-2.5 text-slate-100"
                  >
                    <option value="">Default</option>
                    <option value="dot">Circle</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </label>

                <label className="block text-sm text-slate-300">
                  Corner Piece
                  <select
                    value={cornerDotStyle}
                    onChange={(e) => setCornerDotStyle(e.target.value as CornerDotStyle)}
                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 p-2.5 text-slate-100"
                  >
                    <option value="">Default</option>
                    <option value="dot">Circle</option>
                    <option value="square">Square</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-white/15">
                  <ImageUp className="h-4 w-4" />
                  Choose a Logo
                  <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
                </label>

                <button
                  type="button"
                  onClick={randomizeStyles}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-white/15"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Randomize
                </button>
              </div>

              <div className="mt-2 text-center text-sm text-slate-400">{logoFileName || "No logo selected"}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-4 text-lg font-semibold text-indigo-200">Export</h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={downloadPng}
                  disabled={!isDataValid}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> PNG
                </button>
                <button
                  type="button"
                  onClick={downloadJpeg}
                  disabled={!isDataValid}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> JPEG
                </button>
                <button
                  type="button"
                  onClick={downloadSvg}
                  disabled={!isDataValid}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> SVG
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={getEmbedCode}
                  disabled={!isDataValid || busyAction !== null}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileCode2 className="h-4 w-4" /> {busyAction === "embed" ? "..." : "Embed"}
                </button>
                <button
                  type="button"
                  onClick={copyImage}
                  disabled={!isDataValid || busyAction !== null}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" /> {busyAction === "copy" ? "..." : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={printQr}
                  disabled={!isDataValid || busyAction !== null}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-slate-100 transition enabled:hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <QrCode className="h-4 w-4" /> {busyAction === "print" ? "..." : "Print"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
