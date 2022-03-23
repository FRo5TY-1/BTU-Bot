const Event = require("../Structures/Event.js");

module.exports = new Event("ready", async (client) => {
  console.log("Bot is ready!");
  client.user.setPresence({
    activities: [
      {
        name: "BTU ❤️",
        type: "WATCHING",
      },
    ],
    status: "online",
  });

  const guild = client.guilds.cache
    .get("913318880561205268")
    .commands.set(client.slashCommands)
    .then(
      console.log(`${client.slashCommands.size} slash commands registered`)
    );
});
