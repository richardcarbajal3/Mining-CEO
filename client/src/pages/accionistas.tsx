import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShareholderMetric } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Award, Target, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-5 w-5 text-[hsl(var(--status-completed))]" />;
    case "down":
      return <TrendingDown className="h-5 w-5 text-destructive" />;
    default:
      return <Minus className="h-5 w-5 text-muted-foreground" />;
  }
};

const getMetricIcon = (metricName: string) => {
  if (metricName.toLowerCase().includes("retorno") || metricName.toLowerCase().includes("roi")) {
    return DollarSign;
  }
  if (metricName.toLowerCase().includes("credibilidad") || metricName.toLowerCase().includes("confianza")) {
    return Award;
  }
  if (metricName.toLowerCase().includes("accionista")) {
    return Users;
  }
  return Target;
};

interface MetricFormData {
  metricName: string;
  value: number;
  description: string;
  trend: string;
}

const emptyForm: MetricFormData = {
  metricName: "",
  value: 0,
  description: "",
  trend: "stable",
};

export default function Accionistas() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ShareholderMetric | null>(null);
  const [formData, setFormData] = useState<MetricFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics = [], isLoading } = useQuery<ShareholderMetric[]>({
    queryKey: ["/api/shareholder-metrics"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: MetricFormData) => {
      const res = await fetch("/api/shareholder-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          description: data.description || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create metric");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shareholder-metrics"] });
      toast({ title: "Métrica creada exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear métrica", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MetricFormData> }) => {
      const res = await fetch(`/api/shareholder-metrics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update metric");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shareholder-metrics"] });
      toast({ title: "Métrica actualizada exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar métrica", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/shareholder-metrics/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete metric");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shareholder-metrics"] });
      toast({ title: "Métrica eliminada exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar métrica", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingMetric(null);
    setFormData(emptyForm);
  };

  const handleEdit = (metric: ShareholderMetric) => {
    setEditingMetric(metric);
    setFormData({
      metricName: metric.metricName,
      value: metric.value,
      description: metric.description || "",
      trend: metric.trend,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMetric) {
      updateMutation.mutate({ id: editingMetric.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Aceptación de Accionistas</h1>
          <p className="text-muted-foreground">
            Indicadores de credibilidad, retorno de inversión y confianza del mercado
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Métrica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMetric ? "Editar Métrica" : "Nueva Métrica"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="metricName">Nombre de la Métrica *</Label>
                <Input
                  id="metricName"
                  value={formData.metricName}
                  onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
                  placeholder="Ej: Retorno de Inversión, Credibilidad"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Valor (%) *</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="trend">Tendencia</Label>
                <Select
                  value={formData.trend}
                  onValueChange={(value) => setFormData({ ...formData, trend: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">Subiendo</SelectItem>
                    <SelectItem value="down">Bajando</SelectItem>
                    <SelectItem value="stable">Estable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingMetric ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Objetivos Estratégicos
          </CardTitle>
          <CardDescription>
            Resumen de cumplimiento de metas y expectativas de accionistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Monitoreo continuo de indicadores clave para asegurar la aceptación del mercado 
            y la confianza de los accionistas en el proyecto minero.
          </p>
        </CardContent>
      </Card>

      {metrics.length === 0 ? (
        <Card className="p-12 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay métricas de accionistas registradas</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primera métrica
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {metrics.map((metric) => {
            const Icon = getMetricIcon(metric.metricName);
            
            return (
              <Card key={metric.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{metric.metricName}</CardTitle>
                        {metric.description && (
                          <CardDescription className="mt-1">
                            {metric.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-mono">{metric.value}</span>
                    <span className="text-lg text-muted-foreground">%</span>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          metric.value >= 80 
                            ? "bg-[hsl(var(--status-completed))]" 
                            : metric.value >= 50
                            ? "bg-[hsl(var(--status-in-progress))]"
                            : "bg-destructive"
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(metric)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(metric.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
