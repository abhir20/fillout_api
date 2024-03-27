
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const formId = process.env.FORM_ID_TOTEST; //Added in env file -  test with your form id
const api_key = process.env.API_KEY;
const port = 3000;


// Function to filter responses based on provided filters
function filterResponses(responses, filters) {
  return responses.filter(response => {
    for (const filter of filters) {
      const question = response.questions.find(q => q.id === filter.id);
      if (!question) {
        return false;
      }

      let match = false;
      switch (filter.condition) {
        case 'equals':
          match = question.value === filter.value;
          break;
        case 'does_not_equal':
          match = question.value !== filter.value;
          break;
        case 'greater_than':
          match = new Date(question.value) > new Date(filter.value);
          break;
        case 'less_than':
          match = new Date(question.value) < new Date(filter.value);
          break;
        default:
          console.error(`Unsupported filter: ${filter.condition}`);
          break;
      }

      if (!match) {
        return false;
      }
    }
    return true;
  });
}

// Endpoint to fetch filtered responses
app.get(`/${formId}/filteredResponses`, async (req, res) => {
  const filters = req.query.filters ? JSON.parse(req.query.filters) : [];
    try {
      const response = await axios.get(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${api_key}` //Added in env file -  test with your api_key
        },
        params: req.query, // Pass through existing pagination parameters
      });
      
      const filteredResponses = filterResponses(response.data.responses, filters);
      const filteredData = {
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: 1 // Assuming all responses are on a single page
      };
     
      res.json(filteredData); //To show data on browser
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching responses' });
    }
  });


app.listen(port, () => console.log(`Server is up on port ${port}`))