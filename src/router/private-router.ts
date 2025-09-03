import { CommentController } from "@/controller/comment-controller";
import { EmergencyController } from "@/controller/emergency-controller";
import { RatingController } from "@/controller/rating-controller";
import { UserController } from "@/controller/user-controller";
import { authMiddleware } from "@/middleware/auth-middleware";
import express from "express";

export const privateRouter = express.Router();

privateRouter.use(authMiddleware);

// Users
privateRouter.post("/users/logout", UserController.logout);
privateRouter.get("/users", UserController.profile);
privateRouter.patch("/users", UserController.update);
privateRouter.delete("/users", UserController.delete);

// Rating
privateRouter.get("/products/rating/:productId", RatingController.alreadyRated);
privateRouter.post(
  "/products/rating/:productId",
  RatingController.createRating
);
privateRouter.put("/products/rating/:ratingId", RatingController.updateRating);
privateRouter.delete(
  "/products/rating/:ratingId",
  RatingController.deleteRating
);

// Comments
privateRouter.post("/comments/create/:targetId", CommentController.create);
privateRouter.patch("/comments/update/:commentId", CommentController.update);
privateRouter.delete("/comments/delete/:commentId", CommentController.delete);

//Emergency
privateRouter.post("/emergencies", EmergencyController.create);
