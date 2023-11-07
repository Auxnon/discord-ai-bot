import type { Client } from "discord.js";
import { ClientExtended } from "../../bot";
import * as askCommand from "../../commands/ask";

require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { APP_ID } = process.env;

export function initCommands(client: ClientExtended) {
  client.handleCommands = async () => {
    // const commandFolders = fs.readdirSync("./dist/commands");
    // for (const folder of commandFolders) {
    //   const commandFiles = fs
    //     .readdirSync(`./dist/commands/${folder}`)
    //     .filter((file: string) => file.endsWith(".js"));

    //   const { commands, commandArray } = client;
    //   for (const file of commandFiles) {
    //     const command = require(`../../commands/${folder}/${file}`);
    //     commands.set(command.data.name, command);
    //     commandArray.push(command.data.toJSON());
    //     console.log(
    //       `Command: ${command.data.name} has passed through the handler.`
    //     );
    //   }
    // }

    client.commandArray.push(askCommand.data.toJSON());

    const clientId = APP_ID;
    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    try {
      console.log("Refreshing slash commands");
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
    } catch (error) {
      console.error(error);
    }
  };
}
