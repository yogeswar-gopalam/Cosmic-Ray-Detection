import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Zap, BoxSelect, Download, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpaceBackground from "@/components/SpaceBackground";

const Results = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the image and AI data we saved in Index.tsx
    const savedImage = sessionStorage.getItem("cv_image");
    const savedResults = sessionStorage.getItem("cv_results");

    if (!savedImage || !savedResults) {
      navigate("/"); // Redirect if no data exists
      return;
    }

    setImageUrl(savedImage);
    setResults(JSON.parse(savedResults));
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      <SpaceBackground />
      <Header />

      <main className="relative z-10 flex-1 px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="w-fit hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
            </Button>
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Detection Results
              </h1>
              <p className="text-muted-foreground">Detailed particle analysis complete</p>
            </div>
          </div>

          {/* Top Section: Metrics Summary */}
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "Particles Found", value: results?.particles_detected || 0, color: "text-blue-400", icon: Sparkles },
              { label: "Model Accuracy", value: results?.accuracy_score || "0%", color: "text-green-400", icon: Zap },
              { label: "Precision", value: results?.precision || "0.00", color: "text-purple-400", icon: CheckCircle2 },
              { label: "Recall", value: results?.recall || "0.00", color: "text-orange-400", icon: BoxSelect },
            ].map((metric, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 transition-all hover:scale-[1.02] hover:neon-glow border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <p className="text-4xl font-bold tracking-tighter">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Middle Section: Comparison Images */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Card: Processed/Cleaned Image */}
            <div className="overflow-hidden rounded-2xl border border-white/10 glass-card">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-secondary">GAN Processed Track</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <div className="p-6">
                <div className="relative group rounded-xl overflow-hidden border border-white/5 bg-black/40">
                  <img 
                    src={imageUrl || ""} 
                    alt="Processed" 
                    className="w-full h-auto object-contain max-h-[450px] transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Right Card: Bounding Boxes Detection */}
            <div className="overflow-hidden rounded-2xl border border-white/10 glass-card">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxSelect className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-primary">Particle Detection</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="p-6">
                {results?.boxed_image ? (
                  <div className="relative group rounded-xl overflow-hidden border border-white/5 bg-black/40">
                    <img 
                      src={results.boxed_image} 
                      alt="Detection Boxes" 
                      className="w-full h-auto object-contain max-h-[450px] transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="flex h-[350px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 text-muted-foreground animate-pulse">
                    <Sparkles className="h-8 w-8 mb-4 opacity-50" />
                    <p className="text-lg">Generating detection map...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: Actions */}
          <div className="flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Neural Inference Successfully Completed</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-5 w-5" /> Export Scientific Report
              </Button>
              <Button 
                variant="outline"
                className="h-14 px-8 text-lg border-white/10 hover:bg-white/5"
                onClick={() => navigate("/")}
              >
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;