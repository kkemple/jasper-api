/* eslint no-console: [0] */

import Promise from 'bluebird'
import repl from 'repl'

import { User, Bot, Email, Integration } from '../models'
import { getServer, loadPlugins } from '../server'

const users = User.collection()
const bots = Bot.collection()
const emails = Email.collection()
const integrations = Integration.collection()
const server = getServer()

Promise.all([
  users.fetch(),
  bots.fetch(),
  emails.fetch(),
  integrations.fetch(),
  loadPlugins(server),
]).then((results) => {
  const replServer = repl.start({
    prompt: `Skynet API (${process.env.NODE_ENV}): `,
  })

  replServer.context.users = results[0]
  replServer.context.bots = results[1]
  replServer.context.emails = results[2]
  replServer.context.integrations = results[3]

  replServer.context.User = User
  replServer.context.Bot = Bot
  replServer.context.Email = Email
  replServer.context.Integration = Integration

  replServer.context.server = server
})
.catch((err) => console.log(err))
