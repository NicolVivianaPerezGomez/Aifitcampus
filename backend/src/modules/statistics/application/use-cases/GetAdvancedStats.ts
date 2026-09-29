import { StatsPort } from "../../domain/ports/StatsPort";
import { AdvancedStats } from "../../domain/entities/Stats";

export class GetAdvancedStats {
  constructor(private statsPort: StatsPort) {}

  async execute(): Promise<AdvancedStats> {
    return this.statsPort.getAdvancedStats();
  }
}
