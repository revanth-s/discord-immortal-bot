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
    .setName('disconnect')
    .setDescription('Disconnect a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to disconnect.')
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
      !hasPermission(
        interaction,
        'disconnect',
        user,
        PermissionFlagsBits.Administrator,
      )
    ) {
      return;
    }
    if (!isConnected(interaction, 'disconnect', user)) return;

    await user.voice.disconnect();
    await interaction.reply(
      `${user} has been disconnected from the voice channel.`,
    );

    const member = interaction.member as GuildMember;
    actionLog(
      'disconnect',
      user.displayName,
      'has been disconnected from the voice channel',
      member.displayName,
      user.guild.name,
    );
  },
};
