// Import necessary modules
const axios = require('axios');
const app = require('./app'); // Assuming your app setup is in app.js
const { filterResponses } = require('./filterResponses'); // Assuming filterResponses function is in a separate file

// Mock axios.get to simulate API response
jest.mock('axios');

describe('GET /filteredResponses endpoint', () => {
 test('should return filtered responses', async () => {
// Mock response data
const mockResponse = {
data: {
 responses: [
// Sample response data
 { id: 1, name: 'Abhinaya', timestamp: '2024-03-21T05:01:47.691Z' },
{ id: 2, name: 'John', timestamp: '2024-03-22T05:01:47.691Z' },
{ id: 3, name: 'Abhinaya', timestamp: '2024-03-23T05:01:47.691Z' }
] }
  };
    
    // Mock axios.get to return mockResponse when called
    axios.get.mockResolvedValue(mockResponse);

    // Make a request to the endpoint
    const response = await request(app).get(`/${formId}/filteredResponses`);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.totalResponses).toBe(2); // Two responses match the filters
    expect(response.body.responses).toEqual([
      { id: 1, name: 'Abhinaya', timestamp: '2024-03-21T05:01:47.691Z' },
      { id: 3, name: 'Abhinaya', timestamp: '2024-03-23T05:01:47.691Z' }
    ]);
    expect(response.body.pageCount).toBe(1);
  });

  test('should handle errors', async () => {
    // Mock axios.get to throw an error
    axios.get.mockRejectedValue(new Error('API Error'));

    // Make a request to the endpoint
    const response = await request(app).get(`/${formId}/filteredResponses`);
    
    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching responses' });
  });
});
