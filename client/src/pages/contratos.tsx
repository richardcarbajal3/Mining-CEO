import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contract, Block } from "@shared/schema";
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
import { Plus, Edit, Trash2, FileText, Calendar, DollarSign, Building } from "lucide-react";
import { useState } from "react";

const statusOptions = [
  { value: "draft", label: "Borrador", color: "bg-gray-500" },
  { value: "active", label: "Activo", color: "bg-green-500" },
  { value: "pending", label: "Pendiente", color: "bg-yellow-500" },
  { value: "expired", label: "Vencido", color: "bg-red-500" },
  { value: "closed", label: "Cerrado", color: "bg-blue-500" },
];

const billingTypeOptions = [
  { value: "fixed", label: "Monto Fijo" },
  { value: "hourly", label: "Por Hora" },
  { value: "milestone", label: "Por Hitos" },
  { value: "monthly", label: "Mensual" },
];

const billingFrequencyOptions = [
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" },
  { value: "quarterly", label: "Trimestral" },
  { value: "on_completion", label: "Al Completar" },
];

interface ContractFormData {
  title: string;
  contractNumber: string;
  blockId: string;
  contractor: string;
  contractorContact: string;
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  billingType: string;
  billingFrequency: string;
  status: string;
  closingDate: string;
  closingNotes: string;
  notes: string;
}

const emptyForm: ContractFormData = {
  title: "",
  contractNumber: "",
  blockId: "",
  contractor: "",
  contractorContact: "",
  startDate: "",
  endDate: "",
  value: 0,
  currency: "USD",
  billingType: "",
  billingFrequency: "",
  status: "draft",
  closingDate: "",
  closingNotes: "",
  notes: "",
};

export default function Contratos() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState<ContractFormData>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContractFormData) => {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          value: data.value || null,
          blockId: data.blockId || null,
          contractNumber: data.contractNumber || null,
          contractorContact: data.contractorContact || null,
          billingType: data.billingType || null,
          billingFrequency: data.billingFrequency || null,
          closingDate: data.closingDate || null,
          closingNotes: data.closingNotes || null,
          notes: data.notes || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create contract");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Contrato creado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al crear contrato", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContractFormData> }) => {
      const res = await fetch(`/api/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update contract");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Contrato actualizado exitosamente" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar contrato", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete contract");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({ title: "Contrato eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar contrato", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingContract(null);
    setFormData(emptyForm);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      title: contract.title,
      contractNumber: contract.contractNumber || "",
      blockId: contract.blockId || "",
      contractor: contract.contractor,
      contractorContact: contract.contractorContact || "",
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: contract.value || 0,
      currency: contract.currency || "USD",
      billingType: contract.billingType || "",
      billingFrequency: contract.billingFrequency || "",
      status: contract.status,
      closingDate: contract.closingDate || "",
      closingNotes: contract.closingNotes || "",
      notes: contract.notes || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContract) {
      updateMutation.mutate({ id: editingContract.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status);
    return (
      <Badge className={`${option?.color || "bg-gray-500"} text-white`}>
        {option?.label || status}
      </Badge>
    );
  };

  const getBlockName = (blockId: string | null) => {
    if (!blockId) return null;
    return blocks.find((b) => b.id === blockId)?.name;
  };

  const formatCurrency = (value: number | null, currency: string | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Contratos</h1>
          <p className="text-muted-foreground">
            Gestión de contratos: inicio, plazos, facturación y cierre
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContract ? "Editar Contrato" : "Nuevo Contrato"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Título del Contrato *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contractNumber">Número de Contrato</Label>
                  <Input
                    id="contractNumber"
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="blockId">Bloque Asociado</Label>
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
                  <Label htmlFor="contractor">Contratista *</Label>
                  <Input
                    id="contractor"
                    value={formData.contractor}
                    onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contractorContact">Contacto</Label>
                  <Input
                    id="contractorContact"
                    value={formData.contractorContact}
                    onChange={(e) => setFormData({ ...formData, contractorContact: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Término *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor del Contrato</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CLP">CLP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingType">Tipo de Facturación</Label>
                  <Select
                    value={formData.billingType}
                    onValueChange={(value) => setFormData({ ...formData, billingType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {billingTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingFrequency">Frecuencia de Facturación</Label>
                  <Select
                    value={formData.billingFrequency}
                    onValueChange={(value) => setFormData({ ...formData, billingFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {billingFrequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="closingDate">Fecha de Cierre</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="closingNotes">Notas de Cierre</Label>
                  <Textarea
                    id="closingNotes"
                    value={formData.closingNotes}
                    onChange={(e) => setFormData({ ...formData, closingNotes: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notas Generales</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingContract ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contracts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay contratos registrados</p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer contrato
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover-elevate">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{contract.title}</CardTitle>
                  {getStatusBadge(contract.status)}
                </div>
                {contract.contractNumber && (
                  <p className="text-xs text-muted-foreground">#{contract.contractNumber}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{contract.contractor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{contract.startDate} - {contract.endDate}</span>
                </div>
                {contract.value && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCurrency(contract.value, contract.currency)}</span>
                  </div>
                )}
                {getBlockName(contract.blockId) && (
                  <Badge variant="outline" className="text-xs">
                    {getBlockName(contract.blockId)}
                  </Badge>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(contract)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(contract.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
