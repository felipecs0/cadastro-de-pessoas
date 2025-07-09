import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar o MSW worker
export const worker = setupWorker(...handlers);

// Função para inicializar o MSW em modo de desenvolvimento
export async function enableMocking() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker não é suportado neste navegador');
  }

  // Configurações do worker
  await worker.start({
    onUnhandledRequest: 'warn', // Avisar sobre requisições não tratadas
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });

  console.log('🔄 MSW habilitado - Mocks de API ativos');
  return worker;
}
