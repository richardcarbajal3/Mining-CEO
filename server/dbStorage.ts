import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  blocks, checklistItems, evidences, stakeholders, stakeholderParticipation,
  kpis, procedures, shareholderMetrics, demographicData, contracts, feedback,
  type Block, type InsertBlock, type ChecklistItem, type InsertChecklistItem,
  type Evidence, type InsertEvidence, type Stakeholder, type InsertStakeholder,
  type StakeholderParticipation, type InsertStakeholderParticipation,
  type Kpi, type InsertKpi, type Procedure, type InsertProcedure,
  type ShareholderMetric, type InsertShareholderMetric,
  type DemographicData, type InsertDemographicData,
  type Contract, type InsertContract,
  type Feedback, type InsertFeedback
} from "@shared/schema";
import { IStorage } from "./storage";
import { randomUUID } from "crypto";

export class DatabaseStorage implements IStorage {
  async getBlocks(): Promise<Block[]> {
    return await db.select().from(blocks);
  }

  async getBlock(id: string): Promise<Block | undefined> {
    const result = await db.select().from(blocks).where(eq(blocks.id, id));
    return result[0];
  }

  async createBlock(insertBlock: InsertBlock): Promise<Block> {
    const id = randomUUID();
    const result = await db.insert(blocks).values({ ...insertBlock, id }).returning();
    return result[0];
  }

  async updateBlock(id: string, updates: Partial<Block>): Promise<Block | undefined> {
    const result = await db.update(blocks).set(updates).where(eq(blocks.id, id)).returning();
    return result[0];
  }

  async deleteBlock(id: string): Promise<boolean> {
    const result = await db.delete(blocks).where(eq(blocks.id, id)).returning();
    return result.length > 0;
  }

  async getChecklistItems(blockId?: string): Promise<ChecklistItem[]> {
    if (blockId) {
      return await db.select().from(checklistItems).where(eq(checklistItems.blockId, blockId));
    }
    return await db.select().from(checklistItems);
  }

  async getChecklistItem(id: string): Promise<ChecklistItem | undefined> {
    const result = await db.select().from(checklistItems).where(eq(checklistItems.id, id));
    return result[0];
  }

  async createChecklistItem(insertItem: InsertChecklistItem): Promise<ChecklistItem> {
    const id = randomUUID();
    const result = await db.insert(checklistItems).values({ ...insertItem, id }).returning();
    return result[0];
  }

  async updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | undefined> {
    const result = await db.update(checklistItems).set(updates).where(eq(checklistItems.id, id)).returning();
    if (result[0]) {
      await this.recalculateBlockProgress(result[0].blockId);
    }
    return result[0];
  }

  async getEvidences(blockId?: string): Promise<Evidence[]> {
    if (blockId) {
      return await db.select().from(evidences).where(eq(evidences.blockId, blockId));
    }
    return await db.select().from(evidences);
  }

  async getEvidence(id: string): Promise<Evidence | undefined> {
    const result = await db.select().from(evidences).where(eq(evidences.id, id));
    return result[0];
  }

  async createEvidence(insertEvidence: InsertEvidence): Promise<Evidence> {
    const id = randomUUID();
    const result = await db.insert(evidences).values({ ...insertEvidence, id }).returning();
    return result[0];
  }

  async updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence | undefined> {
    const result = await db.update(evidences).set(updates).where(eq(evidences.id, id)).returning();
    if (result[0]) {
      await this.recalculateBlockProgress(result[0].blockId);
    }
    return result[0];
  }

  async deleteEvidence(id: string): Promise<boolean> {
    const result = await db.delete(evidences).where(eq(evidences.id, id)).returning();
    return result.length > 0;
  }

  async getStakeholders(): Promise<Stakeholder[]> {
    return await db.select().from(stakeholders);
  }

