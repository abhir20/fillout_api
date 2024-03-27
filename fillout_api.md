Project Documentation: Filtering Form Responses API

This document describes a Node.js project that provides an API endpoint for filtering form responses based on user-specified criteria.

Project Structure:

package.json: This file lists project dependencies and scripts.
src/
app.js: This file contains the main application code.
filterResponses.test.js: This file contains unit tests for the filterResponses function.
.env: This file stores environment variables used by the application (API key, form ID).
README.md (optional): This file provides additional information about the project, installation instructions, and usage examples.
Dependencies:

Express: A popular Node.js framework for building web applications.
Cors: Middleware that allows the API to be accessed from different domains. -- yet to be implemented
Axios: A library used to make HTTP requests to the external API.
dotenv: A library used to load environment variables from a .env file.
Jest (or your chosen testing framework): A testing framework for unit testing the Node.js application.
Environment Variables:

FORM_ID_TOTEST: The ID of the form that the API should use to fetch responses.
API_KEY: The API key for accessing the fillout.com API.
PORT : where the server runs -- yet to be implemented
URL : filter api path -- yet to be implemented

API Endpoint:

URL: /**{formId}**/filteredResponses (GET)
Parameters:
filters (optional): An array of filter objects defining the criteria for filtering responses. Each filter object has the following properties:
id: The ID of the question to filter on.
condition: The comparison condition (e.g., equals, does_not_equal, greater_than, less_than).
value: The value to compare the question's answer with.
Response:
A JSON object containing:
responses: An array of filtered form response objects.
totalResponses: The total number of responses (currently set to 1, assuming all responses are on a single page).
pageCount: The number of pages containing responses (currently set to 1).
In case of errors, a status code of 500 is returned with an error message.
Function:

filterResponses(responses, filters): This function takes two arguments:
responses: An array of form response objects.
filters: An array of filter objects as described above. The function iterates through each response and checks if it matches all the provided filters. It supports different comparison operators and considers data types when necessary.
Testing:

The project includes unit tests for the filterResponses function to ensure its functionality under various conditions. You can run the tests using your chosen testing framework (e.g., Jest).

Deployment:

The project is deployed on GitHub for reference.
Automated deployment(CICD) is setup on render.com with a custom URL -  https://fillout-api-c1fu.onrender.com/cLZojxk94ous/filteredResponses?filters=[]

Additional Notes: 

Enhancements for future implementation

This is a basic implementation that can be extended to support additional features like pagination, sorting, and handling responses across multiple pages.
Consider implementing error handling for potential issues during the API call to the external service.
Consider using Azure key vault or AWS SAM to store keys
Consider using Redis cache/Kafka to store the responses
Consider creating a client UI to render the filtered responses in a grid
Consider shortening the URL path by hiding query strings, giving a meaningful path etc


