import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import employeeRoutes from "./api/v1/routes/employeeRoutes";
import branchRoutes from "./api/v1/routes/branchRoutes";


const app: Express = express();
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/branches", branchRoutes);

/**
 * Represents a response structure for a health check endpoint
 */
  interface HealthCheck {
    /** The current status of the server */
    status: string;
    /** How long the server has been running */
    uptime: number;
    /** The current server timestamp */
    timestamp: string;
     /** The API's version */
    version: string;
  }

  // Health check endpoint
  app.get("/api/v1/health", (req: Request, res: Response) => {
  const healthData: HealthCheck = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.json(healthData);
});

export default app;