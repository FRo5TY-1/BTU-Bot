const Event = require("../Structures/Event.js");
const Discord = require("discord.js");
const voiceStateModel = require("../DBModels/voiceStateSchema.js");
const userStatsModel = require("../DBModels/userStatsSchema.js");

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
        await voiceStateModel.findOneAndDelete({
          id: oldState.id,
          channelid: oldState.channelId,
        });
        const dateNow = new Date().getTime();
        oldState.channel.members
          .filter((m) => !m.user.bot)
          .forEach(async (m) => {
            const voiceState = await voiceStateModel.findOneAndDelete({
              id: m.id,
              channelid: oldState.channelId,
            });
            await userStatsModel.findOneAndUpdate(
              { id: m.id, guildid: oldState.guild.id },
              { seconds: +(dateNow - voiceState.timestamp) / 1000 },
              { upsert: true }
            );
          });
      }

      // join
      if (newState.channelId !== null) {
        const timeNow = new Date().getTime();
        await voiceStateModel.create({
          id: newState.id,
          timestamp: timeNow,
          channelid: newState.channelId,
        });

        newState.channel.members
          .filter((m) => !m.user.bot)
          .forEach(async (m) => {
            await voiceStateModel.create({
              id: m.id,
              timestamp: timeNow,
              channelid: newState.channelId,
            });
          });
      }
    } else {
      // leave
      if (oldState.channelId !== null) {
        if (oldState.channel.members.some((m) => m.id === clientId)) {
          const voiceState = await voiceStateModel.findOneAndDelete({
            id: oldState.id,
            channelid: oldState.channelId,
          });
          const dateNow = new Date().getTime();
          await userStatsModel.findOneAndUpdate(
            { id: oldState.id, guildid: oldState.guild.id },
            { seconds: +(dateNow - voiceState.timestamp) / 1000 },
            { upsert: true }
          );
        }
      }

      // join
      if (newState.channelId !== null) {
        if (newState.channel.members.some((m) => m.id === clientId)) {
          await voiceStateModel.create({
            id: newState.id,
            timestamp: new Date().getTime(),
            channelid: newState.channelId,
          });
        }
      }
    }
  }
);
