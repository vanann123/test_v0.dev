declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: {
        page_path?: string;
        event_category?: string;
        value?: number;
        event_label?: string;
        non_interaction?: boolean;
      }
    ) => void;
  }
}

export {};
