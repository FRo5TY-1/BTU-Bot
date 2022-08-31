const SlashCommand = require("../../Structures/SlashCommand.js");
const { UpvoteChannel } = require("../../Database/index");

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
          channelTypes: ["GUILD_TEXT"],
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
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    },
  ],

  async run(interaction, args, client) {
    await interaction.deferReply({ ephemeral: true });
    const channel = interaction.options.getChannel("channel");
    if (!channel) return;
    if (interaction.options.getSubcommand() === "add") {
      const channel_ids = (
        await UpvoteChannel.find({ guildId: interaction.guild.id })
      ).map((i) => i.channelId);

      if (channel_ids.includes(channel.id))
        return interaction.followUp({ content: "Channel Already Added" });
      if (channel_ids.length >= 2)
        return interaction.followUp({
          content: "Maximum Of 2 Channels Per Guild",
        });
      UpvoteChannel.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
      });
      return interaction.followUp({ content: "Channel Added To The List" });
    } else if (interaction.options.getSubcommand() === "remove") {
      const confirm = await UpvoteChannel.findOne({ channelId: channel.id });
      if (!confirm)
        return interaction.followUp({ content: "Channel Not In The List" });
      await UpvoteChannel.findOneAndDelete({ channelId: channel.id });
      return interaction.followUp({ content: "Channel Removed From The List" });
    }
  },
});
