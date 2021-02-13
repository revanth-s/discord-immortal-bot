// Discord lingo used here
// author - sender of the message
// user - user in discord (not necessarilty a part of a server)
// member - user in discord & a member in a server
// guild - alias for server

import dotenv from 'dotenv'
import chalk from 'chalk'
import discord from 'discord.js'

dotenv.config()

const client = new discord.Client()
// Logging in the bot to discord
client.login(process.env.DISCORDJS_BOT_TOKEN)

const PREFIX = '!'
const log = console.log

// Event - checks if the bot is logged in and ready
client.on('ready', () => {
  log(`Logged in as ${chalk.blue(client.user.tag)}!`)

  // Set the presence of the bot
  client.user
    .setPresence({
      activity: {
        name: '!command',
        type: 'LISTENING'
      },
      status: 'online'
    })
    .then(() =>
      log(
        `${chalk.blue('Presence')} - ${
          client.user.presence.status
        } & ${client.user.presence.activities[0].type.toLowerCase()} to ${
          client.user.presence.activities[0].name
        }`
      )
    )
    .catch(console.error)
})

// Event - checks if a message was sent in the server
client.on('message', (message) => {
  // Prevents message debouncing - Ignores messages from bot
  if (message.author.bot) return

  // Checks for the availability of the server
  if (!message.guild.available) {
    return message.channel
      .send('Server unavailable at the moment!')
      .then(() =>
        log(
          `${chalk.yellow('Alert')} - Server unavailable - ${chalk.green(
            message.author.tag
          )} on ${chalk.cyan(message.guild.name)}`
        )
      )
      .catch(console.error)
  }

  // Checks if the member is in right text channel
  if (message.channel.name !== 'immortal-bot') {
    // Checks if the message starts with a '!' prefix in the wrong text channel
    if (message.content.charAt(0) === PREFIX) {
      return message
        .reply('Use this command on the #immortal-bot text channel!')
        .then(() =>
          log(
            `${chalk.yellow(
              'Alert'
            )} - Use the right text channel - ${chalk.green(
              message.author.tag
            )} on ${chalk.cyan(message.guild.name)}`
          )
        )
        .catch(console.error)
    }
  } else {
    // Splits the command from the message
    const [command, ...args] = message.content.split(/\s+/)

    // Checks if the command starts with a '!' prefix
    if (command.startsWith(PREFIX)) {
      if (command === '!command') {
        // Listing all commands
        return message
          .reply(
            'Available commands are !kick, !mute, !unmute, !deafen, !undeafen'
          )
          .then(() =>
            log(
              `${chalk.yellow(
                'Alert'
              )} - Listing available commands - ${chalk.green(
                message.author.tag
              )} on ${chalk.cyan(message.guild.name)}`
            )
          )
          .catch(console.error)
      } else if (command === '!kick') {
        // Kick a member from an active voice channel

        // Checks if author has permission to kick
        if (!message.member.hasPermission('ADMINISTRATOR')) {
          return message
            .reply(
              'You do not have permissions to kick users. Request the admin for permissions'
            )
            .then(() =>
              log(
                `${chalk.red(
                  'Kick'
                )} - You do not have permissions to kick - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        } else if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
          // Checks if the bot has permissions to kick
          return message
            .reply(
              'I do not have permissions to kick the user. You can enable permissions in the server settings.'
            )
            .then(() =>
              log(
                `${chalk.red('Kick')} - ${chalk.blue(
                  client.user.tag
                )} does not have permissions to kick - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Checks if member has not been mentioned
        if (args.length === 0) {
          return message
            .reply('Whom should I kick?')
            .then(() =>
              log(
                `${chalk.red('Kick')} - User not mentioned - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Gets the user mentioned in the message
        const user = message.mentions.users.first()
        // Gets the member if they are available in the server
        const member = message.guild.member(user)
        // Checks if the member is a valid user
        if (member) {
          // Checks if member is connected to a voice channel
          if (member.voice.channel) {
            return member.voice
              .kick()
              .then(() =>
                message.channel.send(
                  `${member} has been kicked from the voice channel!`
                )
              )
              .then(() =>
                log(
                  `${chalk.red('Kick')} - ${chalk.magenta(
                    member.user.tag
                  )} has been kicked - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          } else {
            return message
              .reply(
                `${member.user.username} is not connected to any voice channel.`
              )
              .then(() =>
                log(
                  `${chalk.red('Kick')} - ${chalk.magenta(
                    member.user.tag
                  )} is not connected to any voice channel - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() =>
              log(
                `${chalk.red('Kick')} - Invalid username - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }
      } else if (command === '!mute') {
        // Mute a user from all voice channel

        // Checks if author has permission to mute
        if (!message.member.hasPermission('MUTE_MEMBERS')) {
          return message
            .reply(
              'You do not have permissions to mute users. Request the admin for permissions'
            )
            .then(() =>
              log(
                `${chalk.red(
                  'Mute'
                )} - You do not have permissions to mute - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        } else if (!message.guild.me.hasPermission('MUTE_MEMBERS')) {
          // Checks if the bot has permissions to mute
          return message
            .reply(
              'I do not have permissions to mute the user. You can enable permissions in the server settings.'
            )
            .then(() =>
              log(
                `${chalk.red('Mute')} - ${chalk.blue(
                  client.user.tag
                )} does not have permissions to mute - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I mute?')
            .then(() =>
              log(
                `${chalk.red('Mute')} - User not mentioned - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Gets the user mentioned in the message
        const user = message.mentions.users.first()
        // Gets the member if they are available in the server
        const member = message.guild.member(user)
        // Checks if the member is a valid user
        if (member) {
          // Checks if member is connected to a voice channel
          if (member.voice.channel) {
            // Checks if the member is already muted
            if (!member.voice.serverMute) {
              return member.voice
                .setMute(true)
                .then(() =>
                  message.channel.send(
                    `${member} has been muted in all voice channels!`
                  )
                )
                .then(() =>
                  log(
                    `${chalk.red('Mute')} - ${chalk.magenta(
                      member.user.tag
                    )} has been muted - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already muted.`)
                .then(() =>
                  log(
                    `${chalk.red('Mute')} - ${chalk.magenta(
                      member.user.tag
                    )} is already muted - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            }
          } else {
            return message
              .reply(
                `${member.user.username} is not connected to any voice channel.`
              )
              .then(() =>
                log(
                  `${chalk.red('Mute')} - ${chalk.magenta(
                    member.user.tag
                  )} is not connected to any voice channel - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() =>
              log(
                `${chalk.red('Mute')} - Invalid username - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }
      } else if (command === '!unmute') {
        // Unmute a user from all voice channel

        // Checks if author has permission to unmute
        if (!message.member.hasPermission('MUTE_MEMBERS')) {
          return message
            .reply(
              'You do not have permissions to unmute users. Request the admin for permissions'
            )
            .then(() =>
              log(
                `${chalk.red(
                  'Unmte'
                )} - You do not have permissions to unmute - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        } else if (!message.guild.me.hasPermission('MUTE_MEMBERS')) {
          // Checks if the bot has permissions to unmute
          return message
            .reply(
              'I do not have permissions to unmute the user. You can enable permissions in the server settings.'
            )
            .then(() =>
              log(
                `${chalk.red('Unmute')} - ${chalk.blue(
                  client.user.tag
                )} does not have permissions to unmute - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I unmute?')
            .then(() =>
              log(
                `${chalk.red('Unmute')} - User not mentioned - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Gets the user mentioned in the message
        const user = message.mentions.users.first()
        // Gets the member if they are available in the server
        const member = message.guild.member(user)
        // Checks if the member is a valid user
        if (member) {
          // Checks if member is connected to a voice channel
          if (member.voice.channel) {
            // Checks if the member is already muted
            if (member.voice.serverMute) {
              return member.voice
                .setMute(false)
                .then(() =>
                  message.channel.send(
                    `${member} has been unmuted in all voice channels!`
                  )
                )
                .then(() =>
                  log(
                    `${chalk.red('Unmute')} - ${chalk.magenta(
                      member.user.tag
                    )} has been unmuted - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already unmuted.`)
                .then(() =>
                  log(
                    `${chalk.red('Unmute')} - ${chalk.magenta(
                      member.user.tag
                    )} is already unmuted - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            }
          } else {
            return message
              .reply(
                `${member.user.username} is not connected to any voice channel.`
              )
              .then(() =>
                log(
                  `${chalk.red('Unmute')} - ${chalk.magenta(
                    member.user.tag
                  )} is not connected to any voice channel - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() =>
              log(
                `${chalk.red('Unmute')} - Invalid username - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }
      } else if (command === '!deafen') {
        // Deafen a user from all voice channel

        // Checks if author has permission to deafen
        if (!message.member.hasPermission('DEAFEN_MEMBERS')) {
          return message
            .reply(
              'You do not have permissions to deafen users. Request the admin for permissions'
            )
            .then(() =>
              log(
                `${chalk.red(
                  'Deafen'
                )} - You do not have permissions to deafen - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        } else if (!message.guild.me.hasPermission('DEAFEN_MEMBERS')) {
          // Checks if the bot has permissions to deafen
          return message
            .reply(
              'I do not have permissions to deafen the user. You can enable permissions in the server settings.'
            )
            .then(() =>
              log(
                `${chalk.red('Deafen')} - ${chalk.blue(
                  client.user.tag
                )} does not have permissions to deafen - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I deafen?')
            .then(() =>
              log(
                `${chalk.red('Deafen')} - User not mentioned - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Gets the user mentioned in the message
        const user = message.mentions.users.first()
        // Gets the member if they are available in the server
        const member = message.guild.member(user)
        // Checks if the member is a valid user
        if (member) {
          // Checks if member is connected to a voice channel
          if (member.voice.channel) {
            // Checks if the member is already deafened
            if (!member.voice.serverDeaf) {
              return member.voice
                .setDeaf(true)
                .then(() =>
                  message.channel.send(
                    `${member} has been deafened in all voice channels!`
                  )
                )
                .then(() =>
                  log(
                    `${chalk.red('Deafen')} - ${chalk.magenta(
                      member.user.tag
                    )} has been deafened - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already deafened.`)
                .then(() =>
                  log(
                    `${chalk.red('Deafen')} - ${chalk.magenta(
                      member.user.tag
                    )} is already deafened - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            }
          } else {
            return message
              .reply(
                `${member.user.username} is not connected to any voice channel.`
              )
              .then(() =>
                log(
                  `${chalk.red('Deafen')} - ${chalk.magenta(
                    member.user.tag
                  )} is not connected to any voice channel - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() =>
              log(
                `${chalk.red('Deafen')} - Invalid username - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }
      } else if (command === '!undeafen') {
        // Undeafen a user from all voice channel

        // Checks if author has permission to undeafen
        if (!message.member.hasPermission('DEAFEN_MEMBERS')) {
          return message
            .reply(
              'You do not have permissions to undeafen users. Request the admin for permissions'
            )
            .then(() =>
              log(
                `${chalk.red(
                  'Undeafen'
                )} - You do not have permissions to undeafen - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        } else if (!message.guild.me.hasPermission('DEAFEN_MEMBERS')) {
          // Checks if the bot has permissions to undeafen
          return message
            .reply(
              'I do not have permissions to undeafen the user. You can enable permissions in the server settings.'
            )
            .then(() =>
              log(
                `${chalk.red('Undeafen')} - ${chalk.blue(
                  client.user.tag
                )} does not have permissions to undeafen - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I undeafen?')
            .then(() =>
              log(
                `${chalk.red('Undeafen')} - User not mentioned - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }

        // Gets the user mentioned in the message
        const user = message.mentions.users.first()
        // Gets the member if they are available in the server
        const member = message.guild.member(user)
        // Checks if the member is a valid user
        if (member) {
          // Checks if member is connected to a voice channel
          if (member.voice.channel) {
            // Checks if the member is already undeafened
            if (member.voice.serverDeaf) {
              return member.voice
                .setDeaf(false)
                .then(() =>
                  message.channel.send(
                    `${member} has been undeafened in all voice channels!`
                  )
                )
                .then(() =>
                  log(
                    `${chalk.red('Undeafen')} - ${chalk.magenta(
                      member.user.tag
                    )} has been undeafened - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already undeafened.`)
                .then(() =>
                  log(
                    `${chalk.red('Undeafen')} - ${chalk.magenta(
                      member.user.tag
                    )} is already undeafened - ${chalk.green(
                      message.author.tag
                    )} on ${chalk.cyan(message.guild.name)}`
                  )
                )
                .catch(console.error)
            }
          } else {
            return message
              .reply(
                `${member.user.username} is not connected to any voice channel.`
              )
              .then(() =>
                log(
                  `${chalk.red('Undeafen')} - ${chalk.magenta(
                    member.user.tag
                  )} is not connected to any voice channel - ${chalk.green(
                    message.author.tag
                  )} on ${chalk.cyan(message.guild.name)}`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() =>
              log(
                `${chalk.red('Undeafen')} - Invalid username - ${chalk.green(
                  message.author.tag
                )} on ${chalk.cyan(message.guild.name)}`
              )
            )
            .catch(console.error)
        }
      } else {
        return message
          .reply(
            'Invalid command. Available commands are !kick, !mute, !unmute, !deafen or !undeafen.'
          )
          .then(() =>
            log(
              `${chalk.yellow('Alert')} - Invalid command - ${chalk.green(
                message.author.tag
              )} on ${chalk.cyan(message.guild.name)}`
            )
          )
          .catch(console.error)
      }
    } else {
      return message
        .reply("Use the '!' prefix to issue commands.")
        .then(() =>
          log(
            `${chalk.yellow('Alert')} - '!' prefix required - ${chalk.green(
              message.author.tag
            )} on ${chalk.cyan(message.guild.name)}`
          )
        )
        .catch(console.error)
    }
  }
})
