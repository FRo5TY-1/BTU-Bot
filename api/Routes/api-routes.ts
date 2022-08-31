import { Router } from "express";
import { WelcomeMessage } from "../../Database";
import { getGuildChannels, getMutualGuilds } from "../Services/guilds";

const router = Router();

router.get("/guilds", async (req, res) => {
  res.json(await getMutualGuilds(req.user as string));
});

router.get("/invite", async (req, res) => {
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=953683830773006426&permissions=8&scope=bot%20applications.commands"
  );
});

router.get("/:guildId/channels", async (req, res) => {
  const guildId = req.params.guildId;
  const channels = await getGuildChannels(guildId);
  return res.send(channels.data);
});

router.get("/:guildId/config", async (req, res) => {
  const guildId = req.params.guildId;
  const config = await WelcomeMessage.findOne({ guildId: guildId });
  res.send(config);
});

router.post("/:guildId/config/welcome-message", async (req, res) => {
  const guildId = req.params.guildId;
  const channelId: string = req.body.channelId;
  const message: string = req.body.message;
  if (channelId && message && message.length < 200 && message.length > 5) {
    await WelcomeMessage.findOneAndUpdate(
      { guildId: guildId },
      { channelId: channelId, message: message },
      { upsert: true }
    );
  } else {
    return res.status(406).send("Unacceptable Params");
  }
});

export default router;
