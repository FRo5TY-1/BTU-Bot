const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = new PlayerEvent("trackEnd", async (client, queue, TRACK) => {
  if (queue.repeatMode === QueueRepeatMode.TRACK) return;
  const collector = client.collectors.get(queue.guild.id);
  collector.stop();
});
