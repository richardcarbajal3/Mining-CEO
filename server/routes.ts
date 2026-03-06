import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./dbStorage";
import { 
  insertBlockSchema,
  insertChecklistItemSchema,
  insertEvidenceSchema,
  insertStakeholderSchema,
  insertStakeholderParticipationSchema,
  insertKpiSchema,
  insertProcedureSchema,
  insertShareholderMetricSchema,
  insertDemographicDataSchema,
  insertContractSchema
} from "@shared/schema";

const storage = dbStorage;

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/blocks", async (req, res) => {
    try {
      const blocks = await storage.getBlocks();
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocks" });
    }
  });

  app.get("/api/blocks/:id", async (req, res) => {
    try {
      const block = await storage.getBlock(req.params.id);
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch block" });
    }
  });

  app.post("/api/blocks", async (req, res) => {
    try {
      const validatedData = insertBlockSchema.parse(req.body);
      const block = await storage.createBlock(validatedData);
      res.status(201).json(block);
    } catch (error) {
      res.status(400).json({ error: "Invalid block data" });
    }
  });

  app.patch("/api/blocks/:id", async (req, res) => {
    try {
      const block = await storage.updateBlock(req.params.id, req.body);
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: "Failed to update block" });
    }
  });

  app.delete("/api/blocks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlock(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Block not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete block" });
    }
  });

  app.get("/api/checklist-items", async (req, res) => {
    try {
      const blockId = req.query.blockId as string | undefined;
      const items = await storage.getChecklistItems(blockId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checklist items" });
    }
  });

  app.get("/api/checklist-items/:id", async (req, res) => {
    try {
      const item = await storage.getChecklistItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checklist item" });
    }
  });

  app.post("/api/checklist-items", async (req, res) => {
    try {
      const validatedData = insertChecklistItemSchema.parse(req.body);
      const item = await storage.createChecklistItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid checklist item data" });
    }
  });

  app.patch("/api/checklist-items/:id", async (req, res) => {
    try {
      const item = await storage.updateChecklistItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update checklist item" });
    }
  });

  app.get("/api/evidences", async (req, res) => {
    try {
      const blockId = req.query.blockId as string | undefined;
      const evidences = await storage.getEvidences(blockId);
      res.json(evidences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evidences" });
    }
  });

  app.get("/api/evidences/:id", async (req, res) => {
    try {
      const evidence = await storage.getEvidence(req.params.id);
      if (!evidence) {
        return res.status(404).json({ error: "Evidence not found" });
      }
      res.json(evidence);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evidence" });
    }
  });

  app.post("/api/evidences", async (req, res) => {
    try {
      const validatedData = insertEvidenceSchema.parse(req.body);
      const evidence = await storage.createEvidence(validatedData);
      res.status(201).json(evidence);
    } catch (error) {
      res.status(400).json({ error: "Invalid evidence data" });
    }
  });

  app.patch("/api/evidences/:id", async (req, res) => {
    try {
      const evidence = await storage.updateEvidence(req.params.id, req.body);
      if (!evidence) {
        return res.status(404).json({ error: "Evidence not found" });
      }
      res.json(evidence);
    } catch (error) {
      res.status(500).json({ error: "Failed to update evidence" });
    }
  });

  app.delete("/api/evidences/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvidence(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Evidence not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete evidence" });
    }
  });

  app.get("/api/stakeholders", async (req, res) => {
    try {
      const stakeholders = await storage.getStakeholders();
      res.json(stakeholders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stakeholders" });
    }
  });

  app.get("/api/stakeholders/:id", async (req, res) => {
    try {
      const stakeholder = await storage.getStakeholder(req.params.id);
      if (!stakeholder) {
        return res.status(404).json({ error: "Stakeholder not found" });
      }
      res.json(stakeholder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stakeholder" });
    }
  });

  app.post("/api/stakeholders", async (req, res) => {
    try {
      const validatedData = insertStakeholderSchema.parse(req.body);
      const stakeholder = await storage.createStakeholder(validatedData);
      res.status(201).json(stakeholder);
    } catch (error) {
      res.status(400).json({ error: "Invalid stakeholder data" });
    }
  });

  app.patch("/api/stakeholders/:id", async (req, res) => {
    try {
      const stakeholder = await storage.updateStakeholder(req.params.id, req.body);
      if (!stakeholder) {
        return res.status(404).json({ error: "Stakeholder not found" });
      }
      res.json(stakeholder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stakeholder" });
    }
  });

  app.delete("/api/stakeholders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStakeholder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Stakeholder not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stakeholder" });
    }
  });

  app.get("/api/stakeholder-participation", async (req, res) => {
    try {
      const stakeholderId = req.query.stakeholderId as string | undefined;
      const participation = await storage.getStakeholderParticipation(stakeholderId);
      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stakeholder participation" });
    }
  });

  app.post("/api/stakeholder-participation", async (req, res) => {
    try {
      const validatedData = insertStakeholderParticipationSchema.parse(req.body);
      const participation = await storage.createStakeholderParticipation(validatedData);
      res.status(201).json(participation);
    } catch (error) {
      res.status(400).json({ error: "Invalid participation data" });
    }
  });

  app.patch("/api/stakeholder-participation/:id", async (req, res) => {
    try {
      const participation = await storage.updateStakeholderParticipation(req.params.id, req.body);
      if (!participation) {
        return res.status(404).json({ error: "Participation not found" });
      }
      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participation" });
    }
  });

  app.get("/api/kpis", async (req, res) => {
    try {
      const blockId = req.query.blockId as string | undefined;
      const kpis = await storage.getKpis(blockId);
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPIs" });
    }
  });

  app.get("/api/kpis/:id", async (req, res) => {
    try {
      const kpi = await storage.getKpi(req.params.id);
      if (!kpi) {
        return res.status(404).json({ error: "KPI not found" });
      }
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI" });
    }
  });

  app.post("/api/kpis", async (req, res) => {
    try {
      const validatedData = insertKpiSchema.parse(req.body);
      const kpi = await storage.createKpi(validatedData);
      res.status(201).json(kpi);
    } catch (error) {
      res.status(400).json({ error: "Invalid KPI data" });
    }
  });

  app.patch("/api/kpis/:id", async (req, res) => {
    try {
      const kpi = await storage.updateKpi(req.params.id, req.body);
      if (!kpi) {
        return res.status(404).json({ error: "KPI not found" });
      }
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ error: "Failed to update KPI" });
    }
  });

  app.delete("/api/kpis/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteKpi(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "KPI not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete KPI" });
    }
  });

  app.get("/api/procedures", async (req, res) => {
    try {
      const procedures = await storage.getProcedures();
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch procedures" });
    }
  });

  app.get("/api/procedures/:id", async (req, res) => {
    try {
      const procedure = await storage.getProcedure(req.params.id);
      if (!procedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch procedure" });
    }
  });

  app.post("/api/procedures", async (req, res) => {
    try {
      const validatedData = insertProcedureSchema.parse(req.body);
      const procedure = await storage.createProcedure(validatedData);
      res.status(201).json(procedure);
    } catch (error) {
      res.status(400).json({ error: "Invalid procedure data" });
    }
  });

  app.patch("/api/procedures/:id", async (req, res) => {
    try {
      const procedure = await storage.updateProcedure(req.params.id, req.body);
      if (!procedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      res.status(500).json({ error: "Failed to update procedure" });
    }
  });

  app.delete("/api/procedures/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProcedure(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete procedure" });
    }
  });

  app.get("/api/shareholder-metrics", async (req, res) => {
    try {
      const metrics = await storage.getShareholderMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shareholder metrics" });
    }
  });

  app.get("/api/shareholder-metrics/:id", async (req, res) => {
    try {
      const metric = await storage.getShareholderMetric(req.params.id);
      if (!metric) {
        return res.status(404).json({ error: "Shareholder metric not found" });
      }
      res.json(metric);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shareholder metric" });
    }
  });

  app.post("/api/shareholder-metrics", async (req, res) => {
    try {
      const validatedData = insertShareholderMetricSchema.parse(req.body);
      const metric = await storage.createShareholderMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid metric data" });
    }
  });

  app.patch("/api/shareholder-metrics/:id", async (req, res) => {
    try {
      const metric = await storage.updateShareholderMetric(req.params.id, req.body);
      if (!metric) {
        return res.status(404).json({ error: "Shareholder metric not found" });
      }
      res.json(metric);
    } catch (error) {
      res.status(500).json({ error: "Failed to update shareholder metric" });
    }
  });

  app.delete("/api/shareholder-metrics/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteShareholderMetric(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Shareholder metric not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shareholder metric" });
    }
  });

  app.get("/api/demographic-data", async (req, res) => {
    try {
      const data = await storage.getDemographicData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demographic data" });
    }
  });

  app.get("/api/demographic-data/:id", async (req, res) => {
    try {
      const data = await storage.getDemographicDataById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Demographic data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demographic data" });
    }
  });

  app.post("/api/demographic-data", async (req, res) => {
    try {
      const validatedData = insertDemographicDataSchema.parse(req.body);
      const data = await storage.createDemographicData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid demographic data" });
    }
  });

  app.patch("/api/demographic-data/:id", async (req, res) => {
    try {
      const data = await storage.updateDemographicData(req.params.id, req.body);
      if (!data) {
        return res.status(404).json({ error: "Demographic data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update demographic data" });
    }
  });

  app.delete("/api/demographic-data/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDemographicData(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Demographic data not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete demographic data" });
    }
  });

  app.get("/api/contracts", async (req, res) => {
    try {
      const contractsList = await storage.getContracts();
      res.json(contractsList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ error: "Invalid contract data" });
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const contract = await storage.updateContract(req.params.id, req.body);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contract" });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContract(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contract" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
