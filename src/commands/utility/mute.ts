import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, isConnected, actionLog } from '../../utils/helpers.js';
import { Command } from '../../types/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to mute.')
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('User not found in this guild.');
      return;
    }

    if (
      !hasPermission(interaction, 'mute', user, PermissionFlagsBits.MuteMembers)
    ) {
      return;
    }
    if (!isConnected(interaction, 'mute', user)) return;

    const member = interaction.member as GuildMember;

    if (!user.voice.serverMute) {
      await user.voice.setMute(true);
      await interaction.reply(`${user} has been muted from the voice channel.`);
      actionLog(
        'mute',
        user.displayName,
        'has been muted from the voice channel',
        member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already muted.`);
      actionLog(
        'mute',
        user.displayName,
        'is already muted',
        member.displayName,
        user.guild.name,
      );
    }
  },
};
