const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const { CatJam } = require("../../Data/emojis.json");

module.exports = new SlashCommand({
  name: "queue",
  description: "🎵 See Queue",

  async run(interaction, args, client) {
    const player = client.player;
    let page = 1;
    let end = page * 5;
    let start = end - 5;
    const queue = player.getQueue(interaction.guild);
    if (!queue?.playing)
      return interaction.reply({
        content: "Music Is Not Being Played",
      });

    const tracks = queue.tracks.map((m, i) => {
      return `**${i + 1}.** [**\`${m.title}\`**](${m.url})`;
    });
    const prevTracks = queue.previousTracks.reverse().map((m, i) => {
      return `**${i + 1}.** [**\`${m.title}\`**](${m.url})`;
    });
    queue.previousTracks.reverse();

    if (interaction.isCommand()) await interaction.deferReply();

    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle("Queue")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `Upcoming Tracks \`( Total: ${tracks.length} )\``,
          value: `${tracks.slice(start, end).join("\n") || "No Tracks"}`,
          inline: true,
        },
        {
          name: `Previous Tracks \`( Total: ${prevTracks.length} )\``,
          value: `${prevTracks.slice(start, end).join("\n") || "No Tracks"}`,
          inline: true,
        },
        {
          name: "Now Playing",
          value: `${CatJam.emoji} | [**\`${queue.current.title}\`**](${queue.current.url}) - <@!${queue.current.requestedBy.id}>`,
        }
      )
      .setFooter({
        text: `Page: ${page}`,
        iconURL: "attachment://BTULogo.png",
      })
      .setColor("PURPLE")
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("prevpage")
        .setLabel("Previous Page")
        .setEmoji("◀️")
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId("nextpage")
        .setLabel("Next Page")
        .setEmoji("▶️")
        .setStyle("PRIMARY")
    );

    const message = await interaction.followUp({
      embeds: [embed],
      components: [row],
      files: [Logo],
    });

    const collector = message.createMessageComponentCollector({
      time: 30000,
      errors: ["time"],
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      if (i.customId === "prevpage") {
        if (page > 1) {
          page -= 1;
          end = page * 5;
          start = end - 5;
          embed.fields[0].value = `${
            tracks.slice(start, end).join("\n") || "No Tracks"
          }`;
          embed.fields[1].value = `${
            prevTracks.slice(start, end).join("\n") || "No Tracks"
          }`;
          embed.footer.text = `Page ${page}`;
          return message.edit({ embeds: [embed] });
        }
      } else if (i.customId === "nextpage") {
        page += 1;
        end = page * 5;
        start = end - 5;
        embed.fields[0].value = `${
          tracks.slice(start, end).join("\n") || "No Tracks"
        }`;
        embed.fields[1].value = `${
          prevTracks.slice(start, end).join("\n") || "No Tracks"
        }`;
        embed.footer.text = `Page ${page}`;
        return message.edit({ embeds: [embed] });
      }
    });

    collector.on("end", (reason) => {
      message?.edit({ components: [] });
    });
  },
});
