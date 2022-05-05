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

  const guild = client.guilds.cache.get("913318880561205268");
  guild?.commands.set([]);
  client.application.commands.set(client.slashCommands);
});
