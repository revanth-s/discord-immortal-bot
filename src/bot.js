import dotenv from 'dotenv'
import discord from 'discord.js'

dotenv.config()

const client = new discord.Client()
client.login(process.env.DISCORDJS_BOT_TOKEN)

const PREFIX = '!'

// Logging in the bot to discord
client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', (message) => {
  // Prevents message debouncing
  if (message.author.bot === true) return

  // Checks for the availability of the server
  if (message.guild.available !== true) {
    message.channel
      .send(`Server unavailable at the moment!`)
      .then(() =>
        console.log(
          `Sent a server unavailable message to ${message.author.username}`
        )
      )
      .catch(console.error)
  } else {
    // Checks if the user is in right text channel
    if (message.channel.id !== '762756484928503848') {
      // Checks if the message starts with a '!' prompt in the wrong text channel
      if (message.content.charAt(0) === PREFIX) {
        message
          .reply(
            `Hey, Use this command on the ${message.guild.channels.cache
              .get('762756484928503848')
              .toString()} text channel!`
          )
          .then(() =>
            console.log(
              `Sent a channel redirection message to ${message.author.username}`
            )
          )
          .catch(console.error)
      }
    } else {
      // Only read commands with a '!' prompt
      if (message.content.charAt(0) !== PREFIX) {
        message
          .reply(`Use '!' prompt to issue commands to me`)
          .then(() =>
            console.log(
              `Sent a '!' prompt message to ${message.author.username}`
            )
          )
          .catch(console.error)
      } else {
        // Splits the command from the prompt
        const [command, ...args] = message.content
          .substring(PREFIX.length)
          .split(/\s+/)

        // Kick a user from the server
        if (command === 'kick') {
          if (args.length === 0)
            return message
              .reply(`Whom should I kick?`)
              .then(() => console.log(`Kick - User not mentioned`))
              .catch(console.error)

          const member = message.guild.members.cache.get(args[0])
          if (member) {
            message.channel
              .send(`${member.user.username} has been kicked`)
              .then(() =>
                console.log(`Kicked ${member.user.username} from the server`)
              )
              .catch(console.error)
          } else {
            message.channel
              .send(`Invalid user name`)
              .then(() => console.log(`Kick - Invalid username`))
              .catch(console.error)
          }
        }
        // Mute a user for a given time
        else if (command === 'mute') {
          if (args.length === 0)
            return message
              .reply(`Whom should I mute?`)
              .then(() => console.log(`Mute - User not mentioned`))
              .catch(console.error)

          message.channel
            .send(`<User> muted for <time>`)
            .then(() => console.log(`Muted a user for <time>`))
            .catch(console.error)
        }
      }
    }
  }
})
