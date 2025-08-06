// Vercel configuration utilities for different plans

export interface VercelPlanLimits {
  maxFunctionDuration: number;
  maxFunctionMemory: number;
  maxFunctions: number;
  supportsMultipleRegions: boolean;
  supportsEdgeFunctions: boolean;
}

export const VERCEL_PLANS: Record<string, VercelPlanLimits> = {
  hobby: {
    maxFunctionDuration: 10, // seconds
    maxFunctionMemory: 1024, // MB
    maxFunctions: 12,
    supportsMultipleRegions: false,
    supportsEdgeFunctions: false,
  },
  pro: {
    maxFunctionDuration: 60, // seconds
    maxFunctionMemory: 3008, // MB
    maxFunctions: 100,
    supportsMultipleRegions: true,
    supportsEdgeFunctions: true,
  },
  enterprise: {
    maxFunctionDuration: 900, // seconds (15 minutes)
    maxFunctionMemory: 3008, // MB
    maxFunctions: 1000,
    supportsMultipleRegions: true,
    supportsEdgeFunctions: true,
  },
};

export function generateVercelConfig(plan: keyof typeof VERCEL_PLANS = 'hobby') {
  const limits = VERCEL_PLANS[plan];
  
  const config: any = {
    version: 2,
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm ci",
    framework: "nextjs",
    functions: {
      "app/**/*.tsx": {
        maxDuration: Math.min(30, limits.maxFunctionDuration),
        memory: Math.min(1024, limits.maxFunctionMemory),
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

  // Add regions only for Pro and Enterprise
  if (limits.supportsMultipleRegions) {
    config.regions = ["hnd1", "sfo1"];
  }

  return config;
}

export function validateConfig(config: any, plan: keyof typeof VERCEL_PLANS = 'hobby') {
  const limits = VERCEL_PLANS[plan];
  const issues: string[] = [];

  // Check regions
  if (config.regions && !limits.supportsMultipleRegions) {
    issues.push(`Multiple regions not supported on ${plan} plan`);
  }

  // Check function duration
  if (config.functions) {
    Object.values(config.functions).forEach((func: any) => {
      if (func.maxDuration && func.maxDuration > limits.maxFunctionDuration) {
        issues.push(`Function duration ${func.maxDuration}s exceeds ${limits.maxFunctionDuration}s limit`);
      }
      if (func.memory && func.memory > limits.maxFunctionMemory) {
        issues.push(`Function memory ${func.memory}MB exceeds ${limits.maxFunctionMemory}MB limit`);
      }
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
