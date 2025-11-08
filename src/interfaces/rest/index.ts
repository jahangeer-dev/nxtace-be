import { server } from '@/infrastructure/http/server.js';

(async () => {
  try {

    await server.init();
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

