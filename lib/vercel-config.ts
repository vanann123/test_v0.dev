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
      runtime?: string;
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
  redirects?: Array<{
    source: string;
    destination: string;
    permanent?: boolean;
  }>;
  rewrites?: Array<{
    source: string;
    destination: string;
  }>;
}

export const HOBBY_PLAN_LIMITS = {
  maxFunctions: 12,
  maxDuration: 10, // seconds
  maxMemory: 1024, // MB
  buildMinutes: 6000, // per month
  bandwidth: 100, // GB per month
  regions: 1, // single region only
};

export function validateHobbyPlanConfig(config: VercelConfig): string[] {
  const errors: string[] = [];

  // Check for conflicting properties
  if (config.routes && (config.headers || config.redirects || config.rewrites)) {
    errors.push("Cannot use 'routes' with 'headers', 'redirects', or 'rewrites'");
  }

  // Check function duration
  if (config.functions) {
    Object.entries(config.functions).forEach(([path, func]) => {
      if (func.maxDuration && func.maxDuration > HOBBY_PLAN_LIMITS.maxDuration) {
        errors.push(`Function ${path} duration ${func.maxDuration}s exceeds Hobby limit (${HOBBY_PLAN_LIMITS.maxDuration}s)`);
      }
      if (func.memory && func.memory > HOBBY_PLAN_LIMITS.maxMemory) {
        errors.push(`Function ${path} memory ${func.memory}MB exceeds Hobby limit (${HOBBY_PLAN_LIMITS.maxMemory}MB)`);
      }
    });
  }

  return errors;
}

export function createHobbyPlanConfig(): VercelConfig {
  return {
    version: 2,
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm ci",
    framework: "nextjs",
    functions: {
      "app/**/*.tsx": {
        maxDuration: HOBBY_PLAN_LIMITS.maxDuration,
        memory: HOBBY_PLAN_LIMITS.maxMemory,
      },
    },
    env: {
      NODE_ENV: "production",
    },
    build: {
      env: {
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
    headers: [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ],
  };
}
