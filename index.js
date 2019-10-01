const fastify = require('fastify')({ logger: true })
const path = require('path')
const fs = require('fs')
const { getPath } = require('./services/urlHelper')

let config = {
    port: 4444,
    folderPath: path.join(__dirname, `mocks`)
}

fastify.register(require('fastify-cors'))
fastify.register(require('fastify-cookie'))
fastify.register(require('fastify-session'), {
    cookie: { secure: false },
    secret: 'imyIbEa7OYH220rvMU7CDBSiENgfgv8zXaC'
})

fastify.addHook('preHandler', (request, reply, next) => {
    const filePath = path.join(config.folderPath, getPath(request.raw.url).path, 'prehandler.js')
    if(fs.existsSync(filePath)){
        require(filePath)(request, reply, next)
    }else{
        next()
    }
})

fastify.all(`/*`, async (request, reply) => {
    const urlPath = getPath(request.raw.url).path;
    let filePath = path.join(config.folderPath, urlPath, 'index.json')
    if(fs.existsSync(filePath)){
        try {
            const contents = fs.readFileSync(filePath, 'utf8')
            return JSON.parse(contents)
        } catch (error) {
            return reply.code(500).send({ error: 'error read file' })
        }
    }else{
        filePath = path.join(config.folderPath, urlPath, 'index.js')
        if(!fs.existsSync(filePath)){
            return reply.code(404).send({ error: 'not found' })
        }

        try {
            return require(filePath)({request, reply, folderPath:config['folderPath']})
        } catch (error) {
            return reply.code(500).send({ error: 'error read file' })
        }
    }
})

// Run the server!
const run = async (objConfig) => {
    config = {...config, ...objConfig}
    try {
        await fastify.listen(config.port)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

if(require.main === module) {
    const commandLineArgs = require('command-line-args')
    const options = commandLineArgs([
        { name: 'port', type: Number },
        { name: 'folderPath', type: String }
    ])
    run(options)
} else {
    module.exports = run
}
