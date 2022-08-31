const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const { Profile, VoiceState } = require("../Database/index");

module.exports = new Event(
  "voiceStateUpdate",
  /** @param {Discord.VoiceState} oldState @param {Discord.VoiceState} newState */
  async (client, oldState, newState) => {
    // start

    if (oldState.channelId === newState.channelId) return;

    // bot

    const clientId = client.application.id;

    if (oldState.id === clientId || newState.id === clientId) {
      // leave
      if (oldState.channelId !== null) {
        await VoiceState.findOneAndDelete({
          id: oldState.id,
          channelId: oldState.channelId,
        });
        const dateNow = new Date().getTime();
        oldState.channel.members
          .filter((m) => !m.user.bot)
          .forEach(async (m) => {
            const voiceState = await VoiceState.findOneAndDelete({
              id: m.id,
              channelId: oldState.channelId,
            });
            const seconds = (dateNow - voiceState.timestamp) / 1000;
            await Profile.findOneAndUpdate(
              { guildId: oldState.guild.id, userId: m.id },
              { $inc: { streamTime: +seconds } },
              { upsert: true }
            );
          });
      }

      // join
      if (newState.channelId !== null) {
        const timeNow = new Date().getTime();
        await VoiceState.create({
          id: newState.id,
          timestamp: timeNow,
          channelId: newState.channelId,
        });

        newState.channel.members
          .filter((m) => !m.user.bot)
          .forEach(async (m) => {
            await VoiceState.create({
              id: m.id,
              timestamp: timeNow,
              channelId: newState.channelId,
            });
          });
      }
    } else {
      // leave
      if (oldState.channelId !== null) {
        if (oldState.channel.members.some((m) => m.id === clientId)) {
          const voiceState = await VoiceState.findOneAndDelete({
            id: oldState.id,
            channeId: oldState.channelId,
          });
          const seconds = (new Date().getTime() - voiceState.timestamp) / 1000;
          await Profile.findOneAndUpdate(
            { guildId: oldState.guild.id, userID: oldState.id },
            { $inc: { streamTime: +seconds } },
            { upsert: true }
          );
        }
      }

      // join
      if (newState.channelId !== null) {
        if (newState.channel.members.some((m) => m.id === clientId)) {
          await VoiceState.create({
            id: newState.id,
            timestamp: new Date().getTime(),
            channelId: newState.channelId,
          });
        }
      }
    }
  }
);
