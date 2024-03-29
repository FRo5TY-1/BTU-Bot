const SlashCommand = require("../../Structures/SlashCommand.js");
const Discord = require("discord.js");
const got = require("got");
const data = require("../../Data/config.json");

module.exports = new SlashCommand({
  name: "meme",
  description: "Get A Random Meme",

  async run(interaction, args) {
    const subreddits = data.subreddits;
    const Logo = new Discord.MessageAttachment("./Assets/BTULogo.png");
    const embed = new Discord.MessageEmbed();
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("nextmeme")
        .setLabel("Next Meme")
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId("finishmeme")
        .setLabel("Finish")
        .setStyle("DANGER")
    );
    embed
      .setColor("PURPLE")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.deferReply();

    function getMeme() {
      const subreddit =
        subreddits[Math.floor(Math.random() * subreddits.length)];
      got(`https://reddit.com/r/${subreddit}/random/.json`).then((res) => {
        const content = JSON.parse(res.body)[0] || JSON.parse(res.body);
        const permalink = content.data.children[0].data.permalink;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeTitle = content.data.children[0].data.title;
        const score = content.data.children[0].data.score;
        const comments = content.data.children[0].data.num_comments;

        embed.setDescription(
          `**Random Meme From [\`${subreddit}\`](https://reddit.com/r/${subreddit}) Subreddit**\n[\`\`\`${memeTitle}\`\`\`](${memeUrl})`
        );
        embed.setImage(content.data.children[0].data.url).setFooter({
          text: `👍 ${score} 💬 ${comments}`,
          iconURL: "attachment://BTULogo.png",
        });
        interaction
          .editReply({
            embeds: [embed],
            components: [row],
            files: [Logo],
          })
          .catch((err) => {});
      });
    }

    getMeme();

    const collector = interaction.channel.createMessageComponentCollector({
      time: 120000,
      errors: ["time"],
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      if (i.customId === "nextmeme") {
        getMeme();
      } else if (i.customId === "finishmeme") {
        collector.stop();
      }
    });

    collector.on("end", (reason) => {
      row.components[0].setDisabled(true);
      row.components[1].setDisabled(true);
      interaction.editReply({ components: [row] }).catch((err) => {});
    });
  },
});
