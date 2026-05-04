import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, isConnected, actionLog } from '../utils/helpers.js';
import { Command } from '../types/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('deafen')
    .setDescription('Deafen a user from voice channel.')
    .addUserOption((user) =>
      user.setName('user').setDescription('Please select user to deafen.').setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('User not found in this guild.');
      return;
    }

    if (!hasPermission(interaction, 'deafen', user, PermissionFlagsBits.DeafenMembers)) {
      return;
    }
    if (!isConnected(interaction, 'deafen', user)) return;

    const member = interaction.member as GuildMember;

    if (!user.voice.serverDeaf) {
      await user.voice.setDeaf(true);
      await interaction.reply(`${user} has been deafened from the voice channel.`);
      actionLog(
        'deafen',
        user.displayName,
        'has been deafened from the voice channel',
        member.displayName,
        user.guild.name,
      );
    } else {
      await interaction.reply(`${user} is already deafened.`);
      actionLog(
        'deafen',
        user.displayName,
        'is already deafened',
        member.displayName,
        user.guild.name,
      );
    }
  },
};
