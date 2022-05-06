const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const config = require("../Data/config.json");
const intents = new Discord.Intents(32767);
const fs = require("fs");
const PlayerEvent = require("./PlayerEvent.js");
const { Player } = require("discord-player");

class Client extends Discord.Client {
  constructor() {
    super({ intents, partials: ["MESSAGE", "CHANNEL", "REACTION"] });

    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.slashCommands = new Discord.Collection();
    /**
     * @type {Discord.Collection<string, Discord.Collector>}
     */
    this.collectors = new Discord.Collection();

    /**
     * @type {Player}
     */
    this.player = new Player(this, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });
  }

  start(token) {
    fs.readdirSync("./Commands").forEach((dir) => {
      const commands = fs
        .readdirSync(`./Commands/${dir}/`)
        .filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        /**
         * @type {Command}
         */
        const slashCommand = require(`../Commands/${dir}/${file}`);
        console.log(`Slash Command ${slashCommand.name} loaded`);
        if (slashCommand.permissions) slashCommand.defaultPermission = false;
        this.slashCommands.set(slashCommand.name, slashCommand);
      }
    });

    fs.readdirSync("./Events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {Event}
         */
        const event = require(`../Events/${file}`);
        console.log(`Event ${event.event} loaded`);
        this.on(event.event, event.run.bind(null, this));
      });

    fs.readdirSync("./PlayerEvents")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {PlayerEvent}
         */
        const event = require(`../PlayerEvents/${file}`);
        console.log(`Player Event ${event.event} loaded`);
        this.player.on(event.event, event.run.bind(null, this));
      });

    this.login(token);
  }
}

module.exports = Client;
