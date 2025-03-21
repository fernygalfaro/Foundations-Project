# Foundations Project

## Overview
This project is a reimbursement ticketing system that allows employees to submit reimbursement requests and managers to process them. It includes authentication, ticket submission, ticket processing, and viewing previous requests. The system ensures proper tracking of reimbursement requests and user roles.

## Technologies Used
- **NodeJS** - Backend runtime environment
- **ExpressJS** - Web framework for handling API requests
- **AWS SDK** - Integration with AWS services
- **DynamoDB** - NoSQL database for storing user and ticket information
- **Jest** - Testing framework for unit and integration testing
- **Postman** - API testing and validation

## Features
### 1. Authentication
- Users can register and log in.
- Default role is "Employee" upon registration.
- Ensures unique usernames.

### 2. Submit Ticket
- Employees can submit reimbursement requests.
- Tickets require an amount and description.
- Default status is "Pending."

### 3. Ticket Processing
- Managers can approve or deny tickets.
- Processed tickets cannot change status.
- Pending tickets are listed for managers.
- Tickets are removed from the queue once processed.

### 4. View Previous Tickets
- Employees can view their submitted tickets.
- Tickets display status and submission details.

## Setup Instructions
1. Clone the repository from GitHub.
2. Install dependencies: `npm install`
3. Configure AWS credentials for DynamoDB access.
4. Run the application: `npm start`
5. Use Postman to test API endpoints.

## Testing
Run tests using Jest:
```sh
npm test
```



