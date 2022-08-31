const PlayerEvent = require("../Structures/PlayerEvent.js");
const { Queue, Track } = require("discord-player");

module.exports = new PlayerEvent(
  "trackAdd",
  /**
   * @param {Queue} queue
   * @param {Track} track
   */ async (client, queue, track) => {
    const timeout = client.musicTimeouts.get(queue.guild.id);
    if (timeout) clearTimeout(timeout);
  }
);
