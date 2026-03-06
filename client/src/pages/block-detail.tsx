import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import type { Block, ChecklistItem, Evidence } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getBlockIcon } from "@/lib/block-icons";

const getStatusBadge = (status: string, id: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-[hsl(var(--status-completed))] text-white" data-testid={`badge-status-${id}`}>Completado</Badge>;
    case "in-progress":
      return <Badge className="bg-[hsl(var(--status-in-progress))] text-white" data-testid={`badge-status-${id}`}>En Progreso</Badge>;
    default:
      return <Badge variant="secondary" data-testid={`badge-status-${id}`}>Pendiente</Badge>;
  }
};

export default function BlockDetail() {
  const [, params] = useRoute("/bloques/:id");
  const blockId = params?.id;
  const { toast } = useToast();

  const { data: block, isLoading: blockLoading } = useQuery<Block>({
    queryKey: ["/api/blocks", blockId],
    enabled: !!blockId,
  });

  const { data: checklistItems = [] } = useQuery<ChecklistItem[]>({
    queryKey: ["/api/checklist-items", blockId],
    queryFn: async () => {
      const response = await fetch(`/api/checklist-items?blockId=${blockId}`);
      if (!response.ok) throw new Error('Failed to fetch checklist items');
      return response.json();
    },
    enabled: !!blockId,
  });

  const { data: evidences = [] } = useQuery<Evidence[]>({
    queryKey: ["/api/evidences", blockId],
    queryFn: async () => {
      const response = await fetch(`/api/evidences?blockId=${blockId}`);
      if (!response.ok) throw new Error('Failed to fetch evidences');
      return response.json();
    },
    enabled: !!blockId,
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/checklist-items/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist-items", blockId] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks", blockId] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({
        title: "Actualizado",
        description: "El estado del checklist ha sido actualizado",
      });
    },
  });

  const toggleEvidenceMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/evidences/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidences", blockId] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks", blockId] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({
        title: "Actualizado",
        description: "El estado de la evidencia ha sido actualizado",
      });
    },
  });

  if (blockLoading || !block) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando bloque...</p>
        </div>
      </div>
    );
  }

  const completedChecklist = checklistItems.filter(item => item.completed).length;
  const totalChecklist = checklistItems.length;
  const completedEvidences = evidences.filter(ev => ev.status === "completed").length;
  const totalEvidences = evidences.length;

  const groupedChecklist = checklistItems.reduce((acc, item) => {
    const category = item.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/bloques">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              {getBlockIcon(block.number)}
            </div>
            <h1 className="text-4xl font-bold" data-testid="heading-block-title">{block.name}</h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-block-description">{block.description}</p>
        </div>
        {getStatusBadge(block.status, block.id)}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card data-testid="card-total-progress">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-total-progress">{block.progress}%</div>
            <Progress value={block.progress} className="mt-2" data-testid="progress-total" />
          </CardContent>
        </Card>

        <Card data-testid="card-checklist-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-checklist-summary">{completedChecklist}/{totalChecklist}</div>
            <Progress value={(completedChecklist / totalChecklist) * 100 || 0} className="mt-2" data-testid="progress-checklist-summary" />
          </CardContent>
        </Card>

        <Card data-testid="card-evidences-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Evidencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-evidences-summary">{completedEvidences}/{totalEvidences}</div>
            <Progress value={(completedEvidences / totalEvidences) * 100 || 0} className="mt-2" data-testid="progress-evidences-summary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Checklist de Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalChecklist === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-checklist">
                No hay tareas en el checklist
              </p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {Object.entries(groupedChecklist).map(([category, items]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-sm font-semibold" data-testid={`accordion-category-${category}`}>
                      {category} ({items.filter(i => i.completed).length}/{items.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-start gap-3 p-3 rounded-md hover-elevate"
                            data-testid={`checklist-item-${item.id}`}
                          >
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={(checked) => {
                                toggleChecklistMutation.mutate({
                                  id: item.id,
                                  completed: checked as boolean,
                                });
                              }}
                              disabled={toggleChecklistMutation.isPending}
                              data-testid={`checkbox-checklist-${item.id}`}
                            />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`} data-testid={`text-checklist-title-${item.id}`}>
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-1" data-testid={`text-checklist-description-${item.id}`}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Evidencias y Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalEvidences === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-evidences">
                No hay evidencias registradas
              </p>
            ) : (
              <div className="space-y-3">
                {evidences.map((evidence) => (
                  <div 
                    key={evidence.id} 
                    className="p-4 rounded-md border hover-elevate"
                    data-testid={`evidence-${evidence.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm" data-testid={`text-evidence-title-${evidence.id}`}>{evidence.title}</p>
                        {evidence.description && (
                          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-evidence-description-${evidence.id}`}>
                            {evidence.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs" data-testid={`badge-evidence-type-${evidence.id}`}>{evidence.type}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={evidence.status === "completed" ? "default" : "outline"}
                        onClick={() => {
                          toggleEvidenceMutation.mutate({
                            id: evidence.id,
                            status: evidence.status === "completed" ? "pending" : "completed",
                          });
                        }}
                        disabled={toggleEvidenceMutation.isPending}
                        data-testid={`button-toggle-evidence-${evidence.id}`}
                      >
                        {evidence.status === "completed" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Revisado
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Marcar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
