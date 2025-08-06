export interface VercelConfig {
  version: number;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  framework?: string;
  functions?: {
    [key: string]: {
      maxDuration?: number;
      memory?: number;
    };
  };
  env?: Record<string, string>;
  build?: {
    env?: Record<string, string>;
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
    version: 2,
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm install",
    framework: "nextjs",
    functions: {
      "app/**/*.tsx": {
        maxDuration: 10, // Hobby plan limit
      }
    },
    env: {
      NODE_ENV: "production"
    },
    build: {
      env: {
        NEXT_TELEMETRY_DISABLED: "1"
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

  // Check for multiple regions
  if ('regions' in config) {
    errors.push("Multiple regions not supported on Hobby plan");
  }

  // Check function duration
  if (config.functions) {
    Object.values(config.functions).forEach(func => {
      if (func.maxDuration && func.maxDuration > 10) {
        errors.push(`Function duration ${func.maxDuration}s exceeds Hobby limit (10s)`);
      }
    });
  }

  return errors;
}
