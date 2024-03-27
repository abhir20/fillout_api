const axios = require('axios');
const supertest = require('supertest');
const app = require('src/index'); // Correct path to your Express app file

jest.mock('axios');

describe('GET /:formId/filteredResponses', () => {
  let server;

  beforeAll(() => {
    server = app.listen(5000); // Listen on a different port for testing
  });

  afterAll((done) => {
    server.close(done);
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

    axios.get.mockResolvedValue({ data: { responses: mockedResponses } });

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