  async getStakeholder(id: string): Promise<Stakeholder | undefined> {
    const result = await db.select().from(stakeholders).where(eq(stakeholders.id, id));
    return result[0];
  }

  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const id = randomUUID();
    const result = await db.insert(stakeholders).values({ ...insertStakeholder, id }).returning();
    return result[0];
  }

  async updateStakeholder(id: string, updates: Partial<Stakeholder>): Promise<Stakeholder | undefined> {
    const result = await db.update(stakeholders).set(updates).where(eq(stakeholders.id, id)).returning();
    return result[0];
  }

  async deleteStakeholder(id: string): Promise<boolean> {
    const result = await db.delete(stakeholders).where(eq(stakeholders.id, id)).returning();
    return result.length > 0;
  }

  async getStakeholderParticipation(stakeholderId?: string): Promise<StakeholderParticipation[]> {
    if (stakeholderId) {
      return await db.select().from(stakeholderParticipation).where(eq(stakeholderParticipation.stakeholderId, stakeholderId));
    }
    return await db.select().from(stakeholderParticipation);
  }

  async createStakeholderParticipation(insertParticipation: InsertStakeholderParticipation): Promise<StakeholderParticipation> {
    const id = randomUUID();
    const result = await db.insert(stakeholderParticipation).values({ ...insertParticipation, id }).returning();
    return result[0];
  }

  async updateStakeholderParticipation(id: string, updates: Partial<StakeholderParticipation>): Promise<StakeholderParticipation | undefined> {
    const result = await db.update(stakeholderParticipation).set(updates).where(eq(stakeholderParticipation.id, id)).returning();
    return result[0];
  }

  async getKpis(blockId?: string): Promise<Kpi[]> {
    if (blockId) {
      return await db.select().from(kpis).where(eq(kpis.blockId, blockId));
    }
    return await db.select().from(kpis);
  }

  async getKpi(id: string): Promise<Kpi | undefined> {
    const result = await db.select().from(kpis).where(eq(kpis.id, id));
    return result[0];
  }

  async createKpi(insertKpi: InsertKpi): Promise<Kpi> {
    const id = randomUUID();
    const result = await db.insert(kpis).values({ ...insertKpi, id }).returning();
    return result[0];
  }

  async updateKpi(id: string, updates: Partial<Kpi>): Promise<Kpi | undefined> {
    const result = await db.update(kpis).set(updates).where(eq(kpis.id, id)).returning();
    return result[0];
  }

  async deleteKpi(id: string): Promise<boolean> {
    const result = await db.delete(kpis).where(eq(kpis.id, id)).returning();
    return result.length > 0;
  }

  async getProcedures(): Promise<Procedure[]> {
    return await db.select().from(procedures);
  }

  async getProcedure(id: string): Promise<Procedure | undefined> {
    const result = await db.select().from(procedures).where(eq(procedures.id, id));
    return result[0];
  }

  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const id = randomUUID();
    const result = await db.insert(procedures).values({ ...insertProcedure, id }).returning();
    return result[0];
  }

  async updateProcedure(id: string, updates: Partial<Procedure>): Promise<Procedure | undefined> {
    const result = await db.update(procedures).set(updates).where(eq(procedures.id, id)).returning();
    return result[0];
  }

  async deleteProcedure(id: string): Promise<boolean> {
    const result = await db.delete(procedures).where(eq(procedures.id, id)).returning();
    return result.length > 0;
  }

  async getShareholderMetrics(): Promise<ShareholderMetric[]> {
    return await db.select().from(shareholderMetrics);
  }

  async getShareholderMetric(id: string): Promise<ShareholderMetric | undefined> {
    const result = await db.select().from(shareholderMetrics).where(eq(shareholderMetrics.id, id));
    return result[0];
  }

  async createShareholderMetric(insertMetric: InsertShareholderMetric): Promise<ShareholderMetric> {
    const id = randomUUID();
    const result = await db.insert(shareholderMetrics).values({ ...insertMetric, id }).returning();
    return result[0];
  }

  async updateShareholderMetric(id: string, updates: Partial<ShareholderMetric>): Promise<ShareholderMetric | undefined> {
    const result = await db.update(shareholderMetrics).set(updates).where(eq(shareholderMetrics.id, id)).returning();
    return result[0];
  }

  async deleteShareholderMetric(id: string): Promise<boolean> {
    const result = await db.delete(shareholderMetrics).where(eq(shareholderMetrics.id, id)).returning();
    return result.length > 0;
  }

  async getDemographicData(): Promise<DemographicData[]> {
    return await db.select().from(demographicData);
  }

  async getDemographicDataById(id: string): Promise<DemographicData | undefined> {
    const result = await db.select().from(demographicData).where(eq(demographicData.id, id));
    return result[0];
  }

  async createDemographicData(insertData: InsertDemographicData): Promise<DemographicData> {
    const id = randomUUID();
    const result = await db.insert(demographicData).values({ ...insertData, id }).returning();
    return result[0];
  }

  async updateDemographicData(id: string, updates: Partial<DemographicData>): Promise<DemographicData | undefined> {
    const result = await db.update(demographicData).set(updates).where(eq(demographicData.id, id)).returning();
    return result[0];
  }

  async deleteDemographicData(id: string): Promise<boolean> {
    const result = await db.delete(demographicData).where(eq(demographicData.id, id)).returning();
    return result.length > 0;
  }

  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contracts);
  }

  async getContract(id: string): Promise<Contract | undefined> {
    const result = await db.select().from(contracts).where(eq(contracts.id, id));
    return result[0];
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = randomUUID();
    const result = await db.insert(contracts).values({ ...insertContract, id }).returning();
    return result[0];
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | undefined> {
    const result = await db.update(contracts).set(updates).where(eq(contracts.id, id)).returning();
    return result[0];
  }

  async deleteContract(id: string): Promise<boolean> {
    const result = await db.delete(contracts).where(eq(contracts.id, id)).returning();
    return result.length > 0;
  }

  async getFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const result = await db.insert(feedback).values({ ...insertFeedback, id }).returning();
    return result[0];
  }

  private async recalculateBlockProgress(blockId: string): Promise<void> {
    const checklistItemsList = await this.getChecklistItems(blockId);
    const evidencesList = await this.getEvidences(blockId);
    
    const totalItems = checklistItemsList.length + evidencesList.length;
    if (totalItems === 0) return;
    
    const completedChecklist = checklistItemsList.filter(item => item.completed).length;
    const completedEvidences = evidencesList.filter(ev => ev.status === "completed").length;
    const completedTotal = completedChecklist + completedEvidences;
    
    const progress = Math.round((completedTotal / totalItems) * 100);
    
    let status = "pending";
    if (progress === 100) status = "completed";
    else if (progress > 0) status = "in-progress";
    
    await this.updateBlock(blockId, { progress, status });
  }

  async seedInitialData(): Promise<void> {
    const existingBlocks = await this.getBlocks();
    if (existingBlocks.length > 0) return;

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

    const createdBlocks: Block[] = [];
    for (const data of blockData) {
      const block = await db.insert(blocks).values({ ...data, id: `block-${data.number}` }).returning();
      createdBlocks.push(block[0]);
    }

    await db.insert(checklistItems).values([
      { id: "check-1", blockId: "block-1", title: "Completar estudio de exploración geológica", description: "Mapeo completo del yacimiento", completed: true, category: "Exploración", order: 1 },
      { id: "check-2", blockId: "block-1", title: "Evaluación de recursos minerales", description: "Cuantificación de reservas", completed: true, category: "Exploración", order: 2 },
      { id: "check-3", blockId: "block-1", title: "Plan de desarrollo minero", description: "Diseño de infraestructura", completed: false, category: "Desarrollo", order: 3 },
      { id: "check-4", blockId: "block-2", title: "Revisar contratos con proveedores", description: "Actualización anual de términos", completed: false, category: "Proveedores", order: 1 },
      { id: "check-5", blockId: "block-2", title: "Contratos de servicios internos", description: "SLAs entre departamentos", completed: true, category: "Internos", order: 2 }
    ]);

    await db.insert(evidences).values([
      { id: "ev-1", blockId: "block-1", title: "Informe Geológico Q3 2025", description: "Análisis detallado de muestras", type: "Reporte Técnico", status: "completed", documentUrl: null, notes: "Aprobado por gerencia técnica" },
      { id: "ev-2", blockId: "block-1", title: "Certificado ISO 14001", description: "Gestión ambiental", type: "Certificación", status: "completed", documentUrl: null, notes: null },
      { id: "ev-3", blockId: "block-2", title: "Contrato Marco Proveedores", description: "Documento legal vigente", type: "Contrato", status: "in-progress", documentUrl: null, notes: "Pendiente firma de gerencia" }
    ]);

    await db.insert(stakeholders).values([
      { id: "sh-1", name: "María González", role: "Gerente de Operaciones", type: "internal", email: "maria.gonzalez@minera.com", phone: "+56 9 1234 5678", avatar: null },
      { id: "sh-2", name: "Carlos Rodríguez", role: "Jefe de Geología", type: "internal", email: "carlos.rodriguez@minera.com", phone: "+56 9 8765 4321", avatar: null },
      { id: "sh-3", name: "Comunidad Local Andina", role: "Representante Comunitario", type: "external", email: "contacto@comunidadandina.cl", phone: "+56 9 5555 1234", avatar: null },
      { id: "sh-4", name: "SERNAGEOMIN", role: "Autoridad Reguladora", type: "external", email: "info@sernageomin.cl", phone: null, avatar: null }
    ]);

    await db.insert(stakeholderParticipation).values([
      { id: "sp-1", stakeholderId: "sh-1", blockId: "block-1", participationLevel: "high", commitmentStatus: "completed", notes: "Liderazgo activo en fase operacional" },
      { id: "sp-2", stakeholderId: "sh-1", blockId: "block-2", participationLevel: "medium", commitmentStatus: "in-progress", notes: "Revisión de contratos operacionales" },
      { id: "sp-3", stakeholderId: "sh-2", blockId: "block-1", participationLevel: "high", commitmentStatus: "completed", notes: "Responsable técnico de exploración" },
      { id: "sp-4", stakeholderId: "sh-3", blockId: "block-8", participationLevel: "high", commitmentStatus: "in-progress", notes: "Consulta y participación comunitaria" }
    ]);

    await db.insert(kpis).values([
      { id: "kpi-1", blockId: "block-1", name: "Toneladas Extraídas", value: 8500, target: 10000, unit: "ton", trend: "up" },
      { id: "kpi-2", blockId: "block-1", name: "Eficiencia Operacional", value: 87, target: 90, unit: "%", trend: "up" },
      { id: "kpi-3", blockId: "block-4", name: "Cumplimiento de Plazos", value: 92, target: 95, unit: "%", trend: "stable" },
      { id: "kpi-4", blockId: "block-5", name: "Procesos Automatizados", value: 12, target: 25, unit: "procesos", trend: "up" }
    ]);

    await db.insert(procedures).values([
      { id: "proc-1", title: "Procedimiento de Seguridad Minera", category: "Seguridad", content: "Todos los trabajadores deben utilizar equipos de protección personal (EPP) en todo momento.", normative: "DS 132 - Reglamento de Seguridad Minera" },
      { id: "proc-2", title: "Gestión Ambiental", category: "Medio Ambiente", content: "Monitoreo continuo de emisiones, gestión de residuos según clasificación.", normative: "ISO 14001, Ley 19.300" },
      { id: "proc-3", title: "Estándares Contables Mineros", category: "Finanzas", content: "Aplicación de IFRS para empresas mineras, valoración de activos minerales.", normative: "IFRS, ACCA, Normas Locales" },
      { id: "proc-4", title: "Relaciones Comunitarias", category: "Social", content: "Consulta previa a comunidades, programas de desarrollo local.", normative: "Convenio 169 OIT" }
    ]);

    await db.insert(shareholderMetrics).values([
      { id: "sm-1", metricName: "Retorno de Inversión (ROI)", value: 18, description: "Rentabilidad anual del proyecto", trend: "up" },
      { id: "sm-2", metricName: "Credibilidad Corporativa", value: 85, description: "Índice de confianza de inversionistas", trend: "stable" },
      { id: "sm-3", metricName: "Cumplimiento de Objetivos", value: 92, description: "Logro de metas estratégicas", trend: "up" },
      { id: "sm-4", metricName: "Aceptación del Mercado", value: 78, description: "Valoración bursátil y reputación", trend: "stable" }
    ]);

    await db.insert(demographicData).values([
      { id: "dd-1", category: "Demografía", title: "Población Área de Influencia", value: "15,000 habitantes", description: "Radio de 50km del proyecto" },
      { id: "dd-2", category: "Cultura", title: "Comunidades Indígenas", value: "3 comunidades", description: "Pueblos originarios con participación activa" },
      { id: "dd-3", category: "Valores", title: "Empleo Local", value: "65%", description: "Porcentaje de contratación local" },
      { id: "dd-4", category: "Tendencias", title: "Migración hacia zona minera", value: "+8% anual", description: "Crecimiento poblacional por oportunidades laborales" },
      { id: "dd-5", category: "Demografía", title: "Edad Promedio", value: "32 años", description: "Población económicamente activa" },
      { id: "dd-6", category: "Valores", title: "Inversión Social", value: "$2.5M USD/año", description: "Programas de desarrollo comunitario" }
    ]);

    console.log("Initial data seeded successfully");
  }
}

export const dbStorage = new DatabaseStorage();
