import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Kpi, Block } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { TrendingUp, TrendingDown, Minus, BarChart3, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-[hsl(var(--status-completed))]" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up":
      return "text-[hsl(var(--status-completed))]";
    case "down":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

interface KpiFormData {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: string;
  blockId: string;
}

const emptyForm: KpiFormData = {
  name: "",
  value: 0,
  target: 0,
  unit: "",
  trend: "stable",
  blockId: "",
};

export default function KPIs() {
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Kpi | null>(null);
  const [formData, setFormData] = useState<KpiFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kpis = [], isLoading } = useQuery<Kpi[]>({
    queryKey: ["/api/kpis"],
  });

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: KpiFormData) => {
      const res = await fetch("/api/kpis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create KPI");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kpis"] });
      toast({ title: "KPI creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear KPI", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KpiFormData> }) => {
      const res = await fetch(`/api/kpis/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update KPI");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kpis"] });
      toast({ title: "KPI actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar KPI", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/kpis/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete KPI");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kpis"] });
      toast({ title: "KPI eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar KPI", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingKpi(null);
    setFormData(emptyForm);
  };

  const handleEdit = (kpi: Kpi) => {
    setEditingKpi(kpi);
    setFormData({
      name: kpi.name,
      value: kpi.value,
      target: kpi.target,
      unit: kpi.unit,
      trend: kpi.trend,
      blockId: kpi.blockId,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKpi) {
      updateMutation.mutate({ id: editingKpi.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredKpis = selectedBlock === "all" 
    ? kpis 
    : kpis.filter(kpi => kpi.blockId === selectedBlock);

  const getBlockName = (blockId: string) => {
    return blocks.find(b => b.id === blockId)?.name || blockId;
  };

  const calculatePerformance = (value: number, target: number) => {
    return Math.round((value / target) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando KPIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">KPIs & Automatización</h1>
          <p className="text-muted-foreground">
            Panel de indicadores de automatización y flujos integrados
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingKpi ? "Editar KPI" : "Nuevo KPI"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Valor Actual *</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="target">Meta *</Label>
                  <Input
                    id="target"
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unidad *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="%, toneladas, etc."
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
              </div>
              <div>
                <Label htmlFor="blockId">Bloque Asociado *</Label>
                <Select
                  value={formData.blockId}
                  onValueChange={(value) => setFormData({ ...formData, blockId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar bloque" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingKpi ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedBlock} onValueChange={setSelectedBlock}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrar por bloque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los bloques</SelectItem>
            {blocks.map(block => (
              <SelectItem key={block.id} value={block.id}>
                {block.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredKpis.length === 0 ? (
        <Card className="p-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay KPIs registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer KPI
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredKpis.map((kpi) => {
            const performance = calculatePerformance(kpi.value, kpi.target);
            
            return (
              <Card key={kpi.id} className="hover-elevate">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.name}
                  </CardTitle>
                  {getTrendIcon(kpi.trend)}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold font-mono">
                        {kpi.value}
                        <span className="text-lg text-muted-foreground ml-1">{kpi.unit}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Meta: {kpi.target} {kpi.unit}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rendimiento</span>
                        <span className={`font-mono font-medium ${getTrendColor(kpi.trend)}`}>
                          {performance}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            performance >= 100 
                              ? "bg-[hsl(var(--status-completed))]" 
                              : performance >= 50
                              ? "bg-[hsl(var(--status-in-progress))]"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${Math.min(performance, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Badge variant="outline" className="text-xs">
                        {getBlockName(kpi.blockId)}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(kpi)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(kpi.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
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
