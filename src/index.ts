import Hapi from '@hapi/hapi'
import prisma from './plugins/prisma'
import books from './plugins/books'

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export async function start(): Promise<Hapi.Server> {
  await server.register([prisma, books])
  await server.start()
  return server
}

process.on('unhandledRejection', async (err) => {
  await server.app.prisma.$disconnect()
  console.log(err)
  process.exit(1)
})

start()
  .then(server => console.log(`🚀 Server ready at: ${server.info.uri}`))
  .catch(err => console.log(err))
