export const LOGGER_CONFIG = {
  enabled: false, // Desativa todos os logs por padrão
  levels: {
    debug: false,
    info: false,
    warn: false,
    error: false
  }
};

export const logger = {
  debug: (...args: any[]) => {
    if (LOGGER_CONFIG.enabled && LOGGER_CONFIG.levels.debug) {
      console.debug(...args);
    }
  },
  info: (...args: any[]) => {
    if (LOGGER_CONFIG.enabled && LOGGER_CONFIG.levels.info) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (LOGGER_CONFIG.enabled && LOGGER_CONFIG.levels.warn) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (LOGGER_CONFIG.enabled && LOGGER_CONFIG.levels.error) {
      console.error(...args);
    }
  }
}; 