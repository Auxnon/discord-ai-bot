require("dotenv").config();
const { DISCORD_TOKEN } = process.env;
import {
  Base,
  BaseInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from "discord.js";
const fs = require("fs");

import { initCommands } from "./functions/handlers/handleCommands";
import * as askCommand from "./commands/ask";

export type ClientExtended = Client & {
  commands: Collection<string, any>;
  commandArray: any[];
  handleEvents: () => void;
  handleCommands: () => void;
};

// @ts-ignore
const client: ClientExtended = new Client({
  intents: GatewayIntentBits.Guilds,
});
client.commands = new Collection();
client.commands.set(askCommand.data.name, askCommand);

client.commandArray = [];

initCommands(client);
// const functionFolders = fs.readdirSync(`./src/functions`);
// for (const folder of functionFolders) {
//   const functionFiles = fs
//     .readdirSync(`./src/functions/${folder}`)
//     .filter((file: string) => file.endsWith(".js"));
//   for (const file of functionFiles)
//     require(`./functions/${folder}/${file}`)(client);
// }
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
  if (!interaction.isCommand()) return;
  if (!client.commands) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const content = "Bobbert is tired... zzzz";
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content,
      });
    } else {
      interaction.editReply({
        content,
      });
    }
  }
});

// Register an event to handle incoming messages
// client.on("message", async (msg) => {
//   // Check if the message starts with '!hello' and respond with 'world!' if it does.
//   if (msg.content.startsWith("!hello")) {
//     msg.reply("world!");
//   }
// });

// client.handleEvents();
client.handleCommands();
client.login(DISCORD_TOKEN);
