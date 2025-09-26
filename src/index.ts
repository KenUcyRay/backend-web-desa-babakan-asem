import dotenv from "dotenv";
import { web } from "@/application/web";
import { logger } from "./application/logging";
import { setupSocket } from "@/application/socket";

dotenv.config();

const server = setupSocket(web);

server.listen(3001, "0.0.0.0", () => {
  logger.info(`Server running on http://localhost:3001`);
});
