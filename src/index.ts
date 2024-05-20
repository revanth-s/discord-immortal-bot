// Discord lingo used here
// author - sender of the message
// user - user in discord (not necessarily a part of a server)
// member - user in discord & a member in a server
// guild - alias for server

import dotenv from 'dotenv';
import chalk from 'chalk';
import { Client } from 'discord.js';

dotenv.config();

const client = new Client({
  intents: [
    'GUILDS',
    // 'GUILD_MEMBERS',
    // 'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    // 'GUILD_INTEGRATIONS',
    // 'GUILD_WEBHOOKS',
    // 'GUILD_INVITES',
    'GUILD_VOICE_STATES',
    // 'GUILD_PRESENCES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MESSAGE_TYPING',
    // 'DIRECT_MESSAGES',
    // 'DIRECT_MESSAGE_REACTIONS',
    // 'DIRECT_MESSAGE_TYPING'
  ],
});

// Function - Logging template
const log = (commandName, receiver, message, sender, guild) => {
  let currentDateTime = String(new Date());
  currentDateTime = currentDateTime.slice(0, 33);

  console.log(
    `${currentDateTime} | ${chalk.red(commandName)} | ${chalk.magenta(
      receiver,
    )} ${message} | ${chalk.green(sender)} on ${chalk.cyan(guild)}`,
  );
};

// Function - Checks if user and bot have permissions
const hasPermission = (interaction, commandName, user, permission) => {
  if (!interaction.memberPermissions.has(permission)) {
    // Checks if user has permissions
    interaction.reply(
      `You do not have permissions to ${commandName} members. Request the admin for permissions.`,
    );
    log(
      commandName,
      user.displayName,
      `can not be ${commandName}ed. The user does not have permissions`,
      interaction.member.displayName,
      user.guild.name,
    );
    return false;
  }
  else if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) {
    // Checks if the bot has permissions
    interaction.reply(
      `I do not have permissions to ${commandName} members. You can enable permissions in the server settings.`,
    );
    log(
      commandName,
      user.displayName,
      `can not be ${commandName}ed. ${interaction.guild.me.displayName} does not have permissions`,
      interaction.member.displayName,
      user.guild.name,
    );
    return false;
  }
  return true;
};

// Function - Checks if member is connected to voice
const isConnected = (interaction, commandName, user) => {
  if (user.voice.channel) {
    return true;
  }
  else {
    interaction.reply(`${user} is not connected to any voice channel.`);
    log(
      commandName,
      user.displayName,
      'is not connected to any voice channel',
      interaction.member.displayName,
      user.guild.name,
    );
    return false;
  }
};

// Logging in the bot to discord
client.login(process.env.DISCORDJS_BOT_TOKEN);

// Event - checks if the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${chalk.blue(client.user.username)}`);
});

// Event - Checks if an interaction was sent in the server
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const user = interaction.options.getMember('user');

  if (commandName === 'disconnect') {
    // Check permissions for disconnect
    if (!hasPermission(interaction, commandName, user, 'ADMINISTRATOR')) return;

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    await user.voice.disconnect();
    await interaction.reply(
      `${user} has been disconnected from the voice channel.`,
    );
    log(
      commandName,
      user.displayName,
      'has been disconnected from the voice channel',
      interaction.member.displayName,
      user.guild.name,
    );
  }
  else if (commandName === 'mute') {
    // Check permissions for mute
    if (!hasPermission(interaction, commandName, user, 'MUTE_MEMBERS')) return;

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    if (!user.voice.serverMute) {
      await user.voice.setMute(true);
      await interaction.reply(`${user} has been muted from the voice channel.`);
      log(
        commandName,
        user.displayName,
        'has been muted from the voice channel',
        interaction.member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already muted.`);
      log(
        commandName,
        user.displayName,
        'is already muted',
        interaction.member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'unmute') {
    // Check permissions for unmute
    if (!hasPermission(interaction, commandName, user, 'MUTE_MEMBERS')) return;

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    if (user.voice.serverMute) {
      await user.voice.setMute(false);
      await interaction.reply(
        `${user} has been unmuted from the voice channel.`,
      );
      log(
        commandName,
        user.displayName,
        'has been unmuted from the voice channel',
        interaction.member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already unmuted.`);
      log(
        commandName,
        user.displayName,
        'is already unmuted',
        interaction.member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'deafen') {
    // Check permissions for deafen
    if (!hasPermission(interaction, commandName, user, 'DEAFEN_MEMBERS')) return;

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    if (!user.voice.serverDeaf) {
      await user.voice.setDeaf(true);
      await interaction.reply(
        `${user} has been deafened from the voice channel.`,
      );
      log(
        commandName,
        user.displayName,
        'has been deafened from the voice channel',
        interaction.member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already deafened.`);
      log(
        commandName,
        user.displayName,
        'is already deafened',
        interaction.member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'undeafen') {
    // Check permissions for undeafen
    if (!hasPermission(interaction, commandName, user, 'DEAFEN_MEMBERS')) return;

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    if (user.voice.serverDeaf) {
      await user.voice.setDeaf(false);
      await interaction.reply(
        `${user} has been undeafened from the voice channel.`,
      );
      log(
        commandName,
        user.displayName,
        'has been undeafened from the voice channel',
        interaction.member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already undeafened.`);
      log(
        commandName,
        user.displayName,
        'is already undeafened',
        interaction.member.displayName,
        user.guild.name,
      );
    }
  }
});
