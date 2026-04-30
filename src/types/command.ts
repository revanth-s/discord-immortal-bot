import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: ReturnType<SlashCommandBuilder['toJSON']>;
  execute: (_interaction: ChatInputCommandInteraction) => Promise<void>;
}
