// Latencia simulada para que los estados de carga se vean como con la API real. En tests es inmediata.
const MOCK_LATENCY_MS = import.meta.env.MODE === "test" ? 0 : 350

export function mockResponse<T>(resolver: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(resolver())
      } catch (error) {
        reject(error)
      }
    }, MOCK_LATENCY_MS)
  })
}

export function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}
