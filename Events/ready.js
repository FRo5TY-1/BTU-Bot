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
    status: "dnd",
  });

  client.application.commands.set(client.slashCommands);
});
