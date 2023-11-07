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
  const repeat = `${interaction.user.toString()} asked "${question}"`;
  const canReply = interaction.channel;
  let whomessage = await interaction.channel?.send(repeat);
  await interaction.deferReply();
  console.log(question);
  const stream = await ollama.stream(question);

  let output = "";

  for await (const chunk of stream) {
    output += chunk;
  }

  output ||= "(੭｡╹▿╹｡)੭ query failed!";
  console.log(`Output: ${output}`);

  if (!canReply) {
    await interaction.followUp({
      content: output,
    });
    return;
  } else {
    await interaction.followUp({
      content: repeat,
    });
    await whomessage?.edit(output);
  }

  //  m?.edit(repeat);

  //   await interaction.editReply({
  //     content: output,
  //   });
}
