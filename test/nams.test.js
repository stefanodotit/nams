const supertest = require('supertest')
const path = require('path')
const app = require('../index')

let fastify = null

beforeAll(async () => {
  fastify = await app({
    folderPath: path.join(__dirname, `mocks`)
  })
})

describe('Endpoints', () => {
  it('get first level - 200 - json', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/json')
      .expect(200, { foo: 'bar' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('get first level - 200 - js', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/js')
      .expect(200, { foo: 'bar' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('get first level - 200 - mixed', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/mixed')
      .expect(200, { foo: 'bar' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('get multiple levels - 200', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/multiple/sub/path')
      .expect(200, { foo: 'bar' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('prehandler session - 200', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/prehandler')
      .expect(200, { prehandler: 'TEST' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('not found - 404', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/not/found')
      .expect(404)
  })
})

afterAll(() => {
  fastify.close()
})