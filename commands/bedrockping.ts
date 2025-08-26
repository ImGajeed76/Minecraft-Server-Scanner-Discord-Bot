import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDescription, getVersion } from '../commonFunctions.ts';

// Command options
export const data = new SlashCommandBuilder()
  .setName('bedrockping')
  .setDescription('Fetches info from a given Minecraft Bedrock server')
  .addStringOption((option) =>
    option.setName('ip').setDescription('The ip of the server to ping').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('port').setDescription('The port of the server to ping')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Ping status
  await interaction.reply('Pinging, please wait...');
  // Fetch IP and Port from the command
  const ip = interaction.options.getString('ip');
  const port = interaction.options.getInteger('port') || 19132;

  try {
    const text = await (
      await fetch(`https://ping.cornbread2100.com/bedrockping?ip=${ip}&port=${port}`)
    ).text();
    if (text == 'timeout') {
      let errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .addFields({ name: 'Error', value: 'Timeout (is the server offline?)' });
      interaction.editReply({ content: '', embeds: [errorEmbed] });
    } else {
      let response = text.split(';');
      let newEmbed = new EmbedBuilder()
        .setColor('#02a337')
        .setTitle('Ping Result')
        .setAuthor({
          name: 'MC Server Scanner',
          iconURL:
            'https://cdn.discordapp.com/app-icons/1037250630475059211/21d5f60c4d2568eb3af4f7aec3dbdde5.png',
        })
        .addFields(
          { name: 'IP', value: ip },
          { name: 'Port', value: port.toString() },
          { name: 'Version', value: `${getVersion(response[3])} (${response[2]})` },
          {
            name: 'Description',
            value: `${getDescription(response[1])}\n\n${getDescription(response[7])}`,
          },
          { name: 'Players', value: `${response[4]}/${response[5]}` },
          { name: 'Game Mode', value: `${response[8]} (${response[9]})` },
          { name: 'Education Edition', value: response[0] == 'MCEE' ? 'true' : 'false' }
        )
        .setTimestamp();
      await interaction.editReply({ content: '', embeds: [newEmbed] });
    }
  } catch (error) {
    console.log(error);
    let errorEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .addFields({ name: 'Error', value: error.toString() });
    interaction.editReply({ content: '', embeds: [errorEmbed] });
  }
}
