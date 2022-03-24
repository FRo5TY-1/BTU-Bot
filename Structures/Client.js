const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const config = require("../Data/config.json");
const intents = new Discord.Intents(32767);
const fs = require("fs");

class Client extends Discord.Client {
  constructor() {
    super({ intents, partials: ["MESSAGE", "CHANNEL", "REACTION"] });

    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection();
    this.slashCommands = new Discord.Collection();

    this.prefix = config.prefix;
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
        const command = require(`../Commands/${dir}/${file}`);
        if (["BOTH", "TEXT"].includes(command.type)) {
          this.commands.set(command.name, command);
          console.log(`Text Command ${command.name} loaded`);
        }
        if (["BOTH", "SLASH"].includes(command.type)) {
          console.log(`Slash Command ${command.name} loaded`);
          if (command.permissions) command.defaultPermission = false;
          this.slashCommands.set(command.name, command);
        }
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
      

    this.login(token);
  }
}

module.exports = Client;
