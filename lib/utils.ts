export function safeStatus(status?: number): number {
  return typeof status === "number" ? status : 400;
}
