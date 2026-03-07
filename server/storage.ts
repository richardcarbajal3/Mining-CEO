import {
  type Block, type InsertBlock,
  type ChecklistItem, type InsertChecklistItem,
  type Evidence, type InsertEvidence,
  type Stakeholder, type InsertStakeholder,
  type StakeholderParticipation, type InsertStakeholderParticipation,
  type Kpi, type InsertKpi,
  type Procedure, type InsertProcedure,
  type ShareholderMetric, type InsertShareholderMetric,
  type DemographicData, type InsertDemographicData,
  type Feedback, type InsertFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getBlocks(): Promise<Block[]>;
  getBlock(id: string): Promise<Block | undefined>;
  createBlock(block: InsertBlock): Promise<Block>;
  updateBlock(id: string, updates: Partial<Block>): Promise<Block | undefined>;
  
  getChecklistItems(blockId?: string): Promise<ChecklistItem[]>;
  getChecklistItem(id: string): Promise<ChecklistItem | undefined>;
  createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem>;
  updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | undefined>;
  
  getEvidences(blockId?: string): Promise<Evidence[]>;
  getEvidence(id: string): Promise<Evidence | undefined>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
  updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence | undefined>;
  
  getStakeholders(): Promise<Stakeholder[]>;
  getStakeholder(id: string): Promise<Stakeholder | undefined>;
  createStakeholder(stakeholder: InsertStakeholder): Promise<Stakeholder>;
  
  getStakeholderParticipation(stakeholderId?: string): Promise<StakeholderParticipation[]>;
  createStakeholderParticipation(participation: InsertStakeholderParticipation): Promise<StakeholderParticipation>;
  updateStakeholderParticipation(id: string, updates: Partial<StakeholderParticipation>): Promise<StakeholderParticipation | undefined>;
  
  getKpis(blockId?: string): Promise<Kpi[]>;
  getKpi(id: string): Promise<Kpi | undefined>;
  createKpi(kpi: InsertKpi): Promise<Kpi>;
  updateKpi(id: string, updates: Partial<Kpi>): Promise<Kpi | undefined>;
  deleteKpi(id: string): Promise<boolean>;
  
  getProcedures(): Promise<Procedure[]>;
  getProcedure(id: string): Promise<Procedure | undefined>;
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  updateProcedure(id: string, updates: Partial<Procedure>): Promise<Procedure | undefined>;
  deleteProcedure(id: string): Promise<boolean>;
  
  getShareholderMetrics(): Promise<ShareholderMetric[]>;
  getShareholderMetric(id: string): Promise<ShareholderMetric | undefined>;
  createShareholderMetric(metric: InsertShareholderMetric): Promise<ShareholderMetric>;
  updateShareholderMetric(id: string, updates: Partial<ShareholderMetric>): Promise<ShareholderMetric | undefined>;
  deleteShareholderMetric(id: string): Promise<boolean>;
  
  getDemographicData(): Promise<DemographicData[]>;
  getDemographicDataById(id: string): Promise<DemographicData | undefined>;
  createDemographicData(data: InsertDemographicData): Promise<DemographicData>;
  updateDemographicData(id: string, updates: Partial<DemographicData>): Promise<DemographicData | undefined>;
  deleteDemographicData(id: string): Promise<boolean>;

  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private blocks: Map<string, Block>;
  private checklistItems: Map<string, ChecklistItem>;
  private evidences: Map<string, Evidence>;
  private stakeholders: Map<string, Stakeholder>;
  private stakeholderParticipation: Map<string, StakeholderParticipation>;
  private kpis: Map<string, Kpi>;
  private procedures: Map<string, Procedure>;
  private shareholderMetrics: Map<string, ShareholderMetric>;
  private demographicData: Map<string, DemographicData>;

  constructor() {
    this.blocks = new Map();
    this.checklistItems = new Map();
    this.evidences = new Map();
    this.stakeholders = new Map();
    this.stakeholderParticipation = new Map();
    this.kpis = new Map();
    this.procedures = new Map();
    this.shareholderMetrics = new Map();
    this.demographicData = new Map();
    
    this.seedData();
  }

  private seedData() {
    const blockData: InsertBlock[] = [
      { number: 1, name: "Ciclo de Vida Minero", description: "Exploración, desarrollo, operación y cierre", status: "in-progress", progress: 65 },
      { number: 2, name: "Contratos Internos", description: "Gestión de contratos entre áreas", status: "in-progress", progress: 45 },
      { number: 3, name: "Integración de Áreas", description: "Coordinación operacional integrada", status: "pending", progress: 30 },
      { number: 4, name: "Indicadores y Dashboards", description: "KPIs y visualización de datos", status: "in-progress", progress: 55 },
      { number: 5, name: "Automatización", description: "Procesos automatizados y flujos", status: "pending", progress: 20 },
      { number: 6, name: "Procedimientos", description: "Políticas, normativas y lineamientos", status: "completed", progress: 100 },
      { number: 7, name: "Aceptación Accionistas", description: "Credibilidad y retorno de inversión", status: "in-progress", progress: 70 },
      { number: 8, name: "Social/Demográfico", description: "Contexto comunitario y cultural", status: "in-progress", progress: 50 }
    ];

    blockData.forEach((data, index) => {
      const id = `block-${index + 1}`;
      this.blocks.set(id, { ...data, id });
    });

    const block1Id = "block-1";
    const block2Id = "block-2";
    const block6Id = "block-6";

    this.checklistItems.set("check-1", {
      id: "check-1",
      blockId: block1Id,
      title: "Completar estudio de exploración geológica",
      description: "Mapeo completo del yacimiento",
      completed: true,
      category: "Exploración",
      order: 1
    });

    this.checklistItems.set("check-2", {
      id: "check-2",
      blockId: block1Id,
      title: "Evaluación de recursos minerales",
      description: "Cuantificación de reservas",
      completed: true,
      category: "Exploración",
      order: 2
    });

    this.checklistItems.set("check-3", {
      id: "check-3",
      blockId: block1Id,
      title: "Plan de desarrollo minero",
      description: "Diseño de infraestructura",
      completed: false,
      category: "Desarrollo",
      order: 3
    });

    this.checklistItems.set("check-4", {
      id: "check-4",
      blockId: block2Id,
      title: "Revisar contratos con proveedores",
      description: "Actualización anual de términos",
      completed: false,
      category: "Proveedores",
      order: 1
    });

    this.checklistItems.set("check-5", {
      id: "check-5",
      blockId: block2Id,
      title: "Contratos de servicios internos",
      description: "SLAs entre departamentos",
      completed: true,
      category: "Internos",
      order: 2
    });

    this.evidences.set("ev-1", {
      id: "ev-1",
      blockId: block1Id,
      title: "Informe Geológico Q3 2025",
      description: "Análisis detallado de muestras",
      type: "Reporte Técnico",
      status: "completed",
      documentUrl: null,
      notes: "Aprobado por gerencia técnica"
    });

    this.evidences.set("ev-2", {
      id: "ev-2",
      blockId: block1Id,
      title: "Certificado ISO 14001",
      description: "Gestión ambiental",
      type: "Certificación",
      status: "completed",
      documentUrl: null,
      notes: null
    });

    this.evidences.set("ev-3", {
      id: "ev-3",
      blockId: block2Id,
      title: "Contrato Marco Proveedores",
      description: "Documento legal vigente",
      type: "Contrato",
      status: "in-progress",
      documentUrl: null,
      notes: "Pendiente firma de gerencia"
    });

    this.stakeholders.set("sh-1", {
      id: "sh-1",
      name: "María González",
      role: "Gerente de Operaciones",
      type: "internal",
      email: "maria.gonzalez@minera.com",
      phone: "+56 9 1234 5678",
      avatar: null
    });

    this.stakeholders.set("sh-2", {
      id: "sh-2",
      name: "Carlos Rodríguez",
      role: "Jefe de Geología",
      type: "internal",
      email: "carlos.rodriguez@minera.com",
      phone: "+56 9 8765 4321",
      avatar: null
    });

    this.stakeholders.set("sh-3", {
      id: "sh-3",
      name: "Comunidad Local Andina",
      role: "Representante Comunitario",
      type: "external",
      email: "contacto@comunidadandina.cl",
      phone: "+56 9 5555 1234",
      avatar: null
    });

    this.stakeholders.set("sh-4", {
      id: "sh-4",
      name: "SERNAGEOMIN",
      role: "Autoridad Reguladora",
      type: "external",
      email: "info@sernageomin.cl",
      phone: null,
      avatar: null
    });

    this.stakeholderParticipation.set("sp-1", {
      id: "sp-1",
      stakeholderId: "sh-1",
      blockId: block1Id,
      participationLevel: "high",
      commitmentStatus: "completed",
      notes: "Liderazgo activo en fase operacional"
    });

    this.stakeholderParticipation.set("sp-2", {
      id: "sp-2",
      stakeholderId: "sh-1",
      blockId: block2Id,
      participationLevel: "medium",
      commitmentStatus: "in-progress",
      notes: "Revisión de contratos operacionales"
    });

    this.stakeholderParticipation.set("sp-3", {
      id: "sp-3",
      stakeholderId: "sh-2",
      blockId: block1Id,
      participationLevel: "high",
      commitmentStatus: "completed",
      notes: "Responsable técnico de exploración"
    });

    this.stakeholderParticipation.set("sp-4", {
      id: "sp-4",
      stakeholderId: "sh-3",
      blockId: "block-8",
      participationLevel: "high",
      commitmentStatus: "in-progress",
      notes: "Consulta y participación comunitaria"
    });

    this.kpis.set("kpi-1", {
      id: "kpi-1",
      blockId: block1Id,
      name: "Toneladas Extraídas",
      value: 8500,
      target: 10000,
      unit: "ton",
      trend: "up"
    });

    this.kpis.set("kpi-2", {
      id: "kpi-2",
      blockId: block1Id,
      name: "Eficiencia Operacional",
      value: 87,
      target: 90,
      unit: "%",
      trend: "up"
    });

    this.kpis.set("kpi-3", {
      id: "kpi-3",
      blockId: "block-4",
      name: "Cumplimiento de Plazos",
      value: 92,
      target: 95,
      unit: "%",
      trend: "stable"
    });

    this.kpis.set("kpi-4", {
      id: "kpi-4",
      blockId: "block-5",
      name: "Procesos Automatizados",
      value: 12,
      target: 25,
      unit: "procesos",
      trend: "up"
    });

    this.procedures.set("proc-1", {
      id: "proc-1",
      title: "Procedimiento de Seguridad Minera",
      category: "Seguridad",
      content: "Todos los trabajadores deben utilizar equipos de protección personal (EPP) en todo momento. Se requiere capacitación anual en seguridad minera y simulacros trimestrales de emergencia.",
      normative: "DS 132 - Reglamento de Seguridad Minera"
    });

    this.procedures.set("proc-2", {
      id: "proc-2",
      title: "Gestión Ambiental",
      category: "Medio Ambiente",
      content: "Monitoreo continuo de emisiones, gestión de residuos según clasificación, y programas de rehabilitación de áreas intervenidas.",
      normative: "ISO 14001, Ley 19.300"
    });

    this.procedures.set("proc-3", {
      id: "proc-3",
      title: "Estándares Contables Mineros",
      category: "Finanzas",
      content: "Aplicación de IFRS para empresas mineras, valoración de activos minerales, y reportes financieros trimestrales según normativa vigente.",
      normative: "IFRS, ACCA, Normas Locales"
    });

    this.procedures.set("proc-4", {
      id: "proc-4",
      title: "Relaciones Comunitarias",
      category: "Social",
      content: "Consulta previa a comunidades, programas de desarrollo local, y mecanismos de resolución de conflictos.",
      normative: "Convenio 169 OIT"
    });

    this.shareholderMetrics.set("sm-1", {
      id: "sm-1",
      metricName: "Retorno de Inversión (ROI)",
      value: 18,
      description: "Rentabilidad anual del proyecto",
      trend: "up"
    });

    this.shareholderMetrics.set("sm-2", {
      id: "sm-2",
      metricName: "Credibilidad Corporativa",
      value: 85,
      description: "Índice de confianza de inversionistas",
      trend: "stable"
    });

    this.shareholderMetrics.set("sm-3", {
      id: "sm-3",
      metricName: "Cumplimiento de Objetivos",
      value: 92,
      description: "Logro de metas estratégicas",
      trend: "up"
    });

    this.shareholderMetrics.set("sm-4", {
      id: "sm-4",
      metricName: "Aceptación del Mercado",
      value: 78,
      description: "Valoración bursátil y reputación",
      trend: "stable"
    });

    this.demographicData.set("dd-1", {
      id: "dd-1",
      category: "Demografía",
      title: "Población Área de Influencia",
      value: "15,000 habitantes",
      description: "Radio de 50km del proyecto"
    });

    this.demographicData.set("dd-2", {
      id: "dd-2",
      category: "Cultura",
      title: "Comunidades Indígenas",
      value: "3 comunidades",
      description: "Pueblos originarios con participación activa"
    });

    this.demographicData.set("dd-3", {
      id: "dd-3",
      category: "Valores",
      title: "Empleo Local",
      value: "65%",
      description: "Porcentaje de contratación local"
    });

    this.demographicData.set("dd-4", {
      id: "dd-4",
      category: "Tendencias",
      title: "Migración hacia zona minera",
      value: "+8% anual",
      description: "Crecimiento poblacional por oportunidades laborales"
    });

    this.demographicData.set("dd-5", {
      id: "dd-5",
      category: "Demografía",
      title: "Edad Promedio",
      value: "32 años",
      description: "Población económicamente activa"
    });

    this.demographicData.set("dd-6", {
      id: "dd-6",
      category: "Valores",
      title: "Inversión Social",
      value: "$2.5M USD/año",
      description: "Programas de desarrollo comunitario"
    });
  }

  async getBlocks(): Promise<Block[]> {
    return Array.from(this.blocks.values());
  }

  async getBlock(id: string): Promise<Block | undefined> {
    return this.blocks.get(id);
  }

  async createBlock(insertBlock: InsertBlock): Promise<Block> {
    const id = randomUUID();
    const block: Block = { ...insertBlock, id };
    this.blocks.set(id, block);
    return block;
  }

  async updateBlock(id: string, updates: Partial<Block>): Promise<Block | undefined> {
    const block = this.blocks.get(id);
    if (!block) return undefined;
    
    const updated = { ...block, ...updates };
    this.blocks.set(id, updated);
    return updated;
  }

  async getChecklistItems(blockId?: string): Promise<ChecklistItem[]> {
    const items = Array.from(this.checklistItems.values());
    if (blockId) {
      return items.filter(item => item.blockId === blockId);
    }
    return items;
  }

  async getChecklistItem(id: string): Promise<ChecklistItem | undefined> {
    return this.checklistItems.get(id);
  }

  async createChecklistItem(insertItem: InsertChecklistItem): Promise<ChecklistItem> {
    const id = randomUUID();
    const item: ChecklistItem = { ...insertItem, id };
    this.checklistItems.set(id, item);
    return item;
  }

  async updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | undefined> {
    const item = this.checklistItems.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...updates };
    this.checklistItems.set(id, updated);
    
    await this.recalculateBlockProgress(item.blockId);
    
    return updated;
  }

  async getEvidences(blockId?: string): Promise<Evidence[]> {
    const evidences = Array.from(this.evidences.values());
    if (blockId) {
      return evidences.filter(ev => ev.blockId === blockId);
    }
    return evidences;
  }

  async getEvidence(id: string): Promise<Evidence | undefined> {
    return this.evidences.get(id);
  }

  async createEvidence(insertEvidence: InsertEvidence): Promise<Evidence> {
    const id = randomUUID();
    const evidence: Evidence = { ...insertEvidence, id };
    this.evidences.set(id, evidence);
    return evidence;
  }

  async updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence | undefined> {
    const evidence = this.evidences.get(id);
    if (!evidence) return undefined;
    
    const updated = { ...evidence, ...updates };
    this.evidences.set(id, updated);
    
    await this.recalculateBlockProgress(evidence.blockId);
    
    return updated;
  }

  async getStakeholders(): Promise<Stakeholder[]> {
    return Array.from(this.stakeholders.values());
  }

  async getStakeholder(id: string): Promise<Stakeholder | undefined> {
    return this.stakeholders.get(id);
  }

  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const id = randomUUID();
    const stakeholder: Stakeholder = { ...insertStakeholder, id };
    this.stakeholders.set(id, stakeholder);
    return stakeholder;
  }

  async getStakeholderParticipation(stakeholderId?: string): Promise<StakeholderParticipation[]> {
    const participation = Array.from(this.stakeholderParticipation.values());
    if (stakeholderId) {
      return participation.filter(p => p.stakeholderId === stakeholderId);
    }
    return participation;
  }

  async createStakeholderParticipation(insertParticipation: InsertStakeholderParticipation): Promise<StakeholderParticipation> {
    const id = randomUUID();
    const participation: StakeholderParticipation = { ...insertParticipation, id };
    this.stakeholderParticipation.set(id, participation);
    return participation;
  }

  async updateStakeholderParticipation(id: string, updates: Partial<StakeholderParticipation>): Promise<StakeholderParticipation | undefined> {
    const participation = this.stakeholderParticipation.get(id);
    if (!participation) return undefined;
    
    const updated = { ...participation, ...updates };
    this.stakeholderParticipation.set(id, updated);
    return updated;
  }

  async getKpis(blockId?: string): Promise<Kpi[]> {
    const kpis = Array.from(this.kpis.values());
    if (blockId) {
      return kpis.filter(kpi => kpi.blockId === blockId);
    }
    return kpis;
  }

  async getKpi(id: string): Promise<Kpi | undefined> {
    return this.kpis.get(id);
  }

  async createKpi(insertKpi: InsertKpi): Promise<Kpi> {
    const id = randomUUID();
    const kpi: Kpi = { ...insertKpi, id };
    this.kpis.set(id, kpi);
    return kpi;
  }

  async updateKpi(id: string, updates: Partial<Kpi>): Promise<Kpi | undefined> {
    const kpi = this.kpis.get(id);
    if (!kpi) return undefined;
    const updated = { ...kpi, ...updates };
    this.kpis.set(id, updated);
    return updated;
  }

  async deleteKpi(id: string): Promise<boolean> {
    return this.kpis.delete(id);
  }

  async getProcedures(): Promise<Procedure[]> {
    return Array.from(this.procedures.values());
  }

  async getProcedure(id: string): Promise<Procedure | undefined> {
    return this.procedures.get(id);
  }

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const id = randomUUID();
    const procedure: Procedure = { ...insertProcedure, id };
    this.procedures.set(id, procedure);
    return procedure;
  }

  async updateProcedure(id: string, updates: Partial<Procedure>): Promise<Procedure | undefined> {
    const procedure = this.procedures.get(id);
    if (!procedure) return undefined;
    const updated = { ...procedure, ...updates };
    this.procedures.set(id, updated);
    return updated;
  }

  async deleteProcedure(id: string): Promise<boolean> {
    return this.procedures.delete(id);
  }

  async getShareholderMetrics(): Promise<ShareholderMetric[]> {
    return Array.from(this.shareholderMetrics.values());
  }

  async getShareholderMetric(id: string): Promise<ShareholderMetric | undefined> {
    return this.shareholderMetrics.get(id);
  }

  async createShareholderMetric(insertMetric: InsertShareholderMetric): Promise<ShareholderMetric> {
    const id = randomUUID();
    const metric: ShareholderMetric = { ...insertMetric, id };
    this.shareholderMetrics.set(id, metric);
    return metric;
  }

  async updateShareholderMetric(id: string, updates: Partial<ShareholderMetric>): Promise<ShareholderMetric | undefined> {
    const metric = this.shareholderMetrics.get(id);
    if (!metric) return undefined;
    const updated = { ...metric, ...updates };
    this.shareholderMetrics.set(id, updated);
    return updated;
  }

  async deleteShareholderMetric(id: string): Promise<boolean> {
    return this.shareholderMetrics.delete(id);
  }

  async getDemographicData(): Promise<DemographicData[]> {
    return Array.from(this.demographicData.values());
  }

  async getDemographicDataById(id: string): Promise<DemographicData | undefined> {
    return this.demographicData.get(id);
  }

  async createDemographicData(insertData: InsertDemographicData): Promise<DemographicData> {
    const id = randomUUID();
    const data: DemographicData = { ...insertData, id };
    this.demographicData.set(id, data);
    return data;
  }

  async updateDemographicData(id: string, updates: Partial<DemographicData>): Promise<DemographicData | undefined> {
    const data = this.demographicData.get(id);
    if (!data) return undefined;
    const updated = { ...data, ...updates };
    this.demographicData.set(id, updated);
    return updated;
  }

  async deleteDemographicData(id: string): Promise<boolean> {
    return this.demographicData.delete(id);
  }

  private feedbackItems: Map<string, Feedback> = new Map();

  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbackItems.values());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const item: Feedback = { ...insertFeedback, id, createdAt: new Date() };
    this.feedbackItems.set(id, item);
    return item;
  }

  private async recalculateBlockProgress(blockId: string): Promise<void> {
    const checklistItems = await this.getChecklistItems(blockId);
    const evidences = await this.getEvidences(blockId);
    
    const totalItems = checklistItems.length + evidences.length;
    if (totalItems === 0) return;
    
    const completedChecklist = checklistItems.filter(item => item.completed).length;
    const completedEvidences = evidences.filter(ev => ev.status === "completed").length;
    const completedTotal = completedChecklist + completedEvidences;
    
    const progress = Math.round((completedTotal / totalItems) * 100);
    
    const block = this.blocks.get(blockId);
    if (block) {
      let status = "pending";
      if (progress === 100) status = "completed";
      else if (progress > 0) status = "in-progress";
      
      this.blocks.set(blockId, { ...block, progress, status });
    }
  }
}

export const storage = new MemStorage();
