import cookieSession from "cookie-session";
import express from "express";
//import { NotFoundError } from "./utils/errors/not-found-error";
//import { errorHandler } from "./middlewares/error-handler";
import { mediaRoutes } from "./routes/routes";
//import { currentUser } from "./middlewares/current-user";

//import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    // In a real-world scenario, you'd want this to be true in production
    // and likely based on an environment variable.
    secure: process.env.NODE_ENV !== "test",
  })
);

//app.use(currentUser);

app.use(mediaRoutes);

//if (process.env.NODE_ENV !== "production") {
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//}
//app.all("*", (req, res, next) => {
//next(new NotFoundError());
//});

//app.use(errorHandler);
export { app };
