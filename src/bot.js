import dotenv from 'dotenv'
import chalk from 'chalk'
import discord from 'discord.js'

dotenv.config()

const client = new discord.Client()
client.login(process.env.DISCORDJS_BOT_TOKEN)

// change on immortal predators server
const IMMORTAL_BOT_TEXT_CHANNEL_ID = '762756484928503848'
const SERVER_ID = '762736585354510357'

const PREFIX = '!'
const log = console.log

// Logging in the bot to discord
client.on('ready', () => {
  log(`Logged in as ${client.user.username}!`)
})

client.on('message', (message) => {
  // Prevents message debouncing
  if (message.author.bot) return

  // Checks for the availability of the server
  if (message.guild.available !== true) {
    message.channel
      .send(`Server unavailable at the moment!`)
      .then(() =>
        log(
          `${chalk.bgYellow('Alert')} - Server unavailable sent to ${
            message.author.username
          }`
        )
      )
      .catch(console.error)
  } else {
    // Checks if the user is in right text channel
    if (message.channel.id !== IMMORTAL_BOT_TEXT_CHANNEL_ID) {
      // Checks if the message starts with a '!' prompt in the wrong text channel
      if (message.content.charAt(0) === PREFIX) {
        message
          .reply(
            `Hey, Use this command on the ${message.guild.channels.cache
              .get(IMMORTAL_BOT_TEXT_CHANNEL_ID)
              .toString()} text channel!`
          )
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
      // Splits the command from the prompt
      const [command, ...args] = message.content.split(/\s+/)

      // Checks if the command start with a '!' prompt
      if (command.charAt(0) === PREFIX) {
        // Kick a user from the server
        if (command === '!kick') {
          // Checks if author has permission to kick
          if (!message.member.hasPermission('KICK_MEMBERS'))
            return message
              .reply(`You do not have permission to kick the user.`)
              .then(() =>
                log(
                  `${chalk.bgRed(
                    'Kick'
                  )} - Author does not have permission to kick`
                )
              )
              .catch(console.error)

          // Checks if user has been mentioned
          if (args.length === 0)
            return message
              .reply(`Whom should I kick?`)
              .then(() => log(`${chalk.bgRed('Kick')} - User not mentioned`))
              .catch(console.error)

          const member = message.guild.members.cache.get(args[0])
          if (member) {
            message
              .reply(`${member.user.username} has been kicked.`)
              .then(() =>
                log(
                  `${chalk.bgRed('Kick')} - ${
                    member.user.username
                  } has been kicked from the server`
                )
              )
              .catch(console.error)
          } else {
            message
              .reply(`Invalid user name.`)
              .then(() => log(`${chalk.bgRed('Kick')} - Invalid username`))
              .catch(console.error)
          }
        }
        // Mute a user for a given time
        else if (command === '!mute') {
          if (args.length === 0)
            return message
              .reply(`Whom should I mute?`)
              .then(() => log(`${chalk.bgRed('Mute')} - User not mentioned`))
              .catch(console.error)

          message
            .reply(`<User> muted for <time>`)
            .then(() =>
              log(
                `${chalk.bgRed('Mute')} - ${
                  member.user.username
                } has been muted for <time>`
              )
            )
            .catch(console.error)
        } else {
          return message
            .reply(`Invalid command.`)
            .then(() => log(`${chalk.bgYellow('Alert')} - Invalid command`))
            .catch(console.error)
        }
      } else {
        return message
          .reply(`Use the '!' prompt to issue commands to me.`)
          .then(() => log(`${chalk.bgYellow('Alert')} - '!' prompt required`))
          .catch(console.error)
      }
    }
  }
})
