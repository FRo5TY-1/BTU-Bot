import axios from "axios";

import client from "../../Structures/Client";
import { PartialGuild, PartialGuildChannel } from "../types";
import { DISCORD_API_URL } from "../utils/constants";

export const getBotGuilds = async () => {
  return client.guilds.cache;
};

export const getUserGuilds = async (token: string) => {
  return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMutualGuilds = async (token: string) => {
  try {
    const botGuilds = await getBotGuilds();
    const userGuilds = await getUserGuilds(token);
    const adminUserGuilds = userGuilds?.data.filter(
      (guild) => (parseInt(guild.permissions) & 0x8) === 0x8
    );

    const mutualguilds = botGuilds.map((bg) => {
      if (adminUserGuilds.some((ug) => bg.id === ug.id))
        return {
          id: bg.id,
          name: bg.name,
          icon: bg.iconURL({ size: 32, format: "png" }),
        };
    });

    return mutualguilds;
  } catch (err) {
    console.log(err);
  }
};

export const getGuildChannels = (guildId: string) => {
  return axios.get<PartialGuildChannel[]>(
    `${DISCORD_API_URL}/guilds/${guildId}/channels`,
    { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } }
  );
};
