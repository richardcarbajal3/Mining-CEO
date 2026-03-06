import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Evidence, Block } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-completed))]" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-[hsl(var(--status-in-progress))]" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-[hsl(var(--status-completed))] text-white">Revisado</Badge>;
    case "in-progress":
      return <Badge className="bg-[hsl(var(--status-in-progress))] text-white">En Proceso</Badge>;
    default:
      return <Badge variant="secondary">Pendiente</Badge>;
  }
};

const typeOptions = [
  "Documento",
  "Fotografía",
  "Video",
  "Informe",
  "Certificado",
  "Contrato",
  "Otro",
];

interface EvidenceFormData {
  title: string;
  description: string;
  type: string;
  blockId: string;
  status: string;
  notes: string;
}

const emptyForm: EvidenceFormData = {
  title: "",
  description: "",
  type: "",
  blockId: "",
  status: "pending",
  notes: "",
};

export default function Evidencias() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);
  const [formData, setFormData] = useState<EvidenceFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: evidences = [], isLoading } = useQuery<Evidence[]>({
    queryKey: ["/api/evidences"],
  });

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: EvidenceFormData) => {
      const res = await fetch("/api/evidences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          description: data.description || null,
          notes: data.notes || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create evidence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidences"] });
      toast({ title: "Evidencia creada exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear evidencia", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EvidenceFormData> }) => {
      const res = await fetch(`/api/evidences/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update evidence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidences"] });
      toast({ title: "Evidencia actualizada exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar evidencia", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/evidences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete evidence");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidences"] });
      toast({ title: "Evidencia eliminada exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar evidencia", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingEvidence(null);
    setFormData(emptyForm);
  };

  const handleEdit = (evidence: Evidence) => {
    setEditingEvidence(evidence);
    setFormData({
      title: evidence.title,
      description: evidence.description || "",
      type: evidence.type,
      blockId: evidence.blockId,
      status: evidence.status,
      notes: evidence.notes || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvidence) {
      updateMutation.mutate({ id: editingEvidence.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredEvidences = evidences.filter(ev => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
    const matchesType = typeFilter === "all" || ev.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = Array.from(new Set(evidences.map(ev => ev.type)));

  const getBlockName = (blockId: string) => {
    return blocks.find(b => b.id === blockId)?.name || blockId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando evidencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Evidencias y Documentos</h1>
          <p className="text-muted-foreground">
            Gestión de entradas, salidas y documentación por fase y contrato
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEvidence ? "Editar Evidencia" : "Nueva Evidencia"}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="in-progress">En Proceso</SelectItem>
                      <SelectItem value="completed">Revisado</SelectItem>
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
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingEvidence ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar evidencias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="in-progress">En Proceso</SelectItem>
            <SelectItem value="completed">Revisado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEvidences.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay evidencias registradas</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primera evidencia
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEvidences.map((evidence) => (
            <Card key={evidence.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(evidence.status)}
                    <div className="flex-1">
                      <CardTitle className="mb-2">{evidence.title}</CardTitle>
                      {evidence.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {evidence.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{evidence.type}</Badge>
                        <Link href={`/bloques/${evidence.blockId}`}>
                          <Badge variant="secondary" className="cursor-pointer">
                            {getBlockName(evidence.blockId)}
                          </Badge>
                        </Link>
                        {getStatusBadge(evidence.status)}
                      </div>
                      {evidence.notes && (
                        <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted rounded-md">
                          <strong>Notas:</strong> {evidence.notes}
                        </p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(evidence)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(evidence.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
