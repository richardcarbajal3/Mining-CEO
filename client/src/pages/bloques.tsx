import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Block } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Search, Plus, Edit, Trash2, Layers } from "lucide-react";
import { useState } from "react";
import { getBlockIcon } from "@/lib/block-icons";

const getStatusBadge = (status: string, id: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-[hsl(var(--status-completed))] text-white">Completado</Badge>;
    case "in-progress":
      return <Badge className="bg-[hsl(var(--status-in-progress))] text-white">En Progreso</Badge>;
    default:
      return <Badge variant="secondary">Pendiente</Badge>;
  }
};

interface BlockFormData {
  name: string;
  description: string;
  number: number;
  status: string;
  progress: number;
}

const emptyForm: BlockFormData = {
  name: "",
  description: "",
  number: 1,
  status: "pending",
  progress: 0,
};

export default function Bloques() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [formData, setFormData] = useState<BlockFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: blocks, isLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: BlockFormData) => {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create block");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({ title: "Bloque creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear bloque", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlockFormData> }) => {
      const res = await fetch(`/api/blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update block");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({ title: "Bloque actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar bloque", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blocks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete block");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({ title: "Bloque eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar bloque", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingBlock(null);
    setFormData(emptyForm);
  };

  const handleEdit = (block: Block, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingBlock(block);
    setFormData({
      name: block.name,
      description: block.description,
      number: block.number,
      status: block.status,
      progress: block.progress,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlock) {
      updateMutation.mutate({ id: editingBlock.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredBlocks = blocks?.filter(block => 
    block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando bloques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Bloques del Roadmap</h1>
          <p className="text-muted-foreground">
            Gestión completa de los bloques del ciclo de gestión minera
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Bloque
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBlock ? "Editar Bloque" : "Nuevo Bloque"}</DialogTitle>
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
              <div>
                <Label htmlFor="number">Número de Bloque *</Label>
                <Input
                  id="number"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="progress">Progreso (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingBlock ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar bloques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {(!filteredBlocks || filteredBlocks.length === 0) ? (
        <Card className="p-12 text-center">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay bloques registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer bloque
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlocks.map((block) => (
            <Card 
              key={block.id}
              className="h-full transition-all duration-200 hover:scale-[1.02] hover-elevate"
            >
              <Link href={`/bloques/${block.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {getBlockIcon(block.number)}
                      </div>
                      <Badge variant="outline" className="font-mono">B{block.number}</Badge>
                    </div>
                    {getStatusBadge(block.status, block.id)}
                  </div>
                  <CardTitle className="mt-4">{block.name}</CardTitle>
                  <CardDescription>
                    {block.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-mono font-medium">{block.progress}%</span>
                    </div>
                    <Progress value={block.progress} />
                  </div>
                </CardContent>
              </Link>
              <div className="px-6 pb-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={(e) => handleEdit(block, e)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => handleDelete(block.id, e)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
