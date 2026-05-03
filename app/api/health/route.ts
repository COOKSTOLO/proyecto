import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Liveness / readiness probe consumed by Kubernetes.
 * Returns 200 when the app is healthy, 503 otherwise.
 */
export async function GET() {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(uptime),
    memory: {
      rss_mb: Math.round(memoryUsage.rss / 1024 / 1024),
      heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    },
    version: process.env.npm_package_version ?? "0.1.0",
  };

  return NextResponse.json(health, { status: 200 });
}
