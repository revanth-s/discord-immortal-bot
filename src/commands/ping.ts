import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { actionLog } from '../utils/helpers.js';
import { Command } from '../types/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is online.')
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');

    const member = interaction.member as GuildMember;
    actionLog('ping', member.displayName, 'pinged', member.displayName, member.guild.name);
  },
};
