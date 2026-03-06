import { useState, useEffect } from "react";
import { X, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhilosophyBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("philosophy-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("philosophy-dismissed", "true");
  };

  useEffect(() => {
    if (isDismissed) {
      localStorage.removeItem("philosophy-dismissed");
      const timer = setTimeout(() => {
        setIsDismissed(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-sm border-t-2 border-primary">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Mountain className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-center font-bold text-primary uppercase tracking-widest text-sm md:text-base flex-1">
              Tolerar, Acompañar y Persistir
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={handleDismiss}
            data-testid="button-dismiss-philosophy"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
