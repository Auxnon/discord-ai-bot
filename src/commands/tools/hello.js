const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the bot."),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = "Hello!";
    await interaction.editReply({
      content: newMessage,
    });
  },
};
