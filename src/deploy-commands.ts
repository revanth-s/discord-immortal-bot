import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from './utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: any[] = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const loadCommands = async () => {
  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { command } = await import(`file://${filePath}`);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data);
      }
      else {
        logger.warn(
          `The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
};

const deploy = async () => {
  await loadCommands();

  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORDJS_BOT_TOKEN as string,
  );

  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORDJS_BOT_CLIENT_ID as string,
        process.env.DISCORDJS_BOT_GUILD_ID as string,
      ),
      { body: commands },
    );

    logger.info('Successfully reloaded application (/) commands.');
  }
  catch (error) {
    // And of course, make sure you catch and log any errors!
    logger.error(error);
  }
};

deploy();
