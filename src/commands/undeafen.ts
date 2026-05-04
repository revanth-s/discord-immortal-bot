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
    .setName('undeafen')
    .setDescription('Undeafen a user from voice channel.')
    .addUserOption((user) =>
      user.setName('user').setDescription('Please select user to undeafen.').setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('User not found in this guild.');
      return;
    }

    if (!hasPermission(interaction, 'undeafen', user, PermissionFlagsBits.DeafenMembers)) {
      return;
    }
    if (!isConnected(interaction, 'undeafen', user)) return;

    const member = interaction.member as GuildMember;

    if (user.voice.serverDeaf) {
      await user.voice.setDeaf(false);
      await interaction.reply(`${user} has been undeafened from the voice channel.`);
      actionLog(
        'undeafen',
        user.displayName,
        'has been undeafened from the voice channel',
        member.displayName,
        user.guild.name,
      );
    } else {
      await interaction.reply(`${user} is already undeafened.`);
      actionLog(
        'undeafen',
        user.displayName,
        'is already undeafened',
        member.displayName,
        user.guild.name,
      );
    }
  },
};
