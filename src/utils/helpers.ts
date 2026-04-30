import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from 'discord.js';
import { logger } from './logger.js';

export const actionLog = (
  commandName: string,
  receiver: string,
  message: string,
  sender: string,
  guild: string,
) => {
  logger.info(
    `[${commandName}] ${receiver} ${message} | By ${sender} on ${guild}`,
  );
};

export const hasPermission = (
  interaction: ChatInputCommandInteraction,
  commandName: string,
  user: GuildMember,
  permission: bigint,
) => {
  const member = interaction.member as GuildMember;
  if (!member.permissions.has(permission)) {
    interaction.reply(
      `You do not have permissions to ${commandName} members. Request the admin for permissions.`,
    );
    actionLog(
      commandName,
      user.displayName,
      `can not be ${commandName}ed. The user does not have permissions`,
      member.displayName,
      user.guild.name,
    );
    return false;
  }

  if (
    !interaction.guild?.members.me?.permissions.has(
      PermissionFlagsBits.Administrator,
    )
  ) {
    interaction.reply(
      `I do not have permissions to ${commandName} members. You can enable permissions in the server settings.`,
    );
    actionLog(
      commandName,
      user.displayName,
      `can not be ${commandName}ed. ${interaction.guild?.members.me?.displayName} does not have permissions`,
      member.displayName,
      user.guild?.name || 'unknown',
    );
    return false;
  }

  return true;
};

export const isConnected = (
  interaction: ChatInputCommandInteraction,
  commandName: string,
  user: GuildMember,
) => {
  if (user.voice.channel) {
    return true;
  }

  interaction.reply(`${user} is not connected to any voice channel.`);
  const member = interaction.member as GuildMember;
  actionLog(
    commandName,
    user.displayName,
    'is not connected to any voice channel',
    member.displayName,
    user.guild.name,
  );
  return false;
};
