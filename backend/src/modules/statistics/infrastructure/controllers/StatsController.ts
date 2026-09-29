import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { StatsAdapter } from "../adapters/StatsAdapter";
import { GetAdvancedStats } from "../../application/use-cases/GetAdvancedStats";

const statsAdapter = new StatsAdapter();

export class StatsController {
  // GET /stats/advanced
  static async getAdvanced(req: AuthRequest, res: Response) {
    try {
      const stats = await new GetAdvancedStats(statsAdapter).execute();
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
