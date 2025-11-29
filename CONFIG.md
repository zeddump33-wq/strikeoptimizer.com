# Bloodstrike FPS & MS Optimizer Configuration

## Overview
This optimization suite provides three specialized modules for improving Bloodstrike performance:
- **FPS Optimizer** - Frame rate improvements
- **Latency Reducer** - Network/MS reduction
- **Memory Optimizer** - RAM and stability

---

## Quick Start

### Basic Usage
```javascript
const optimizer = new BloodstrikeOptimizer();
optimizer.initAll();
optimizer.printStatus();
```

### Get Performance Report
```javascript
const report = optimizer.getPerformanceReport();
console.log(report);
```

---

## Configuration Modes

### 1. Reduced Mode (Maximum FPS)
Best for low-end systems or competitive gameplay
```javascript
optimizer.reducedMode();
```
- Ultra-low graphics
- Compressed textures
- No shadows
- Minimal particles

### 2. Balanced Mode (Default)
Good mix of performance and visuals
```javascript
optimizer.balancedMode();
```
- Medium graphics
- Compressed textures
- Low shadows
- Reduced particles

### 3. Quality Mode
Best visual quality with decent performance
```javascript
optimizer.qualityMode();
```
- High graphics
- Full resolution textures
- High shadows
- Full particles

### 4. Emergency Mode
When FPS drops critically low
```javascript
optimizer.emergencyMode();
```
- Maximum FPS focus
- Disables UI elements
- Minimal network traffic
- Lower resolution

---

## FPS Optimization Settings

### Graphics Quality Settings
- **renderScale**: 0.8 (reduces resolution scaling)
- **shadowQuality**: 'low'
- **textureQuality**: 'medium'
- **antiAliasing**: 'fxaa' (Fast Approximate AA)
- **particleQuality**: 'low'

### Performance Features
- ✓ Frame skipping for smoother gameplay
- ✓ Batch rendering
- ✓ Object pooling
- ✓ Frustum culling
- ✓ Occlusion culling
- ✓ Level of Detail (LOD) system

### Monitoring
```javascript
const fps = optimizer.fpsOptimizer.monitorFPS();
const currentFPS = optimizer.fpsOptimizer.getFPS();
```

---

## Latency (MS) Optimization Settings

### Network Optimizations
- **TCP No Delay**: Enabled (disables Nagle's algorithm)
- **Packet Compression**: Level 6 (ZSTD)
- **Client-Side Prediction**: Enabled
- **Server Reconciliation**: Enabled
- **Delta Compression**: Only send changes

### Advanced Features
- ✓ Predictive synchronization
- ✓ Entity snapshot culling
- ✓ Input aggregation
- ✓ Adaptive jitter buffer
- ✓ DNS optimization

### Monitoring
```javascript
optimizer.latencyReducer.measurePing();
const stats = optimizer.latencyReducer.getNetworkStats();
// Returns: { currentPing, averagePing, packetLoss, etc. }
```

### Network Culling Settings
```
Player updates: 200 units (2 tick delay)
NPC updates: 500 units
Projectile updates: 100 units
```

---

## Memory Optimization Settings

### Memory Pooling
- **Bullet Pool**: 1000 bullets
- **Particle Pool**: 5000 particles
- **Entity Pool**: 500 entities
- **Audio Pool**: 100 sounds
- **Decal Pool**: 200 decals

### Asset Compression
- **Texture Format**: BC1/BC4/BC6H (DirectX compression)
- **Universal Format**: BASIS
- **Max Texture Resolution**: 1024px
- **Audio Quality**: Medium

### Features
- ✓ Aggressive garbage collection every 30s
- ✓ Lazy loading of assets
- ✓ Streaming assets
- ✓ Automatic unloading of distant assets
- ✓ Disable expensive post-processing

### Monitoring
```javascript
const usage = optimizer.memoryOptimizer.getMemoryUsage();
optimizer.memoryOptimizer.autoOptimizeMemory();
```

---

## Performance Targets

### Recommended Settings
| Setting | Target | Hardware |
|---------|--------|----------|
| FPS | 60-144 | Mid-range |
| FPS | 30-60 | Low-end |
| FPS | 240+ | High-end |
| Ping | <50ms | Competitive |
| Ping | <100ms | Casual |
| Memory | <1GB | Mobile/Low-end |
| Memory | <2GB | Standard |

---

## Advanced Tweaks

### Disable Expensive Effects
```javascript
optimizer.memoryOptimizer.disableExpensiveFeatures();
```
- Motion blur
- Depth of field
- Chromatic aberration
- Global illumination

### Force Garbage Collection
```javascript
optimizer.memoryOptimizer.forceGarbageCollection();
```

### Clear Unused Object Pools
```javascript
optimizer.memoryOptimizer.clearUnusedPools();
```

---

## Troubleshooting

### Low FPS (<30)
1. Switch to `reducedMode()`
2. Disable shadows and particles
3. Reduce texture quality
4. Check memory usage

### High Ping (>100ms)
1. Check DNS optimization
2. Enable packet compression
3. Verify network connection
4. Check ISP throttling

### High Memory Usage (>1GB)
1. Run `autoOptimizeMemory()`
2. Clear object pools
3. Force garbage collection
4. Disable non-essential features

---

## Custom Configuration

```javascript
optimizer.configure({
  maxFPS: 240,
  targetMS: 20,
  enableAll: true
});
```

---

## Performance Monitoring Loop

The optimizer automatically monitors:
- FPS every 1 second
- Network ping every 1 second
- Memory usage continuously
- Auto-adjusts when FPS drops below 30

Stop monitoring:
```javascript
optimizer.stopMonitoring();
```

---

## File Structure
- `fps-optimizer.js` - FPS enhancement module
- `latency-reducer.js` - Network optimization module
- `memory-optimizer.js` - RAM management module
- `bloodstrike-optimizer.js` - Master control module
- `CONFIG.md` - This configuration guide

---

*Last Updated: November 28, 2025*
*Version: 1.0*
