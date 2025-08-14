declare global {
  interface Window {
  }
}

export interface VastuDosha {
  location: string;
  problem: string;
  impact: string;
  remedy: {
    description: string;
    items: string[];
  };
}

export interface VastuReport {
  overall_summary: string;
  doshas: VastuDosha[];
}