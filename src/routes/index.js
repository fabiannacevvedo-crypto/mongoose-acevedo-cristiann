import { Router } from "express";
import { userRouter } from "./user.routes.js";
import { profileRouter } from "./profile.routes.js";
import { courseRouter } from "./courser.routes.js";
import { tagRouter } from "./tag.routes.js";

export const apiRouter = Router();

apiRouter.use(userRouter);
apiRouter.use(profileRouter);
apiRouter.use(courseRouter);
apiRouter.use(tagRouter);

export { userRouter, profileRouter, courserRouter, tagRouter };
