import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import type { Feedback } from "@shared/schema";

export default function FeedbackAdmin() {
  const { data: feedbackList = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const sorted = [...feedbackList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comentarios de Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Feedback recibido de los usuarios del sistema
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {feedbackList.length} comentario{feedbackList.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cargando comentarios...
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              No hay comentarios aún
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Los comentarios de los usuarios aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sorted.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {item.name || "Anónimo"}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
