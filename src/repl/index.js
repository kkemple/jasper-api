import repl from 'repl'

import { User, Bot, Email, Integration, PhoneNumber } from '../models'
import { getServer, loadPlugins } from '../server'

const users = User.collection()
const bots = Bot.collection()
const emails = Email.collection()
const phoneNumbers = PhoneNumber.collection()
const integrations = Integration.collection()
const server = getServer()

Promise.all([
  users.fetch(),
  bots.fetch(),
  emails.fetch(),
  phoneNumbers.fetch(),
  integrations.fetch(),
  loadPlugins(server)
]).then((results) => {
  const replServer = repl.start({
    prompt: `Jasper API (${process.env.NODE_ENV}): `
  })

  replServer.context.users = results[0]
  replServer.context.bots = results[1]
  replServer.context.emails = results[2]
  replServer.context.phoneNumbers = results[3]
  replServer.context.integrations = results[4]

  replServer.context.User = User
  replServer.context.Bot = Bot
  replServer.context.Email = Email
  replServer.context.PhoneNumber = PhoneNumber
  replServer.context.Integration = Integration

  replServer.context.server = server
})
.catch((err) => console.log(err))
