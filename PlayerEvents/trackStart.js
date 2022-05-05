const PlayerEvent = require("../Structures/PlayerEvent.js");
const Discord = require("discord.js");
const { QueueRepeatMode, Queue, Track } = require("discord-player");
const ms = require("ms");

module.exports = new PlayerEvent(
  "trackStart",
  /**
   * @param {Queue} queue
   * @param {Track} TRACK
   */ async (client, queue, TRACK) => {
    if (queue.repeatMode === QueueRepeatMode.TRACK) return;
    queue.previousTracks.pop();

    const loopMode =
      queue.repeatMode === QueueRepeatMode.TRACK
        ? "Song"
        : queue.repeatMode === QueueRepeatMode.QUEUE
        ? "Queue"
        : queue.repeatMode === QueueRepeatMode.AUTOPLAY
        ? "Autoplay"
        : "OFF";
    const loopEmoji =
      queue.repeatMode === QueueRepeatMode.TRACK
        ? "🔁"
        : queue.repeatMode === QueueRepeatMode.QUEUE
        ? "🔂"
        : queue.repeatMode === QueueRepeatMode.AUTOPLAY
        ? "♾️"
        : "967714667462025246";

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
        .setCustomId("pauseResume")
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
        .setCustomId("loopMode")
        .setEmoji(loopEmoji)
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
        row2.components[0].setEmoji("🔁");
        queue.setRepeatMode(QueueRepeatMode.TRACK);
      } else if (queue.repeatMode === QueueRepeatMode.TRACK) {
        row2.components[0].setEmoji("🔂");
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
      } else if (queue.repeatMode === QueueRepeatMode.QUEUE) {
        row2.components[0].setEmoji("♾️");
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
      } else if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
        row2.components[0].setEmoji("967714667462025246");
        queue.setRepeatMode(QueueRepeatMode.OFF);
      }
    }

    embed
      .setTitle("Started Playing")
      .setDescription(
        ` <a:CatJam:924585442450489404> | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`
      )
      .setAuthor({
        name: queue.current.requestedBy.username,
        iconURL: queue.current.requestedBy.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Filters",
          value: `\`\`\` ${
            !queue.getFiltersEnabled().length
              ? "None"
              : queue.getFiltersEnabled()
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

    const filter = (i) => {
      if (
        i.user.id === queue.current.requestedBy.id ||
        i.member.roles.cache.some((r) => r.name === "DJ")
      )
        return true;
      return i.reply({
        content:
          "Current Song Must Be Requested By You Or You Must Have DJ Role To Use This Command",
        ephemeral: true,
      });
    };

    queue.metadata
      .send({
        embeds: [embed],
        files: [Logo],
        components: [row1, row2],
      })
      .then((message) => {
        const collector = message.createMessageComponentCollector({
          filter: filter,
        });
        client.collectors.set(queue.guild.id, collector);
        collector.on(
          "collect",
          /**
           * @param {Discord.ButtonInteraction} i
           */ async (i) => {
            await i.deferUpdate();
            if (i.customId === "pauseResume") {
              if (queue.connection.paused) {
                queue.setPaused(false);
                row1.components[2].setEmoji("⏸️");
              } else {
                queue.setPaused(true);
                row1.components[2].setEmoji("▶️");
              }
              return message.edit({ components: [row1, row2] });
            } else if (i.customId === "songQueue") {
              const command = client.slashCommands.get("queue");
              return command.run(i, [], client);
            } else if (i.customId === "previousTrack") {
              const command = client.slashCommands.get("previous");
              return command.run(i, [], client);
            } else if (i.customId === "nextTrack") {
              return queue.skip();
            } else if (i.customId === "stopPlayer") {
              queue.setRepeatMode(QueueRepeatMode.OFF);
              queue.setPaused(false);
              if (queue.tracks.length > 0) {
                collector.stop();
                const Logo = new Discord.MessageAttachment(
                  "./Pictures/BTULogo.png"
                );
                const embed = new Discord.MessageEmbed();
                embed
                  .setDescription(
                    "✅ | `Finished Playing And Left The Channel`"
                  )
                  .setColor("PURPLE")
                  .setFooter({
                    text: `BTU `,
                    iconURL: "attachment://BTULogo.png",
                  })
                  .setTimestamp();
                i.channel.send({ embeds: [embed], files: [Logo] });
              }
              return queue.destroy();
            } else if (i.customId === "shuffleQueue") {
              const command = client.slashCommands.get("shuffle");
              return command.run(i, [], client);
            } else if (i.customId === "streamTime") {
              setTimeout(() => {
                return i.followUp({
                  content: `Total Time: ${ms(queue.totalTime)}`,
                });
              }, 500);
            } else if (i.customId === "loopMode") {
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
          }
        );

        collector.on("end", async (reason) => {
          message.edit({ components: [] });
        });
      });
  }
);
