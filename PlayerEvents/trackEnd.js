const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode, Queue, Track } = require("discord-player");

module.exports = new PlayerEvent(
  "trackEnd",
  /**
   * @param {Queue} queue
   * @param {Track} track
   */ async (client, queue, track) => {
    if (queue.repeatMode === QueueRepeatMode.TRACK) return;
    const collector = client.collectors.get(queue.guild.id);
    client.collectors.delete(queue.guild.id);
    collector.stop();
  }
);
