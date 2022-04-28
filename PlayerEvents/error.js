const PlayerEvent = require("../Structures/PlayerEvent.js");

module.exports = new PlayerEvent("error", async (client, queue, error) => {
  console.log(`Guild: ${queue.guild.id}, Error: ${error.message}`);
});
