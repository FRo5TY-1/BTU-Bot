const Event = require("../Structures/Event.js");

module.exports = new Event("ready", async (client) => {
  console.log("Bot is ready!");
  client.user.setPresence({
    activities: [
      {
        name: "BTU Help",
        type: "WATCHING",
      },
    ],
    status: "online",
  });

  const guild = client.guilds.cache
    .get("914216652705517668")
    .commands.set(client.slashCommands)
    .then(
      console.log(`${client.slashCommands.size} slash commands registered`)
    );
});
