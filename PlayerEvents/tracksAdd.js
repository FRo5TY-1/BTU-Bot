const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { Queue, Track } = require("discord-player");

module.exports = new PlayerEvent(
  "trackAdd",
  /**
   * @param {Queue} queue
   * @param {[Track]} tracks
   */ async (client, queue, tracks) => {
    const timeout = client.musicTimeouts.get(queue.guild.id);
    if (timeout) clearTimeout(timeout);
  }
);
