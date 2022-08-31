require("./Strategies/discord");
import express from "express";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));

app.set("trust proxy", 1);

app.use(
  session({
    secret: "TopSecretVerySecure",
    cookie: {
      maxAge: 60000 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

import router from "./Routes/index";

app.use("/", router);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server Is Running On Port ${port}`);
});

export default app;
