import { CommandInteraction, SlashCommandBuilder } from "discord.js";
// import { setTimeout as wait } from "node:timers/promises";
import { Ollama } from "langchain/llms/ollama";

export const data = new SlashCommandBuilder()
  .setName("ask")
  .setDescription("Ask a question to the bot")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question you want to ask")
      .setRequired(true)
  );

const ollama = new Ollama({
  model: "llama2-uncensored",
  // other parameters can be found at https://js.langchain.com/docs/api/llms_ollama/classes/Ollama
});

export async function execute(interaction: CommandInteraction) {
  const question = interaction.options.get("question")?.value as string;
  interaction.channel?.send(
    `${interaction.user.toString()} asked "${question}"`
  );
  interaction.deferReply();
  console.log(question);
  const stream = await ollama.stream(question);

  let output = "";

  for await (const chunk of stream) {
    output += chunk;
  }

  console.log(`Output: ${output}`);

  await interaction.editReply({
    content: output,
  });
}
