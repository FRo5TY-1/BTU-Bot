const Event = require("../Structures/Event.js");

module.exports = new Event("ready", async (client) => {
  console.log("Bot is ready!");
  client.user.setPresence({
    activities: [
      {
        name: "BTU ❤️",
        type: "WATCHING",
      },
    ],
    status: "online",
  });

  const guild = client.guilds.cache.get("913318880561205268");
  guild.commands.set(client.slashCommands).then((cmd) => {
    const getRoles = (commandName) => {
      const permissions = client.slashCommands.find(
        (x) => x.name === commandName
      ).permissions;

      if (!permissions) return null;
      return guild.roles.cache.filter(
        (x) => x.permissions.has(permissions) && !x.managed
      );
    };

    const fullPermissions = cmd.reduce((accumulator, x) => {
      const roles = getRoles(x.name);
      if (!roles) return accumulator;

      const permissions = roles.reduce((a, v) => {
        return [
          ...a,
          {
            id: v.id,
            type: "ROLE",
            permission: true,
          },
        ];
      }, []);
      return [
        ...accumulator,
        {
          id: x.id,
          permissions,
        },
      ];
    }, []);

    guild.commands.permissions.set({ fullPermissions });
  });
});
