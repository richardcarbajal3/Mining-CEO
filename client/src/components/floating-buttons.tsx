import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/feedback", {
        name: name.trim() || null,
        message: message.trim(),
      });
      toast({
        title: "Gracias por tu comentario",
        description: "Tu feedback ha sido enviado correctamente.",
      });
      setName("");
      setMessage("");
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo enviar el feedback. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full shadow-lg h-14 w-14 p-0 bg-background hover:bg-accent"
            title="Déjanos tus comentarios"
          >
            <Send className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déjanos tus comentarios</DialogTitle>
            <DialogDescription>
              Tu opinión nos ayuda a mejorar. Escribe tu comentario y lo revisaremos.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-name">Nombre (opcional)</Label>
              <Input
                id="feedback-name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Mensaje</Label>
              <Textarea
                id="feedback-message"
                placeholder="Escribe tu comentario aquí..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || !message.trim()}>
              {submitting ? "Enviando..." : "Enviar comentario"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <a
        href="https://wa.me/51963231357"
        target="_blank"
        rel="noopener noreferrer"
        title="Soporte por WhatsApp"
      >
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
}
