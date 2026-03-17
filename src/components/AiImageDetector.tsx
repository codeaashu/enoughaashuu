"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  RefreshCcw,
  Download,
  X,
  AlertTriangle,
  Zap,
  TrendingUp,
  BarChart3,
  Brain,
  Eye,
  FileJson,
  Loader,
} from "lucide-react";

interface DetectionResult {
  overall_confidence: number;
  is_ai_generated: boolean;
  analysis: {
    sightengine: {
      confidence: number;
      label: string;
      models_used: string[];
      processing_time: number;
    };
    huggingface_vit: {
      confidence: number;
      label: string;
      processing_time: number;
    };
    local_metadata: {
      confidence: number;
      findings: string[];
      processing_time: number;
    };
  };
  weighted_vote_details: {
    sightengine_score: number;
    huggingface_score: number;
    local_score: number;
    final_vote: number;
  };
  processing_details: {
    image_dimensions: string;
    file_size: string;
    processing_time_total: number;
  };
}

type CardTab = "analysis" | "original";

export default function AIImageDetector() {
  const [resultData, setResultData] = useState<DetectionResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<CardTab>("analysis");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startAnalysis(e.target.files[0]);
    }
  };

  const startAnalysis = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setResultData(null);
    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/detect-ai-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process image");
      }

      const data: DetectionResult = await response.json();
      setResultData(data);

      // Create URL for original image preview
      const url = URL.createObjectURL(selectedFile);
      setOriginalUrl(url);
    } catch (err: unknown) {
      console.error("AI detection error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing the image.";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startAnalysis(e.dataTransfer.files[0]);
    }
  }, []);

  const resetState = () => {
    setResultData(null);
    setOriginalUrl(null);
    setError(null);
    setActiveTab("analysis");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-red-400";
    if (confidence >= 0.6) return "text-orange-400";
    if (confidence >= 0.4) return "text-yellow-400";
    return "text-green-400";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-red-500/10 border-red-500/30";
    if (confidence >= 0.6) return "bg-orange-500/10 border-orange-500/30";
    if (confidence >= 0.4) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-green-500/10 border-green-500/30";
  };

  const downloadResults = () => {
    if (!resultData) return;
    const jsonStr = JSON.stringify(resultData, null, 2);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr)
    );
    element.setAttribute("download", "ai-detection-analysis.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      <div className="w-full glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!isProcessing && !resultData ? (
          <div
            className={`relative flex flex-col items-center justify-center w-full rounded-2xl border border-white/10 transition-all duration-300 ease-in-out cursor-pointer px-4 py-10 md:py-12 ${
              isDragging
                ? "bg-purple-500/10 scale-[1.01] ring-2 ring-purple-500/40"
                : "bg-black/40 hover:bg-white/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-6 rounded-3xl text-xl md:text-2xl font-semibold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-400 transition-all min-w-[260px] w-full max-w-[780px]"
            >
              <UploadCloud className="w-9 h-9" />
              Upload Your Image
            </button>

            <p className="mt-10 text-2xl text-gray-400 text-center leading-relaxed">
              or drag and drop your image here for AI detection analysis
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <ImageIcon className="w-5 h-5" /> PNG, JPG, WebP
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <Brain className="w-5 h-5 text-purple-400" /> Multi-Engine
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400" /> 100% Private
              </span>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="relative animate-in zoom-in-95 duration-500 w-full">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-300 mb-1">Analysis Failed</h3>
                <p className="text-red-200/80">{error}</p>
              </div>
              <button
                onClick={resetState}
                className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="relative animate-in zoom-in-95 duration-500 w-full">
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 rounded-full animate-pulse" />
                <Loader className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-gray-400">Running through multiple detection engines</p>
              </div>
              <div className="w-full max-w-xs bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {resultData && !isProcessing && (
          <div className="relative animate-in zoom-in-95 duration-500 w-full space-y-6">
            {/* Header with Overall Result */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  AI Detection Complete
                </h3>
                <p className="text-gray-400">
                  Analysis completed in {resultData.processing_details.processing_time_total}ms
                </p>
              </div>
              <button
                onClick={resetState}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                title="Clear analysis"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Verdict Card */}
            <div
              className={`rounded-2xl border p-6 ${getConfidenceBgColor(
                resultData.overall_confidence
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Overall Verdict
                </h4>
                <span
                  className={`text-sm font-bold px-4 py-1 rounded-full ${
                    resultData.is_ai_generated
                      ? "bg-red-500/20 text-red-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {resultData.is_ai_generated ? "AI Generated" : "Likely Authentic"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 mb-2">Confidence Score</p>
                  <p
                    className={`text-4xl font-bold ${getConfidenceColor(
                      resultData.overall_confidence
                    )}`}
                  >
                    {(resultData.overall_confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="w-1/2 space-y-2">
                  <div className="relative w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        resultData.is_ai_generated
                          ? "bg-gradient-to-r from-red-600 to-orange-500"
                          : "bg-gradient-to-r from-green-600 to-emerald-500"
                      }`}
                      style={{
                        width: `${resultData.overall_confidence * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {resultData.is_ai_generated ? "Likely AI" : "Likely Authentic"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-white/10">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === "analysis"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Detailed Analysis
              </button>
              <button
                onClick={() => setActiveTab("original")}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === "original"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Original Image
              </button>
            </div>

            {/* Analysis Tab Content */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                {/* Engine Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sightengine Result */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Sightengine GenAI
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="font-semibold text-blue-300">
                          {(
                            resultData.analysis.sightengine.confidence * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Classification:</span>
                        <span className="font-semibold text-blue-300">
                          {resultData.analysis.sightengine.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing:</span>
                        <span className="font-semibold text-blue-300">
                          {resultData.analysis.sightengine.processing_time}ms
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-500/20">
                        <p className="text-xs text-gray-400 mb-1">Models Used:</p>
                        <div className="flex flex-wrap gap-1">
                          {resultData.analysis.sightengine.models_used.map(
                            (model, i) => (
                              <span
                                key={i}
                                className="bg-blue-900/40 px-2 py-1 rounded text-xs text-blue-200"
                              >
                                {model}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hugging Face ViT Result */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
                    <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Hugging Face ViT
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="font-semibold text-orange-300">
                          {(
                            resultData.analysis.huggingface_vit.confidence *
                            100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Classification:</span>
                        <span className="font-semibold text-orange-300">
                          {resultData.analysis.huggingface_vit.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing:</span>
                        <span className="font-semibold text-orange-300">
                          {resultData.analysis.huggingface_vit.processing_time}ms
                        </span>
                      </div>
                      <div className="pt-2 border-t border-orange-500/20">
                        <p className="text-xs text-gray-400">
                          Vision Transformer (ViT) Model
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Local Metadata Analysis */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
                    <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      Local Metadata
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="font-semibold text-cyan-300">
                          {(
                            resultData.analysis.local_metadata.confidence *
                            100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing:</span>
                        <span className="font-semibold text-cyan-300">
                          {resultData.analysis.local_metadata.processing_time}ms
                        </span>
                      </div>
                      <div className="pt-2 border-t border-cyan-500/20 space-y-1">
                        <p className="text-xs text-gray-400 mb-1">Findings:</p>
                        {resultData.analysis.local_metadata.findings.map(
                          (finding, i) => (
                            <div key={i} className="text-xs text-cyan-200">
                              • {finding}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Weighted Vote Details */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Weighted Voting
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sightengine:</span>
                        <span className="font-semibold text-blue-300">
                          {(
                            resultData.weighted_vote_details
                              .sightengine_score * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hugging Face:</span>
                        <span className="font-semibold text-orange-300">
                          {(
                            resultData.weighted_vote_details
                              .huggingface_score * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Local Analysis:</span>
                        <span className="font-semibold text-cyan-300">
                          {(
                            resultData.weighted_vote_details.local_score * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="pt-2 border-t border-emerald-500/20 flex justify-between">
                        <span className="text-gray-300 font-semibold">
                          Final Vote:
                        </span>
                        <span className="font-bold text-emerald-300">
                          {(
                            resultData.weighted_vote_details.final_vote * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h4 className="font-semibold text-white mb-3">Processing Details</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Image Size</p>
                      <p className="font-semibold text-white">
                        {resultData.processing_details.image_dimensions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">File Size</p>
                      <p className="font-semibold text-white">
                        {resultData.processing_details.file_size}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Total Time</p>
                      <p className="font-semibold text-white">
                        {resultData.processing_details.processing_time_total}ms
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Results */}
                <button
                  onClick={downloadResults}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Full Report (JSON)
                </button>
              </div>
            )}

            {/* Original Image Tab */}
            {activeTab === "original" && originalUrl && (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-2xl flex items-center justify-center">
                  <img
                    src={originalUrl}
                    alt="Original uploaded image"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
