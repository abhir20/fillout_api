const axios = require('axios');
const supertest = require('supertest');
const app = require('src/server.js'); // Correct path to your Express app file 

jest.mock('axios');

describe('GET /:formId/filteredResponses', () => {
  let server;
  const timeout = 5000;

  beforeAll(async () => {
    server = await app.listen(3001); // Listen on a different port for testing

    const timer = setTimeout(() => {
      done.fail(new Error('Server failed to start within timeout')); // Fail test if timeout occurs
    }, timeout);
  
    server.on('listening', () => {
      clearTimeout(timer); // Clear timeout if server starts successfully
      done();
    });
  
  }, timeout);

  afterAll(async(done) => {
    await server.close(done);
  });


  it('should return filtered responses', async () => {
    const mockedResponses = [
      {
        questions: [
          { id: 'question1', value: 'value1' },
          { id: 'question2', value: 'value2' }
        ]
      },
      {
        questions: [
          { id: 'question1', value: 'value1' },
          { id: 'question2', value: 'value3' }
        ]
      }
    ];

   
    axios.get.mockResolvedValue(async(), { data: { responses: mockedResponses } });

    const response = await supertest(server)
      .get('/cLZojxk94ous/filteredResponses')
      .query({ filters: JSON.stringify([{ id: 'question2', condition: 'equals', value: 'value3' }]) })
      .expect(200);

    expect(response.body).toEqual({
      responses: [
        {
          questions: [
            { id: 'question1', value: 'value1' },
            { id: 'question2', value: 'value3' }
          ]
        }
      ],
      totalResponses: 1,
      pageCount: 1
    });
  });

  it('should handle errors', async () => {
    axios.get.mockRejectedValue(new Error('API error'));

    const response = await supertest(server)
      .get('/cLZojxk94ous/filteredResponses')
      .query({ filters: JSON.stringify([{ id: 'question2', condition: 'equals', value: 'value3' }]) })
      .expect(500);

    expect(response.body).toEqual({ message: 'Error fetching responses' });
  });
});