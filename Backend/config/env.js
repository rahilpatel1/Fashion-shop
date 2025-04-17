import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`${env} must be defined in .env file`);
  }
});

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

export default config;