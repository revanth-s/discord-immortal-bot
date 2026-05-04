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
    .setName('unmute')
    .setDescription('Unmute a user from voice channel.')
    .addUserOption((user) =>
      user.setName('user').setDescription('Please select user to unmute.').setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('User not found in this guild.');
      return;
    }

    if (!hasPermission(interaction, 'unmute', user, PermissionFlagsBits.MuteMembers)) {
      return;
    }
    if (!isConnected(interaction, 'unmute', user)) return;

    const member = interaction.member as GuildMember;

    if (user.voice.serverMute) {
      await user.voice.setMute(false);
      await interaction.reply(`${user} has been unmuted from the voice channel.`);
      actionLog(
        'unmute',
        user.displayName,
        'has been unmuted from the voice channel',
        member.displayName,
        user.guild.name,
      );
    } else {
      await interaction.reply(`${user} is already unmuted.`);
      actionLog(
        'unmute',
        user.displayName,
        'is already unmuted',
        member.displayName,
        user.guild.name,
      );
    }
  },
};
