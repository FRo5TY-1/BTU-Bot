const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((token, done) => {
  return done(null, token);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/redirect`,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, accessToken);
    }
  )
);
