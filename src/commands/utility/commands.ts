import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to disconnect.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to mute.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to unmute.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('deafen')
    .setDescription('Deafen a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to deafen.')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('undeafen')
    .setDescription('Undeafen a user from voice channel.')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('Please select user to undeafen.')
        .setRequired(true),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORDJS_BOT_TOKEN as string,
);

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.DISCORDJS_BOT_CLIENT_ID as string,
      process.env.DISCORDJS_BOT_GUILD_ID as string,
    ),
    { body: commands },
  )
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
