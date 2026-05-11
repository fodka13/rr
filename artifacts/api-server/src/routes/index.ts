import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import categoriesRouter from "./categories";
import worksRouter from "./works";
import blogsRouter from "./blogs";
import commentsRouter from "./comments";
import featuredRouter from "./featured";
import statsRouter from "./stats";
import visitorsRouter from "./visitors";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/works", worksRouter);
router.use("/blogs", blogsRouter);
router.use("/comments", commentsRouter);
router.use("/featured", featuredRouter);
router.use("/stats", statsRouter);
router.use("/visitors", visitorsRouter);
router.use(storageRouter);

export default router;
