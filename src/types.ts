// Since html2canvas and jsPDF are loaded via CDN,
// we declare their types on the window object for TypeScript.
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    jspdf: {
      jsPDF: new (options?: any) => any;
    };
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