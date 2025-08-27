declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
    gtag_report_airdrop_conversion: () => boolean;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export {};
