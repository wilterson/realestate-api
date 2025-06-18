# Backend API Testing - User Signup

## Overview
Implement a POST `/signup` route that allows users to create their profiles by submitting their details. The route should accept user data, process the registration, and return a confirmation message along with the created user object.

## Endpoint
`POST /signup`

## Route Handler
`backend/src/controllers/AuthController.ts`

## Request Body
The request should include a JSON object with the following properties:

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "termsAccepted": true
}
name: User's full name
email: User's email address
password: User's password
termsAccepted: Boolean indicating if the user accepted the terms and conditions
Response
On successful registration, the API should return a JSON object:

CopyRun
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "ISO 8601 date string"
  }
}
Note: The user object should follow the User data type, which includes at least the properties shown above (excluding password for security).

Implementation Details
Use the provided AuthController.ts to define the route handler.
Ensure proper validation of input data.
Handle duplicate email registration gracefully.
Hash the password before saving the user data.
Return appropriate HTTP status codes (e.g., 201 for success, 400 for bad request).
Additional Notes
You may use any ORM or database solution of your choice.
Focus on clean, maintainable, and secure code.