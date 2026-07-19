import React, { useState, useEffect, useCallback } from 'react';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    api: { status: 'ok' | 'error'; latency?: number; error?: string };
    database: { status: 'ok' | 'error'; latency?: number; error?: string };
    auth: { status: 'ok' | 'error'; latency?: number; error?: string };
  };
  lastChecked: Date;
}

interface HealthCheckProps {
  apiUrl?: string;
  checkInterval?: number; // milliseconds
  onStatusChange?: (status: HealthCheckResult['status']) => void;
}

/**
 * Health Check Component
 * Monitors API, Database, and Auth service health
 */
export const HealthCheck: React.FC<HealthCheckProps> = ({
  apiUrl = '/api/health',
  checkInterval = 30000, // 30 seconds
  onStatusChange,
}) => {
  const [health, setHealth] = useState<HealthCheckResult>({
    status: 'healthy',
    checks: {
      api: { status: 'ok' },
      database: { status: 'ok' },
      auth: { status: 'ok' },
    },
    lastChecked: new Date(),
  });
  const [isVisible, setIsVisible] = useState(false);

  const performHealthCheck = useCallback(async () => {
    const newHealth: HealthCheckResult = {
      status: 'healthy',
      checks: {
        api: { status: 'ok' },
        database: { status: 'ok' },
        auth: { status: 'ok' },
      },
      lastChecked: new Date(),
    };

    // Check API
    try {
      const start = performance.now();
      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const latency = performance.now() - start;
      
      if (response.ok) {
        newHealth.checks.api = { status: 'ok', latency };
      } else {
        newHealth.checks.api = { status: 'error', error: `HTTP ${response.status}` };
        newHealth.status = 'degraded';
      }
    } catch (error) {
      newHealth.checks.api = { status: 'error', error: (error as Error).message };
      newHealth.status = 'unhealthy';
    }

    // Check Database (via API)
    try {
      const start = performance.now();
      const dbResponse = await fetch(`${apiUrl}/database`, { method: 'GET' });
      const latency = performance.now() - start;
      
      if (dbResponse.ok) {
        newHealth.checks.database = { status: 'ok', latency };
      } else {
        newHealth.checks.database = { status: 'error', error: `HTTP ${dbResponse.status}` };
        newHealth.status = 'degraded';
      }
    } catch (error) {
      newHealth.checks.database = { status: 'error', error: (error as Error).message };
      newHealth.status = 'degraded';
    }

    // Check Auth
    try {
      const start = performance.now();
      const authResponse = await fetch(`${apiUrl}/auth`, { method: 'GET' });
      const latency = performance.now() - start;
      
      if (authResponse.ok) {
        newHealth.checks.auth = { status: 'ok', latency };
      } else {
        newHealth.checks.auth = { status: 'error', error: `HTTP ${authResponse.status}` };
        newHealth.status = 'degraded';
      }
    } catch (error) {
      newHealth.checks.auth = { status: 'error', error: (error as Error).message };
      newHealth.status = 'degraded';
    }

    setHealth(newHealth);
    onStatusChange?.(newHealth.status);
  }, [apiUrl, onStatusChange]);

  useEffect(() => {
    // Initial check
    performHealthCheck();

    // Set up interval
    const interval = setInterval(performHealthCheck, checkInterval);

    return () => clearInterval(interval);
  }, [performHealthCheck, checkInterval]);

  const getStatusColor = (status: 'ok' | 'error') => {
    return status === 'ok' ? 'bg-green-500' : 'bg-red-500';
  };

  const getOverallStatusColor = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-zinc-800 rounded-full shadow-lg hover:bg-zinc-700 transition-colors"
        title="Show Health Status"
      >
        <div className={`w-3 h-3 rounded-full ${getOverallStatusColor(health.status)}`} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 w-72">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">System Health</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Overall</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getOverallStatusColor(health.status)}`} />
            <span className="text-white capitalize">{health.status}</span>
          </div>
        </div>

        {/* API Check */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">API</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(health.checks.api.status)}`} />
            <span className="text-white text-sm">
              {health.checks.api.latency ? `${Math.round(health.checks.api.latency)}ms` : health.checks.api.error || 'OK'}
            </span>
          </div>
        </div>

        {/* Database Check */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Database</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(health.checks.database.status)}`} />
            <span className="text-white text-sm">
              {health.checks.database.latency ? `${Math.round(health.checks.database.latency)}ms` : health.checks.database.error || 'OK'}
            </span>
          </div>
        </div>

        {/* Auth Check */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Auth</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(health.checks.auth.status)}`} />
            <span className="text-white text-sm">
              {health.checks.auth.latency ? `${Math.round(health.checks.auth.latency)}ms` : health.checks.auth.error || 'OK'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-700">
        <p className="text-zinc-500 text-xs">
          Last checked: {health.lastChecked.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default HealthCheck;