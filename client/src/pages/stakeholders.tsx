import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Stakeholder, StakeholderParticipation, Block } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Search, Mail, Phone, Building2, User, Plus, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getCommitmentColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-[hsl(var(--status-completed))] text-white";
    case "in-progress":
      return "bg-[hsl(var(--status-in-progress))] text-white";
    default:
      return "";
  }
};

interface StakeholderFormData {
  name: string;
  role: string;
  type: string;
  email: string;
  phone: string;
  avatar: string;
}

const emptyForm: StakeholderFormData = {
  name: "",
  role: "",
  type: "internal",
  email: "",
  phone: "",
  avatar: "",
};

export default function Stakeholders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [formData, setFormData] = useState<StakeholderFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stakeholders = [], isLoading } = useQuery<Stakeholder[]>({
    queryKey: ["/api/stakeholders"],
  });

  const { data: participation = [] } = useQuery<StakeholderParticipation[]>({
    queryKey: ["/api/stakeholder-participation"],
  });

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: StakeholderFormData) => {
      const res = await fetch("/api/stakeholders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: data.email || null,
          phone: data.phone || null,
          avatar: data.avatar || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create stakeholder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholders"] });
      toast({ title: "Stakeholder creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear stakeholder", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StakeholderFormData> }) => {
      const res = await fetch(`/api/stakeholders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update stakeholder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholders"] });
      toast({ title: "Stakeholder actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar stakeholder", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/stakeholders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete stakeholder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholders"] });
      toast({ title: "Stakeholder eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar stakeholder", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingStakeholder(null);
    setFormData(emptyForm);
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setFormData({
      name: stakeholder.name,
      role: stakeholder.role,
      type: stakeholder.type,
      email: stakeholder.email || "",
      phone: stakeholder.phone || "",
      avatar: stakeholder.avatar || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStakeholder) {
      updateMutation.mutate({ id: editingStakeholder.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredStakeholders = stakeholders.filter(sh =>
    sh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sh.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParticipationByStakeholder = (stakeholderId: string) => {
    return participation.filter(p => p.stakeholderId === stakeholderId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando stakeholders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Stakeholders</h1>
          <p className="text-muted-foreground">
            Gestión de stakeholders internos y externos del proyecto minero
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Stakeholder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStakeholder ? "Editar Stakeholder" : "Nuevo Stakeholder"}</DialogTitle>
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
                <Label htmlFor="role">Rol / Cargo *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Interno</SelectItem>
                    <SelectItem value="external">Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="avatar">URL Avatar</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingStakeholder ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar stakeholders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredStakeholders.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay stakeholders registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer stakeholder
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredStakeholders.map((stakeholder) => {
            const stakeholderParticipation = getParticipationByStakeholder(stakeholder.id);
            const completedCount = stakeholderParticipation.filter(p => p.commitmentStatus === "completed").length;
            const totalCount = stakeholderParticipation.length;

            return (
              <Card key={stakeholder.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={stakeholder.avatar || undefined} />
                      <AvatarFallback className="text-lg">
                        {getInitials(stakeholder.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="mb-1">{stakeholder.name}</CardTitle>
                      <CardDescription className="mb-2">{stakeholder.role}</CardDescription>
                      <Badge variant={stakeholder.type === "internal" ? "default" : "secondary"}>
                        {stakeholder.type === "internal" ? (
                          <>
                            <Building2 className="h-3 w-3 mr-1" />
                            Interno
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            Externo
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(stakeholder.email || stakeholder.phone) && (
                    <div className="space-y-2 text-sm">
                      {stakeholder.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{stakeholder.email}</span>
                        </div>
                      )}
                      {stakeholder.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{stakeholder.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {totalCount > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Participación en bloques</span>
                        <span className="font-mono font-medium">{completedCount}/{totalCount}</span>
                      </div>
                      <Progress value={(completedCount / totalCount) * 100} />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {stakeholderParticipation.map((p) => {
                          const block = blocks.find(b => b.id === p.blockId);
                          return (
                            <Link key={p.id} href={`/bloques/${p.blockId}`}>
                              <Badge 
                                variant="outline" 
                                className={`cursor-pointer ${getCommitmentColor(p.commitmentStatus)}`}
                              >
                                {block?.name || `Bloque ${p.blockId}`}
                              </Badge>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(stakeholder)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(stakeholder.id)}
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
