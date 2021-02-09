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
client.login(process.env.DISCORDJS_BOT_TOKEN)

const PREFIX = '!'
const log = console.log

// Logging-in the bot to discord
client.on('ready', () => {
  log(`Logged in as ${client.user.username}!`)
})

client.on('message', (message) => {
  // Prevents message debouncing - Ignores messages from bot
  if (message.author.bot) return

  // Checks for the availability of the server
  if (!message.guild.available) {
    return message.channel
      .send('Server unavailable at the moment!')
      .then(() =>
        log(
          `${chalk.bgYellow('Alert')} - Server unavailable sent to ${
            message.author.username
          }`
        )
      )
      .catch(console.error)
  }

  // Checks if the member is in right text channel
  if (message.channel.name !== 'immortal-bot') {
    // Checks if the message starts with a '!' prefix in the wrong text channel
    if (message.content.charAt(0) === PREFIX) {
      return message
        .reply('Hey, Use this command on the #immortal-bot text channel!')
        .then(() =>
          log(
            `${chalk.bgBlue('Message')} - Redirect to text channel to ${
              message.author.username
            }`
          )
        )
        .catch(console.error)
    }
  } else {
    // Splits the command from the message
    const [command, ...args] = message.content.split(/\s+/)

    // Checks if the command starts with a '!' prefix
    if (command.startsWith(PREFIX)) {
      // Kick a member from an active voice channel
      if (command === '!kick' || command === '!disconnect') {
        // Checks if author has permission to kick/disconnect
        if (!message.member.hasPermission('ADMINISTRATOR')) {
          return message
            .reply('You do not have permission to kick/disconnect the user.')
            .then(() =>
              log(
                `${chalk.bgRed(
                  'Kick'
                )} - Author does not have permission to kick/disconnect`
              )
            )
            .catch(console.error)
        }

        // Checks if member has not been mentioned
        if (args.length === 0) {
          return message
            .reply('Whom should I kick/disconnect?')
            .then(() => log(`${chalk.bgRed('Kick')} - User not mentioned`))
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
                log(
                  `${chalk.bgRed('Kick')} - User has been kicked/disconnected`
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
                  `${chalk.bgRed(
                    'Kick'
                  )} - User not connected to any voice channel`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() => log(`${chalk.bgRed('Kick')} - Invalid username`))
            .catch(console.error)
        }
      } else if (command === '!mute') {
        // Mute a user from all voice channel

        // Checks if author has permission to mute
        if (!message.member.hasPermission('MUTE_MEMBERS')) {
          return message
            .reply('You do not have permission to mute the user.')
            .then(() =>
              log(
                `${chalk.bgRed(
                  'Kick'
                )} - Author does not have permission to mute`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I mute?')
            .then(() => log(`${chalk.bgRed('Mute')} - User not mentioned`))
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
                .then(() => log(`${chalk.bgRed('Mute')} - User has been muted`))
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already muted.`)
                .then(() =>
                  log(`${chalk.bgRed('Mute')} - User is already muted`)
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
                  `${chalk.bgRed(
                    'Mute'
                  )} - User not connected to any voice channel`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() => log(`${chalk.bgRed('Mute')} - Invalid username`))
            .catch(console.error)
        }
      } else if (command === '!unmute') {
        // Unmute a user from all voice channel

        // Checks if author has permission to unmute
        if (!message.member.hasPermission('MUTE_MEMBERS')) {
          return message
            .reply('You do not have permission to unmute the user.')
            .then(() =>
              log(
                `${chalk.bgRed(
                  'Kick'
                )} - Author does not have permission to mute`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I unmute?')
            .then(() => log(`${chalk.bgRed('Unmute')} - User not mentioned`))
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
                  log(`${chalk.bgRed('Unmute')} - User has been unmuted`)
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already unmuted.`)
                .then(() =>
                  log(`${chalk.bgRed('Unmute')} - User is already unmuted`)
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
                  `${chalk.bgRed(
                    'Unmute'
                  )} - User not connected to any voice channel`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() => log(`${chalk.bgRed('Unmute')} - Invalid username`))
            .catch(console.error)
        }
      } else if (command === '!deafen') {
        // Deafen a user from all voice channel

        // Checks if author has permission to deafen
        if (!message.member.hasPermission('DEAFEN_MEMBERS')) {
          return message
            .reply('You do not have permission to deafen the user.')
            .then(() =>
              log(
                `${chalk.bgRed(
                  'Kick'
                )} - Author does not have permission to deafen`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I deafen?')
            .then(() => log(`${chalk.bgRed('Deafen')} - User not mentioned`))
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
                  log(`${chalk.bgRed('Deafen')} - User has been deafened`)
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already deafened.`)
                .then(() =>
                  log(`${chalk.bgRed('Deafen')} - User is already deafened`)
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
                  `${chalk.bgRed(
                    'Deafen'
                  )} - User not connected to any voice channel`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() => log(`${chalk.bgRed('Deafen')} - Invalid username`))
            .catch(console.error)
        }
      } else if (command === '!undeafen') {
        // Undeafen a user from all voice channel

        // Checks if author has permission to undeafen
        if (!message.member.hasPermission('DEAFEN_MEMBERS')) {
          return message
            .reply('You do not have permission to undeafen the user.')
            .then(() =>
              log(
                `${chalk.bgRed(
                  'Kick'
                )} - Author does not have permission to undeafen`
              )
            )
            .catch(console.error)
        }

        if (args.length === 0) {
          return message
            .reply('Whom should I undeafen?')
            .then(() => log(`${chalk.bgRed('Undeafen')} - User not mentioned`))
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
                  log(`${chalk.bgRed('Undeafen')} - User has been undeafen`)
                )
                .catch(console.error)
            } else {
              return message
                .reply(`${member.user.username} is already Undeafen.`)
                .then(() =>
                  log(`${chalk.bgRed('Undeafen')} - User is already Undeafen`)
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
                  `${chalk.bgRed(
                    'Undeafen'
                  )} - User not connected to any voice channel`
                )
              )
              .catch(console.error)
          }
        } else {
          return message
            .reply('Invalid user name.')
            .then(() => log(`${chalk.bgRed('Undeafen')} - Invalid username`))
            .catch(console.error)
        }
      } else {
        return message
          .reply(
            'Invalid command. Available commands are !kick/!disconnect, !mute, !unmute, !deafen or !undeafen.'
          )
          .then(() => log(`${chalk.bgYellow('Alert')} - Invalid command`))
          .catch(console.error)
      }
    } else {
      return message
        .reply("Use the '!' prefix to issue commands.")
        .then(() => log(`${chalk.bgYellow('Alert')} - '!' prefix required`))
        .catch(console.error)
    }
  }
})
