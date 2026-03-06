import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Procedure } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  BookOpen, 
  FileText,
  Shield,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProcedureFormData {
  title: string;
  content: string;
  category: string;
  normative: string;
}

const emptyForm: ProcedureFormData = {
  title: "",
  content: "",
  category: "",
  normative: "",
};

const categoryOptions = [
  "Seguridad",
  "Operaciones",
  "Medio Ambiente",
  "Recursos Humanos",
  "Calidad",
  "Legal",
  "Administrativo",
];

export default function Procedimientos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [formData, setFormData] = useState<ProcedureFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: procedures = [], isLoading } = useQuery<Procedure[]>({
    queryKey: ["/api/procedures"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProcedureFormData) => {
      const res = await fetch("/api/procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          normative: data.normative || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create procedure");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/procedures"] });
      toast({ title: "Procedimiento creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear procedimiento", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProcedureFormData> }) => {
      const res = await fetch(`/api/procedures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update procedure");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/procedures"] });
      toast({ title: "Procedimiento actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar procedimiento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/procedures/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete procedure");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/procedures"] });
      toast({ title: "Procedimiento eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar procedimiento", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingProcedure(null);
    setFormData(emptyForm);
  };

  const handleEdit = (procedure: Procedure) => {
    setEditingProcedure(procedure);
    setFormData({
      title: procedure.title,
      content: procedure.content,
      category: procedure.category,
      normative: procedure.normative || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProcedure) {
      updateMutation.mutate({ id: editingProcedure.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = 
      proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || proc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(procedures.map(p => p.category)));

  const groupedProcedures = filteredProcedures.reduce((acc, proc) => {
    if (!acc[proc.category]) acc[proc.category] = [];
    acc[proc.category].push(proc);
    return acc;
  }, {} as Record<string, Procedure[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando procedimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Procedimientos y Políticas</h1>
          <p className="text-muted-foreground">
            Lineamientos, roles, responsabilidades y normativas aplicables
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Procedimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProcedure ? "Editar Procedimiento" : "Nuevo Procedimiento"}</DialogTitle>
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
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="normative">Normativa Aplicable</Label>
                <Input
                  id="normative"
                  value={formData.normative}
                  onChange={(e) => setFormData({ ...formData, normative: e.target.value })}
                  placeholder="Ej: ISO 14001, Ley 19.300"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProcedure ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Filosofía Organizacional</CardTitle>
              <CardDescription className="mt-1">
                Principio fundamental de nuestra gestión minera
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-primary uppercase tracking-wide">
            Tolerar, Acompañar y Persistir
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Este principio guía todas nuestras operaciones y toma de decisiones, promoviendo 
            la resiliencia, el apoyo mutuo y la determinación en cada fase del proyecto minero.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar procedimientos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProcedures.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay procedimientos registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer procedimiento
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedProcedures).map(([category, procs]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {category}
                </CardTitle>
                <CardDescription>
                  {procs.length} {procs.length === 1 ? "procedimiento" : "procedimientos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {procs.map((proc) => (
                    <AccordionItem key={proc.id} value={proc.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{proc.title}</span>
                          {proc.normative && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {proc.normative}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 pl-6 space-y-3">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {proc.content}
                            </p>
                          </div>
                          {proc.normative && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground">
                                <strong>Normativa aplicable:</strong> {proc.normative}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(proc)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(proc.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
