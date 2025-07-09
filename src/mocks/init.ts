// Mock configuration for development
export async function initMocks() {
  // Só habilitar mocks em desenvolvimento
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    const { enableMocking } = await import('./browser');
    return enableMocking();
  }
  return Promise.resolve();
}
