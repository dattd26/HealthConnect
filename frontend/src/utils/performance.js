/**
 * Performance monitoring utilities for development
 */

class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
    this.renderCounts = new Map();
    this.enabled = process.env.NODE_ENV === 'development';
  }

  // Start timing an operation
  startTimer(label) {
    if (!this.enabled) return;
    this.timers.set(label, performance.now());
  }

  // End timing and log result
  endTimer(label) {
    if (!this.enabled) return;
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
      return duration;
    }
  }

  // Track component renders
  trackRender(componentName) {
    if (!this.enabled) return;
    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);
    console.log(`🔄 ${componentName} rendered: ${count + 1} times`);
  }

  // Get render statistics
  getRenderStats() {
    if (!this.enabled) return {};
    return Object.fromEntries(this.renderCounts);
  }

  // Clear all stats
  clear() {
    this.timers.clear();
    this.renderCounts.clear();
  }

  // Memory usage info
  getMemoryInfo() {
    if (!this.enabled || !performance.memory) return null;
    return {
      usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    };
  }
}

const performanceMonitor = new PerformanceMonitor();

// HOC to track component renders
export const withRenderTracking = (Component, componentName) => {
  return function TrackedComponent(props) {
    performanceMonitor.trackRender(componentName || Component.name);
    return <Component {...props} />;
  };
};

// Hook to track component renders
export const useRenderTracker = (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.trackRender(componentName);
  }
};

// Throttle function for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Debounce function for performance
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Measure component render time
export const measureRender = (componentName, renderFn) => {
  if (process.env.NODE_ENV !== 'development') {
    return renderFn();
  }
  
  performanceMonitor.startTimer(`${componentName}-render`);
  const result = renderFn();
  performanceMonitor.endTimer(`${componentName}-render`);
  return result;
};

export default performanceMonitor;
