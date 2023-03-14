const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async  () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Test POST /launch', () => {
  const compliteLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NCC1701-D',
    target: 'Kepler-186 f',
    launchDate: 'January 4, 2028'
  }

  const LaunchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC1701-D',
    target: 'Kepler-186 f',
  }

  const LaunchDataWithInvalidDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC1701-D',
    target: 'Kepler-186 f',
    launchDate: 'I am not a date'
  }

  test('It should respond with 201 created', async () => {
    const response = await request(app)
      .post('/launches')
      .send(compliteLaunchData)
      .expect('Content-Type', /json/)
      .expect(201)
    
    const requestDate = new Date(compliteLaunchData.launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()  

    expect(responseDate).toBe(requestDate)

    expect(response.body).toMatchObject(LaunchDataWithoutDate)
  })

  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(LaunchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
      })
  })

  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(LaunchDataWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      })
  })
})