const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Configuration
dotenv.config();

const app = express();
const formId = process.env.FORM_ID_TOTEST;
const apiKey = process.env.API_KEY;
const port = 3000;

// Services (consider separate files for each)
const filloutClient = axios.create({
  baseURL: 'https://api.fillout.com/v1/api/forms',
  headers: { Authorization: `Bearer ${apiKey}` }
});


// Function to filter responses based on provided filters
function filterResponses(responses, filters) {
  return responses.filter(response =>
    filters.every(filter => {
      const question = response.questions.find(q => q.id === filter.id);
      if (!question) return false;

      switch (filter.condition) {
        case 'equals':
          return question.value === filter.value;
        case 'does_not_equal':
          return question.value !== filter.value;
        case 'greater_than':
          return new Date(question.value) > new Date(filter.value);
        case 'less_than':
          return new Date(question.value) < new Date(filter.value);
        default:
          console.error(`Unsupported filter: ${filter.condition}`);
          return false;
      }
    })
  );
}

// Function to format response data with pagination
function formatResponseData(filteredResponses, totalResponses, page, pageCount) {
  return {
    responses: filteredResponses,
    totalResponses,
    page,
    pageCount
  };
}

// Endpoint to fetch filtered responses with pagination
app.get(`/${formId}/filteredResponses`, async (req, res) => {
  const filters = req.query.filters ? JSON.parse(req.query.filters) : [];
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size

  try {
    const response = await filloutClient.get(`${formId}/submissions`, {
      params: {
        filters: JSON.stringify(filters), // Include filters in params
        page,
        pageSize
      }
    });

    const filteredResponses = filterResponses(response.data.responses, filters);
    const totalResponses = response.data.total; // Assuming total count from the API response
    const pageCount = Math.ceil(totalResponses / pageSize);

    const formattedData = formatResponseData(filteredResponses, totalResponses, page, pageCount);

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching submissions'});
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
