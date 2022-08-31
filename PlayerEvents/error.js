const { Queue } = require("discord-player");
const PlayerEvent = require("../Structures/PlayerEvent.js");

module.exports = new PlayerEvent(
  "error",
  /**
   * @param {Queue} queue
   */ async (client, queue, error) => {
    console.log(`Guild: ${queue.guild.id}, Error: ${error.message}`);
    const collector = client.collectors.get(queue?.guild.id);
    const timeout = client.musicTimeouts.get(queue?.guild.id);
    if (collector) collector.stop();
    if (timeout) clearTimeout(timeout);
    queue?.destroy();
  }
);
