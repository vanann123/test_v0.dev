export interface VercelConfig {
  version: number;
  installCommand?: string;
  buildCommand?: string;
  functions?: {
    [key: string]: {
      maxDuration: number;
    };
  };
}

export function createHobbyPlanConfig(): VercelConfig {
  return {
    version: 2,
    installCommand: "npm install",
    buildCommand: "npm run build",
    functions: {
      "app/**/*.js": {
        maxDuration: 10
      },
      "pages/api/**/*.js": {
        maxDuration: 10
      }
    }
  };
}

export function validateHobbyPlanConfig(config: VercelConfig): boolean {
  // Check for regions (not allowed on Hobby)
  if ('regions' in config) {
    console.error('❌ Regions not supported on Hobby plan');
    return false;
  }
  
  // Check function duration
  if (config.functions) {
    for (const [path, settings] of Object.entries(config.functions)) {
      if (settings.maxDuration > 10) {
        console.error(`❌ Function ${path} duration ${settings.maxDuration}s exceeds Hobby limit (10s)`);
        return false;
      }
    }
  }
  
  console.log('✅ Configuration valid for Hobby plan');
  return true;
}
