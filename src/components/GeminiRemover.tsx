"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCcw, Download, X } from "lucide-react";
import { processGeminiImage } from "@/lib/watermark";

export default function GeminiRemover() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResultUrl(null);
        setError(null);
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const resetState = () => {
        setFile(null);
        setPreviewUrl(null);
        setResultUrl(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveWatermark = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const resultDataUrl = await processGeminiImage(file);
            setResultUrl(resultDataUrl);
        } catch (err: any) {
            console.error("RemoveBanana image processing error:", err);
            setError(err.message || 'An unexpected error occurred while processing the image.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <ImageIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    <span className="inline-flex items-center gap-3">
                        <Image
                            src="/Banana.webp"
                            alt="RemoveBanana logo"
                            width={44}
                            height={44}
                            className="h-10 w-10 rounded-lg"
                            priority
                        />
                        RemoveBanana
                    </span>{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Gemini Image Tool</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.
                </p>
            </div>

            <div className="w-full glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
                {/* Glow effect behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                {!previewUrl ? (
                    <div
                        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group hover:bg-white/5 ${isDragging
                            ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                            : "border-gray-700 bg-black/40"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <div className="w-20 h-20 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                            <UploadCloud className="w-10 h-10 text-blue-400" />
                        </div>

                        <p className="text-xl font-semibold mb-2 text-white">
                            Drag & Drop your image here
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports PNG, JPG, WebP
                            <br />(Gemini, Imagen 2, Imagen 3, Nano Banana AI)
                        </p>

                        <div className="mt-8 px-6 py-2 rounded-full bg-white/10 text-white font-medium text-sm group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors border border-white/5">
                            Browse Files
                        </div>
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-500 w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                Image Selected
                            </h3>
                            <button
                                onClick={resetState}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                                title="Clear image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center justify-center text-sm font-medium text-gray-400 uppercase tracking-widest bg-black/40 py-2 rounded-xl border border-gray-800">
                                    Original Image
                                </h4>
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 bg-black group shadow-2xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewUrl}
                                        alt="Original"
                                        className="object-contain w-full h-full group-hover:scale-[1.02] transition-transform duration-700"
                                    />

                                    {/* Watermark identifier overlay simulation */}
                                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-300 opacity-60">
                                        SynthID detected
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="flex items-center justify-center text-sm font-medium text-blue-400 uppercase tracking-widest bg-blue-900/20 py-2 rounded-xl border border-blue-500/20">
                                    Clean Result
                                </h4>
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-2xl flex flex-col justify-center items-center">
                                    {resultUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={resultUrl}
                                                alt="RemoveBanana result"
                                                className="object-contain w-full h-full group-hover:scale-[1.02] transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 ring-4 ring-inset ring-green-500/20 pointer-events-none rounded-2xl" />
                                            <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-green-500/30 text-xs text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                                Cleaned by RemoveBanana
                                            </div>
                                        </div>
                                    ) : isProcessing ? (
                                        <div className="flex flex-col items-center text-blue-400 space-y-4">
                                            <div className="relative">
                                                <RefreshCcw className="w-12 h-12 animate-spin-slow opacity-80" />
                                                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full" />
                                            </div>
                                            <p className="animate-pulse font-medium tracking-widest text-sm uppercase">Reversing Pixels...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-600">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-sm">Awaiting processing...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 border-t border-gray-800 pt-8 mt-4">
                            {!resultUrl ? (
                                <button
                                    onClick={handleRemoveWatermark}
                                    disabled={isProcessing}
                                    className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 min-w-[200px]"
                                >
                                    {isProcessing ? "Processing..." : "Process with RemoveBanana"}
                                </button>
                            ) : (
                                <a
                                    href={resultUrl}
                                    download="removebanana-gemini-clean.png"
                                    className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] min-w-[200px] gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download High-Res
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400 relative z-10 w-full">
                        <X className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
