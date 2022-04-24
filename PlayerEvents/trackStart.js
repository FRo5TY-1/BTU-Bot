const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const ms = require("ms");

module.exports = new PlayerEvent("trackStart", async (client, queue, TRACK) => {
  if (queue.repeatMode === QueueRepeatMode.TRACK) return;

  const loopMode =
    queue.repeatMode === QueueRepeatMode.TRACK
      ? "Song"
      : queue.repeatMode === QueueRepeatMode.QUEUE
      ? "Queue"
      : queue.repeatMode === QueueRepeatMode.AUTOPLAY
      ? "Autoplay"
      : "OFF";

  const Logo = new Discord.MessageAttachment("./Pictures/BTULogo.png");
  const embed = new Discord.MessageEmbed();
  const row1 = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton()
      .setCustomId("songQueue")
      .setEmoji("🔎")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("previousTrack")
      .setEmoji("⏮️")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("pauseTrack")
      .setEmoji("⏸️")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("nextTrack")
      .setEmoji("⏭️")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("stopPlayer")
      .setEmoji("🛑")
      .setStyle("DANGER")
  );
  const row2 = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton()
      .setCustomId("loopNone")
      .setEmoji("967714667462025246")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("rewindTrack")
      .setEmoji("⏪")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("shuffleQueue")
      .setEmoji("🔀")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("forwardTrack")
      .setEmoji("⏩")
      .setStyle("SUCCESS"),
    new Discord.MessageButton()
      .setCustomId("streamTime")
      .setEmoji("⌛")
      .setStyle("SUCCESS")
  );
  function updateLoopMode() {
    if (queue.repeatMode === QueueRepeatMode.OFF) {
      row2.spliceComponents(
        0,
        1,
        new Discord.MessageButton()
          .setCustomId("loopNone")
          .setEmoji("967714667462025246")
          .setStyle("SUCCESS")
      );
    } else if (queue.repeatMode === QueueRepeatMode.TRACK) {
      row2.spliceComponents(
        0,
        1,
        new Discord.MessageButton()
          .setCustomId("loopTrack")
          .setEmoji("🔁")
          .setStyle("SUCCESS")
      );
    } else if (queue.repeatMode === QueueRepeatMode.QUEUE) {
      row2.spliceComponents(
        0,
        1,
        new Discord.MessageButton()
          .setCustomId("loopQueue")
          .setEmoji("🔂")
          .setStyle("SUCCESS")
      );
    } else if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
      row2.spliceComponents(
        0,
        1,
        new Discord.MessageButton()
          .setCustomId("loopAutoplay")
          .setEmoji("♾️")
          .setStyle("SUCCESS")
      );
    }
  }

  updateLoopMode();

  embed
    .setTitle("Started Playing")
    .setDescription(
      ` <a:CatJam:967471460237062164> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
    )
    .setAuthor({
      name: queue.current.requestedBy.username,
      iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
    })
    .addFields(
      {
        name: "Filter",
        value: `\`\`\` ${
          !queue.getFiltersEnabled().length ? "OFF" : queue.getFiltersEnabled()
        } \`\`\``,
        inline: true,
      },
      {
        name: "Loop Mode",
        value: `\`\`\` ${loopMode} \`\`\``,
        inline: true,
      },
      {
        name: "Volume",
        value: `\`\`\` ${queue.volume} \`\`\``,
        inline: true,
      }
    )
    .setColor("PURPLE")
    .setFooter({
      text: `BTU `,
      iconURL: "attachment://BTULogo.png",
    })
    .setImage(queue.current.thumbnail)
    .setTimestamp();
  queue.metadata
    .send({
      embeds: [embed],
      files: [Logo],
      components: [row1, row2],
    })
    .then((message) => {
      const collector = message.createMessageComponentCollector({
        filter: (i) => i.user.id === queue.current.requestedBy.id,
      });
      client.collectors.set(queue.guild.id, collector);
      collector.on("collect", async (i) => {
        if (i.customId === "pauseTrack") {
          queue.setPaused(true);
          row1.spliceComponents(
            2,
            1,
            new Discord.MessageButton()
              .setCustomId("resumeTrack")
              .setEmoji("▶️")
              .setStyle("SUCCESS")
          );
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "resumeTrack") {
          queue.setPaused(false);
          row1.spliceComponents(
            2,
            1,
            new Discord.MessageButton()
              .setCustomId("pauseTrack")
              .setEmoji("⏸️")
              .setStyle("SUCCESS")
          );
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "songQueue") {
          const command = client.slashCommands.get("queue");
          return command.run(i, [], client);
        } else if (i.customId === "previousTrack") {
          return queue.back().catch((err) => {
            queue.seek(0);
          });
        } else if (i.customId === "nextTrack") {
          return queue.skip();
        } else if (i.customId === "stopPlayer") {
          const command = client.slashCommands.get("leave");
          return command.run(i, [], client);
        } else if (i.customId === "shuffleQueue") {
          const command = client.slashCommands.get("shuffle");
          return command.run(i, [], client);
        } else if (i.customId === "streamTime") {
          setTimeout(() => {
            return i.followUp({
              content: `Stream Time is ${ms(queue.streamTime)}`,
            });
          }, 500);
        } else if (i.customId === "loopNone") {
          queue.setRepeatMode(QueueRepeatMode.TRACK);
          updateLoopMode();
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "loopTrack") {
          queue.setRepeatMode(QueueRepeatMode.QUEUE);
          updateLoopMode();
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "loopQueue") {
          queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
          updateLoopMode();
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "loopAutoplay") {
          queue.setRepeatMode(QueueRepeatMode.OFF);
          updateLoopMode();
          return message.edit({ components: [row1, row2] });
        } else if (i.customId === "forwardTrack") {
          const timeStamp = queue.getPlayerTimestamp().current.split(":");
          const time = timeStamp[0] * 60000 + timeStamp[1] * 1000 + 15000;
          if (time > queue.current.durationMS) return queue.skip();
          return queue.seek(time);
        } else if (i.customId === "rewindTrack") {
          const timeStamp = queue.getPlayerTimestamp().current.split(":");
          const time = timeStamp[0] * 60000 + timeStamp[1] * 1000 - 15000;
          if (time < 0) return queue.seek(0);
          return queue.seek(time);
        }
      });

      collector.on("end", async (reason) => {
        message.edit({ components: [] });
      });
    });
});
