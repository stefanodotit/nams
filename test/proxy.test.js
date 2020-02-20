const supertest = require('supertest')
const path = require('path')
const app = require('../index')

let fastify = null

beforeAll(async () => {
  fastify = await app({
    port: 4445,
    folderPath: path.join(__dirname, `mocks`),
    proxy: 'https://dog.ceo/'
  })
})

describe('Endpoints', () => {
  it('internal link', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/json')
      .expect(200, { foo: 'bar' })
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  it('external link', async () => {
    await fastify.ready()
    const response = await supertest(fastify.server)
      .get('/api/breed/retriever/flatcoated/images/random')
      .expect(200)
      .then(response => {
        expect(response.body.status).toBe('success')
      })
  })
})

afterAll(() => {
  fastify.close()
})