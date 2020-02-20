const fastify = require('fastify')({ logger: true })
const path = require('path')
const fs = require('fs')
const { getPath } = require('./services/urlHelper')

let config = {
  port: 4444,
  folderPath: path.join(__dirname, `mocks`),
  proxy: false
}

fastify.register(require('fastify-cors'))
fastify.register(require('fastify-cookie'))
fastify.register(require('fastify-session'), {
  cookie: { secure: false },
  secret: 'imyIbEa7OYH220rvMU7CDBSiENgfgv8zXaC'
})

fastify.addHook('preHandler', (request, reply, next) => {
  const filePath = path.join(config.folderPath, getPath(request.raw.url).path, 'prehandler.js')
  if (fs.existsSync(filePath)) {
    require(filePath)(request, reply, next)
  } else {
    next()
  }
})

fastify.all(`/*`, async (request, reply) => {
  const urlPath = getPath(request.raw.url).path;
  let filePath = path.join(config.folderPath, urlPath, 'index.json')
  if (fs.existsSync(filePath)) {
    try {
      const contents = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(contents)
    } catch (error) {
      return reply.code(500).send({ error: 'error read file' })
    }
  } else {
    filePath = path.join(config.folderPath, urlPath, 'index.js')
    if (!fs.existsSync(filePath)) {
      return handleMockNotFound(request, reply, config.proxy)
    }

    try {
      return require(filePath)({ request, reply, folderPath: config['folderPath'] })
    } catch (error) {
      return reply.code(500).send({ error: 'error read file' })
    }
  }
})

/**
 * If mock file does not exist return 404 or proxy the request to external server
 * @param {Request} request 
 * @param {Response} reply 
 * @param {Boolean} proxyPass If true pass the request to the Proxy server (check options.proxy) and return the response
 */
function handleMockNotFound(request, reply, proxy = false) {
  if (!proxy) {
    return reply.code(404).send({ error: 'not found' })
  }
  const relativePath = getPath(request.raw.url).path
  return new Promise((resolve, rej) => {
    reply.from(relativePath, {
      onResponse: (request, rep, res) => {
        reply.send(res)
        resolve()
      }
    })
  })
}

// Run the server!
const run = async (objConfig) => {
  config = { ...config, ...objConfig }
  if (config.proxy) {
    fastify.register(require('fastify-reply-from'), {
      base: config.proxy
    })
  }
  try {
    await fastify.listen(config.port)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    return fastify
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

if (require.main === module) {
  const commandLineArgs = require('command-line-args')
  const options = commandLineArgs([
    { name: 'port', type: Number },
    { name: 'folderPath', type: String },
    { name: 'proxy', type: String }
  ])
  run(options)
} else {
  module.exports = run
}
