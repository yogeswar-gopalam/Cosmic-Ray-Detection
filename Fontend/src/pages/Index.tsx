import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, Loader2, Sparkles, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpaceBackground from "@/components/SpaceBackground";
import axios from "axios";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleProcess = async () => {
    if (!file || !preview) return;
    
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/detect/", formData);
      sessionStorage.setItem("cv_image", preview);
      sessionStorage.setItem("cv_results", JSON.stringify(response.data)); 
      navigate("/results");
    } catch (error) {
      console.error("Django Connection Error:", error);
      alert("Could not connect to the AI Backend. Is Django running on port 8000?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      <SpaceBackground />
      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Cosmic Ray Particle Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Harness advanced GAN-based neural networks to identify and analyze particles in astronomical data.
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !isProcessing && inputRef.current?.click()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : preview
                ? "border-white/10 glass-card"
                : "border-white/10 glass-card hover:border-primary/50 hover:bg-white/5"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              disabled={isProcessing}
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-80 rounded-2xl object-contain border border-white/10 shadow-2xl"
                />
                {!isProcessing && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                     <p className="text-white font-semibold">Change Image</p>
                   </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 rounded-full bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Upload Research Image</p>
                  <p className="mt-2 text-muted-foreground">
                    Drag & drop or click to browse files
                  </p>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground/60 pt-4">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">JPG</span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">PNG</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              size="lg"
              className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Analyzing Neural Patterns...
                </>
              ) : (
                <>
                  <Cpu className="mr-3 h-6 w-6" />
                  Initiate Particle Inference
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Powered by GAN Architecture</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;