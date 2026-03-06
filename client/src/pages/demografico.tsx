import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemographicData } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { 
  MapPin, 
  Users, 
  Heart, 
  TrendingUp,
  Globe,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "demografía":
      return Users;
    case "cultura":
      return Globe;
    case "valores":
      return Heart;
    case "tendencias":
      return TrendingUp;
    default:
      return MapPin;
  }
};

const categoryOptions = [
  "Demografía",
  "Cultura",
  "Valores",
  "Tendencias",
  "Comunidad",
  "Economía",
];

interface DemographicFormData {
  title: string;
  value: string;
  category: string;
  description: string;
}

const emptyForm: DemographicFormData = {
  title: "",
  value: "",
  category: "",
  description: "",
};

export default function Demografico() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingData, setEditingData] = useState<DemographicData | null>(null);
  const [formData, setFormData] = useState<DemographicFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: demographicData = [], isLoading } = useQuery<DemographicData[]>({
    queryKey: ["/api/demographic-data"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: DemographicFormData) => {
      const res = await fetch("/api/demographic-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          description: data.description || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demographic-data"] });
      toast({ title: "Dato demográfico creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear dato demográfico", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DemographicFormData> }) => {
      const res = await fetch(`/api/demographic-data/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demographic-data"] });
      toast({ title: "Dato demográfico actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar dato demográfico", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/demographic-data/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demographic-data"] });
      toast({ title: "Dato demográfico eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar dato demográfico", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingData(null);
    setFormData(emptyForm);
  };

  const handleEdit = (data: DemographicData) => {
    setEditingData(data);
    setFormData({
      title: data.title,
      value: data.value,
      category: data.category,
      description: data.description || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingData) {
      updateMutation.mutate({ id: editingData.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredData = categoryFilter === "all"
    ? demographicData
    : demographicData.filter(d => d.category === categoryFilter);

  const uniqueCategories = Array.from(new Set(demographicData.map(d => d.category)));

  const groupedData = filteredData.reduce((acc, data) => {
    if (!acc[data.category]) acc[data.category] = [];
    acc[data.category].push(data);
    return acc;
  }, {} as Record<string, DemographicData[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando datos demográficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Social y Demográfico</h1>
          <p className="text-muted-foreground">
            Datos de demografía, cultura, valores y participación social
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Dato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingData ? "Editar Dato" : "Nuevo Dato Demográfico"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Valor *</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Ej: 45,000 habitantes, 78%, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
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
                  {editingData ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Contexto Social Integral
          </CardTitle>
          <CardDescription>
            Información contextual para decisiones estratégicas del proyecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Análisis demográfico y social que permite comprender el entorno comunitario 
            y cultural en el que se desarrolla el proyecto minero.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredData.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay datos demográficos registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer dato
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([category, items]) => {
            const Icon = getCategoryIcon(category);
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {category}
                  </CardTitle>
                  <CardDescription>
                    {items.length} {items.length === 1 ? "dato registrado" : "datos registrados"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-4 rounded-md border hover-elevate"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold font-mono text-primary mb-2">
                          {item.value}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {item.description}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
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
