const SlashCommand = require("../../Structures/SlashCommand.js");
const channelModel = require("../../DBModels/upvoteChannelsSchema.js");

module.exports = new SlashCommand({
  name: "upvote-channel",
  permissions: ["ADMINISTRATOR"],
  description: "Add Or Remove An Upvotable Channel",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "Add A Channel To Upvote Channel List",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Choose The Channel",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "Remove A Channel From Upvote Channel List",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Choose The Channel",
          required: true,
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    const channel = interaction.options.getChannel("channel");
    if (!channel) return;
    if (interaction.options.getSubcommand() === "add") {
      const channel_ids = (
        await channelModel.find({ guildId: interaction.guild.id })
      ).map((i) => i.channelId);

      if (channel_ids.includes(channel.id))
        return interaction.reply({
          content: "Channel Already Added",
          ephemeral: true,
        });
      if (channel_ids.length >= 2)
        return interaction.reply({
          content: "Maximum Of 2 Channels Per Guild",
          ephemeral: true,
        });
      channelModel.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
      });
      return interaction.reply({
        content: "Channel Added To The List",
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const confirm = await channelModel.findOne({ channelId: channel.id });
      if (!confirm)
        return interaction.reply({
          content: "Channel Not In The List",
          ephemeral: true,
        });
      await channelModel.findOneAndDelete({ channelId: channel.id });
      return interaction.reply({
        content: "Channel Removed From The List",
        ephemeral: true,
      });
    }
  },
});
