import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("discord"), (req, res) => {});

router.get("/redirect", passport.authenticate("discord"), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

router.get("/status", (req, res) => {
  return req.user
    ? res.status(200).send({ msg: "Authorized" })
    : res.status(401).send({ msg: "Unauthorized" });
});

export default router;
