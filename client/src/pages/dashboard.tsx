import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Block, ChecklistItem, Evidence } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock,
  FileCheck,
  ListTodo,
  FolderOpen,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlockIcon } from "@/lib/block-icons";

const getStatusBadge = (status: string, id: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-[hsl(var(--status-completed))] text-white" data-testid={`badge-status-completed-${id}`}>Completado</Badge>;
    case "in-progress":
      return <Badge className="bg-[hsl(var(--status-in-progress))] text-white" data-testid={`badge-status-in-progress-${id}`}>En Progreso</Badge>;
    default:
      return <Badge variant="secondary" data-testid={`badge-status-pending-${id}`}>Pendiente</Badge>;
  }
};

export default function Dashboard() {
  const { data: blocks, isLoading: blocksLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const { data: checklistItems } = useQuery<ChecklistItem[]>({
    queryKey: ["/api/checklist-items"],
  });

  const { data: evidences } = useQuery<Evidence[]>({
    queryKey: ["/api/evidences"],
  });

  const totalProgress = blocks?.reduce((acc, block) => acc + block.progress, 0) ?? 0;
  const avgProgress = blocks?.length ? Math.round(totalProgress / blocks.length) : 0;

  const totalChecklist = checklistItems?.length ?? 0;
  const completedChecklist = checklistItems?.filter(item => item.completed).length ?? 0;

  const totalEvidences = evidences?.length ?? 0;
  const completedEvidences = evidences?.filter(ev => ev.status === "completed").length ?? 0;

  if (blocksLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="heading-dashboard-title">Roadmap de Gestión Minera</h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
          Sistema integral de gestión y seguimiento de procesos mineros
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card data-testid="card-metric-global-progress">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Progreso Global</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-global-progress">{avgProgress}%</div>
            <Progress value={avgProgress} className="mt-2" data-testid="progress-global" />
            <p className="text-xs text-muted-foreground mt-2">
              Promedio de todos los bloques
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-checklist">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Checklist</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-checklist-progress">{completedChecklist}/{totalChecklist}</div>
            <Progress value={(completedChecklist / totalChecklist) * 100 || 0} className="mt-2" data-testid="progress-checklist" />
            <p className="text-xs text-muted-foreground mt-2">
              Tareas completadas
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-evidences">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Evidencias</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-evidence-progress">{completedEvidences}/{totalEvidences}</div>
            <Progress value={(completedEvidences / totalEvidences) * 100 || 0} className="mt-2" data-testid="progress-evidences" />
            <p className="text-xs text-muted-foreground mt-2">
              Documentos revisados
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold" data-testid="heading-roadmap-blocks">Bloques del Roadmap</h2>
          <Link href="/bloques">
            <Button variant="ghost" size="sm" data-testid="link-view-all-blocks">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {blocks?.map((block) => (
            <Link key={block.id} href={`/bloques/${block.id}`}>
              <Card 
                className="h-full transition-all duration-200 hover:scale-[1.02] cursor-pointer hover-elevate"
                data-testid={`card-block-${block.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {getBlockIcon(block.number)}
                      </div>
                      <Badge variant="outline" className="font-mono" data-testid={`badge-block-number-${block.id}`}>B{block.number}</Badge>
                    </div>
                    {getStatusBadge(block.status, block.id)}
                  </div>
                  <CardTitle className="mt-4" data-testid={`text-block-name-${block.id}`}>{block.name}</CardTitle>
                  <CardDescription className="line-clamp-2" data-testid={`text-block-description-${block.id}`}>
                    {block.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-mono font-medium" data-testid={`text-block-progress-${block.id}`}>{block.progress}%</span>
                    </div>
                    <Progress value={block.progress} data-testid={`progress-block-${block.id}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
