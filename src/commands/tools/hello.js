const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Check the API used by COVIDPH Stats Discord Bot."),
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
