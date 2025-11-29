/**
 * Bloodstrike Master Optimizer
 * Combines FPS, Latency, and Memory optimizations
 */

class BloodstrikeOptimizer {
  constructor() {
    this.fpsOptimizer = null;
    this.latencyReducer = null;
    this.memoryOptimizer = null;
    this.settings = {
      maxFPS: 240,
      targetMS: 20,
      enableAll: false
    };
    this.performanceMonitor = null;
  }

  /**
   * Initialize all optimizers
   */
  initAll() {
    console.log('=== Bloodstrike Master Optimizer ===');
    
    // Initialize individual optimizers
    this.fpsOptimizer = new FPSOptimizer();
    this.latencyReducer = new LatencyReducer();
    this.memoryOptimizer = new MemoryOptimizer();

    this.fpsOptimizer.init();
    this.latencyReducer.init();
    this.memoryOptimizer.init();

    this.startPerformanceMonitoring();
    console.log('All optimizations initialized');
  }

  /**
   * Start continuous performance monitoring
   */
  startPerformanceMonitoring() {
    this.performanceMonitor = setInterval(() => {
      const fps = this.fpsOptimizer.monitorFPS();
      this.latencyReducer.measurePing();
      this.memoryOptimizer.autoOptimizeMemory();

      // Auto-adjust settings based on performance
      if (fps < 30) {
        console.warn('⚠ FPS Critical - Reducing quality');
        this.reducedMode();
      }
    }, 1000);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    clearInterval(this.performanceMonitor);
  }

  /**
   * Get comprehensive performance report
   */
  getPerformanceReport() {
    return {
      fps: {
        current: this.fpsOptimizer.getFPS(),
        target: this.settings.maxFPS
      },
      latency: this.latencyReducer.getNetworkStats(),
      memory: {
        usage: this.memoryOptimizer.getMemoryUsage() + 'MB'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reduced mode - maximum performance
   */
  reducedMode() {
    console.log('📉 Entering Reduced Mode (Max Performance)');
    return {
      graphics: 'ultra-low',
      textures: 'compressed',
      shadows: 'off',
      particles: 'minimal',
      network: 'aggressive-sync'
    };
  }

  /**
   * Balanced mode - default
   */
  balancedMode() {
    console.log('⚙ Entering Balanced Mode');
    return {
      graphics: 'medium',
      textures: 'compressed',
      shadows: 'low',
      particles: 'reduced',
      network: 'normal-sync'
    };
  }

  /**
   * Quality mode - higher settings
   */
  qualityMode() {
    console.log('🎨 Entering Quality Mode');
    return {
      graphics: 'high',
      textures: 'uncompressed',
      shadows: 'high',
      particles: 'full',
      network: 'normal-sync'
    };
  }

  /**
   * Emergency mode - maximum FPS
   */
  emergencyMode() {
    console.log('🚨 Emergency Mode Activated');
    this.memoryOptimizer.forceGarbageCollection();
    this.fpsOptimizer.autoadjustQuality();
    return {
      priority: 'fps-only',
      disableUI: true,
      minimizeNetwork: true,
      lowerResolution: true,
      targetFPS: 60
    };
  }

  /**
   * Configure custom settings
   */
  configure(options) {
    Object.assign(this.settings, options);
    console.log('Settings updated:', this.settings);
    return this.settings;
  }

  /**
   * Print detailed status
   */
  printStatus() {
    const report = this.getPerformanceReport();
    console.log('╔════════════════════════════════════╗');
    console.log('║   BLOODSTRIKE OPTIMIZER STATUS    ║');
    console.log('╠════════════════════════════════════╣');
    console.log(`║ FPS: ${report.fps.current.toString().padEnd(29)}║`);
    console.log(`║ Ping: ${report.latency.currentPing.toString().padEnd(28)}║`);
    console.log(`║ Memory: ${report.memory.usage.padEnd(26)}║`);
    console.log('╚════════════════════════════════════╝');
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BloodstrikeOptimizer;
}
