// Discord lingo used here
// author - sender of the message
// user - user in discord (not necessarily a part of a server)
// member - user in discord & a member in a server
// guild - alias for server

import dotenv from 'dotenv';
import chalk from 'chalk';
import {
  Client,
  GatewayIntentBits,
  ChatInputCommandInteraction,
  GuildMember,

  PermissionFlagsBits,
} from 'discord.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    // GatewayIntentBits.GuildIntegrations,
    // GatewayIntentBits.GuildWebhooks,
    // GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.DirectMessageReactions,
    // GatewayIntentBits.DirectMessageTyping
  ],
});

// Function - Logging template
const log = (
  commandName: string,
  receiver: string,
  message: string,
  sender: string,
  guild: string,
) => {
  let currentDateTime = String(new Date());
  currentDateTime = currentDateTime.slice(0, 33);

  console.log(
    `${currentDateTime} | ${chalk.red(commandName)} | ${chalk.magenta(
      receiver,
    )} ${message} | ${chalk.green(sender)} on ${chalk.cyan(guild)}`,
  );
};

// Function - Checks if user and bot have permissions
const hasPermission = (
  interaction: ChatInputCommandInteraction,
  commandName: string,
  user: GuildMember,
  permission: bigint,
) => {
  const member = interaction.member as GuildMember;
  if (!member.permissions.has(permission)) {
    // Checks if user has permissions
    interaction.reply(
      `You do not have permissions to ${commandName} members. Request the admin for permissions.`,
    );
    log(
      commandName,
      user.displayName,
      `can not be ${commandName}ed. The user does not have permissions`,
      member.displayName,
      user.guild.name,
    );
    return false;
  }
  else if (
    !interaction.guild?.members.me?.permissions.has(
      PermissionFlagsBits.Administrator,
    )
  ) {
    // Checks if the bot has permissions
    interaction.reply(
      `I do not have permissions to ${commandName} members. You can enable permissions in the server settings.`,
    );
    log(
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

// Function - Checks if member is connected to voice
const isConnected = (
  interaction: ChatInputCommandInteraction,
  commandName: string,
  user: GuildMember,
) => {
  if (user.voice.channel) {
    return true;
  }
  else {
    interaction.reply(`${user} is not connected to any voice channel.`);
    const member = interaction.member as GuildMember;
    log(
      commandName,
      user.displayName,
      'is not connected to any voice channel',
      member.displayName,
      user.guild.name,
    );
    return false;
  }
};

// Logging in the bot to discord
client.login(process.env.DISCORDJS_BOT_TOKEN);

// Event - checks if the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${chalk.blue(client.user?.username)}`);
});

// Event - Checks if an interaction was sent in the server
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const user = interaction.options.getMember('user') as GuildMember;

  if (!user) {
    await interaction.reply('User not found in this guild.');
    return;
  }

  const member = interaction.member as GuildMember;

  if (commandName === 'disconnect') {
    // Check permissions for disconnect
    if (
      !hasPermission(
        interaction,
        commandName,
        user,
        PermissionFlagsBits.Administrator,
      )
    ) {return;}

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
      member.displayName,
      user.guild.name,
    );
  }
  else if (commandName === 'mute') {
    // Check permissions for mute
    if (
      !hasPermission(
        interaction,
        commandName,
        user,
        PermissionFlagsBits.MuteMembers,
      )
    ) {return;}

    // Check if user is conneted to voice
    if (!isConnected(interaction, commandName, user)) return;

    if (!user.voice.serverMute) {
      await user.voice.setMute(true);
      await interaction.reply(`${user} has been muted from the voice channel.`);
      log(
        commandName,
        user.displayName,
        'has been muted from the voice channel',
        member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already muted.`);
      log(
        commandName,
        user.displayName,
        'is already muted',
        member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'unmute') {
    // Check permissions for unmute
    if (
      !hasPermission(
        interaction,
        commandName,
        user,
        PermissionFlagsBits.MuteMembers,
      )
    ) {return;}

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
        member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already unmuted.`);
      log(
        commandName,
        user.displayName,
        'is already unmuted',
        member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'deafen') {
    // Check permissions for deafen
    if (
      !hasPermission(
        interaction,
        commandName,
        user,
        PermissionFlagsBits.DeafenMembers,
      )
    ) {return;}

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
        member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already deafened.`);
      log(
        commandName,
        user.displayName,
        'is already deafened',
        member.displayName,
        user.guild.name,
      );
    }
  }
  else if (commandName === 'undeafen') {
    // Check permissions for undeafen
    if (
      !hasPermission(
        interaction,
        commandName,
        user,
        PermissionFlagsBits.DeafenMembers,
      )
    ) {return;}

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
        member.displayName,
        user.guild.name,
      );
    }
    else {
      await interaction.reply(`${user} is already undeafened.`);
      log(
        commandName,
        user.displayName,
        'is already undeafened',
        member.displayName,
        user.guild.name,
      );
    }
  }
});
