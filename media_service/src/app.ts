import cookieSession from "cookie-session";

import "express-async-errors"; // Handless async errors automatically (no need for try/catch in every route)
import helmet from "helmet";
import cors from "cors";
import { mediaRoutes } from "./routes/routes";
import { errorHandler } from "./middlewares/errorHandeler";
import { requestLogger } from "./middlewares/logger";
import { NotFoundError } from "./errors/error"; // You'll need to export this from errors.ts

//import { NotFoundError } from "./utils/errors/not-found-error";
//import { errorHandler } from "./middlewares/error-handler";

//import { currentUser } from "./middlewares/current-user";

//import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();
// 1. Security & Config
app.set("trust proxy", true); // Required for K8s/Nginx proxies
app.use(helmet());
app.use(cors()); // Allow all for dev. Restrict in prod.

//app.use(currentUser);
//if (process.env.NODE_ENV !== "production") {
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//}
//app.all("*", (req, res, next) => {
//next(new NotFoundError());
//});
// 2. Logging Middleware
app.use(requestLogger);
// 3. Routes
// Mount all media routes under /api/media
app.use("/api/media", mediaRoutes);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not found");
});

// 5. Global Error Handler (Must be last)
app.use(errorHandler);
// 4. Handle 404 (Route Not Found)
app.use(
  cookieSession({
    signed: false,
    // In a real-world scenario, you'd want this to be true in production
    // and likely based on an environment variable.
    secure: process.env.NODE_ENV !== "test",
  }),
);

export { app };
