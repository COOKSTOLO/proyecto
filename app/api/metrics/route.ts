import { NextResponse } from "next/server";

/**
 * GET /api/metrics
 * Exposes application metrics in Prometheus text format (version 0.0.4).
 * Scraped by the Prometheus instance deployed in the monitoring namespace.
 *
 * Metrics exposed:
 *   - process_resident_memory_bytes   (gauge)
 *   - process_heap_bytes_used         (gauge)
 *   - process_heap_bytes_total        (gauge)
 *   - process_uptime_seconds          (counter)
 *   - nodejs_version_info             (gauge, with version labels)
 *   - app_info                        (gauge, with app/version labels)
 */
export async function GET() {
  const mem = process.memoryUsage();
  const uptime = process.uptime();
  const nodeVersion = process.version.replace("v", "");
  const appVersion = process.env.npm_package_version ?? "0.1.0";

  const lines: string[] = [
    "# HELP process_resident_memory_bytes Resident memory size in bytes",
    "# TYPE process_resident_memory_bytes gauge",
    `process_resident_memory_bytes ${mem.rss}`,
    "",
    "# HELP process_heap_bytes_used Heap memory currently used in bytes",
    "# TYPE process_heap_bytes_used gauge",
    `process_heap_bytes_used ${mem.heapUsed}`,
    "",
    "# HELP process_heap_bytes_total Total heap memory allocated in bytes",
    "# TYPE process_heap_bytes_total gauge",
    `process_heap_bytes_total ${mem.heapTotal}`,
    "",
    "# HELP process_uptime_seconds Process uptime in seconds",
    "# TYPE process_uptime_seconds counter",
    `process_uptime_seconds ${uptime.toFixed(3)}`,
    "",
    "# HELP nodejs_version_info Node.js version info",
    "# TYPE nodejs_version_info gauge",
    `nodejs_version_info{version="${nodeVersion}"} 1`,
    "",
    "# HELP app_info Application build information",
    "# TYPE app_info gauge",
    `app_info{name="ofertonazos",version="${appVersion}",env="${process.env.NODE_ENV ?? "production"}"} 1`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
    },
  });
}
