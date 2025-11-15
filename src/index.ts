import app from './app';
import { connectDB } from './config/db';
import { config } from './config/app.config';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}`);
      console.log(`API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
