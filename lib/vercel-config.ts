export interface VercelConfig {
  framework: string;
  installCommand: string;
  buildCommand: string;
  functions?: {
    [key: string]: {
      maxDuration: number;
    };
  };
  headers?: Array<{
    source: string;
    headers: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export function createHobbyPlanConfig(): VercelConfig {
  return {
    framework: "nextjs",
    installCommand: "npm install",
    buildCommand: "npm run build",
    functions: {
      "app/**/*.{js,ts}": {
        maxDuration: 10 // Hobby plan limit
      }
    },
    headers: [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options", 
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          }
        ]
      }
    ]
  };
}

export function validateHobbyPlanConfig(config: VercelConfig): string[] {
  const errors: string[] = [];
  
  // Check function duration
  if (config.functions) {
    Object.values(config.functions).forEach(func => {
      if (func.maxDuration > 10) {
        errors.push(`Function maxDuration ${func.maxDuration}s exceeds Hobby plan limit (10s)`);
      }
    });
  }
  
  return errors;
}
