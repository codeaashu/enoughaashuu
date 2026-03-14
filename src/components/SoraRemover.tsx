"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Download, Link as LinkIcon, Loader2, PlayCircle, AlertCircle, Video } from "lucide-react";

export default function SoraRemover() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ mp4Url: string; prompt: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/extract-sora", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to extract video.");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPrompt = () => {
        if (result?.prompt) {
            navigator.clipboard.writeText(result.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">

            <div className="w-full glass rounded-3xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 relative z-10">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-400 transition-colors" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://sora.chatgpt.com/p/..."
                            className="block w-full pl-11 pr-4 py-4 bg-black/40 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 text-white placeholder-gray-500 transition-all outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-2xl text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-fuchsia-600 disabled:hover:to-purple-600 transition-all shadow-lg shadow-fuchsia-500/25"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Extracting...
                            </>
                        ) : (
                            "Process with RemoveBanana"
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400">
                        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-black/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative group">
                            {/* Custom Video Container */}
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                                <video
                                    src={result.mp4Url}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster=""
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Action Bar & Prompt */}
                            <div className="p-6 border-t border-gray-800 bg-gradient-to-b from-black/0 to-black/60">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Original Prompt</h3>
                                        <div className="relative group/prompt cursor-pointer" onClick={handleCopyPrompt}>
                                            <p className="text-gray-200 text-sm md:text-base leading-relaxed line-clamp-3 group-hover/prompt:line-clamp-none transition-all duration-300">
                                                {result.prompt}
                                            </p>
                                            <div className="absolute right-0 top-0 opacity-0 group-hover/prompt:opacity-100 transition-opacity bg-black/80 p-1.5 rounded-lg border border-gray-700 translate-x-2 -translate-y-2">
                                                {copied ? <span className="text-xs text-green-400 px-2 py-1">Copied!</span> : <Copy className="h-4 w-4 text-gray-400" />}
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={result.mp4Url}
                                        download="removebanana-sora-video.mp4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex flex-shrink-0 items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download MP4
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Help section */}
            {/* <div className="mt-12 w-full max-w-2xl text-center grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
                <div>
                    <p className="font-semibold text-gray-300">1. Open Sora</p>
                    <p className="text-sm text-gray-500 mt-1">Found a video you like</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-300">2. Copy Link</p>
                    <p className="text-sm text-gray-500 mt-1">Tap ••• and copy URL</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-300">3. Paste Here</p>
                    <p className="text-sm text-gray-500 mt-1">Download with RemoveBanana</p>
                </div>
            </div> */}
        </div>
    );
}
