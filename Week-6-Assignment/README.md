[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19940643&assignment_repo_type=AssignmentRepo)
# Testing and Debugging MERN Applications

This assignment focuses on implementing comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, along with debugging techniques.

## Assignment Overview

You will:
1. Set up testing environments for both client and server
2. Write unit tests for React components and server functions
3. Implement integration tests for API endpoints
4. Create end-to-end tests for critical user flows
5. Apply debugging techniques for common MERN stack issues

## Project Structure

```
mern-testing/
├── client/                 # React front-end
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx         # Main application component
│   └── cypress/            # End-to-end tests
├── server/                 # Express.js back-end
│   ├── src/                # Server source code
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── tests/              # Server-side tests
│       ├── unit/           # Unit tests
│       └── integration/    # Integration tests
├── jest.config.js          # Jest configuration
└── package.json            # Project dependencies
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week6-Assignment.md` file
4. Explore the starter code and existing tests
5. Complete the tasks outlined in the assignment

## Files Included

- `Week6-Assignment.md`: Detailed assignment instructions
- Starter code for a MERN application with basic test setup:
  - Sample React components with test files
  - Express routes with test files
  - Jest and testing library configurations
  - Example tests for reference

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Basic understanding of testing concepts

## Testing Tools

- Jest: JavaScript testing framework
- React Testing Library: Testing utilities for React
- Supertest: HTTP assertions for API testing
- Cypress/Playwright: End-to-end testing framework
- MongoDB Memory Server: In-memory MongoDB for testing

## Testing & Debugging Strategy

### Server Side
- **Unit Testing:** Jest is used for unit tests in `server/tests/unit/`. Example: utility and error handler tests.
- **Integration Testing:** Supertest and MongoDB Memory Server are used for API and DB integration tests in `server/tests/integration/`.
- **Debugging:**
  - Global error handler middleware is implemented in `server/app.js`.
  - Logging and performance monitoring via `morgan`.
  - Use `console.log` or a logger for additional debugging.
- **How to Run:**
  ```sh
  cd server
  npm run test:unit         # Run unit tests
  npm run test:integration  # Run integration tests
  npm test                  # Run all tests with coverage
  ```
- **Coverage:**
  - Coverage reports are generated in `server/coverage/`.

### Client Side
- **Unit Testing:** Jest and React Testing Library are used for unit tests in `client/src/tests/unit/`.
- **Integration Testing:** Integration tests are in `client/src/tests/integration/`.
- **E2E Testing:** Cypress is set up in `client/cypress/e2e/` for end-to-end user flow tests.
- **Error Handling:**
  - React ErrorBoundary component is used for catching UI errors.
- **Debugging:**
  - Use browser dev tools for inspecting React components and state.
  - Error boundaries help catch and display UI errors.
- **How to Run:**
  ```sh
  cd client
  npx jest src/tests/unit --coverage         # Run unit tests
  npx jest src/tests/integration --coverage   # Run integration tests
  npx cypress open                           # Run E2E tests interactively
  npx cypress run                            # Run E2E tests headlessly
  ```
- **Coverage:**
  - Coverage reports are generated after running Jest with `--coverage`.

### Screenshots
- Add screenshots of your coverage reports (HTML or terminal output) to this README or a `screenshots/` folder.

### Notes
- Update test and E2E URLs as needed for your local setup.
- Expand tests for more components, hooks, and user flows for higher coverage and reliability.

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all required tests (unit, integration, and end-to-end)
2. Achieve at least 70% code coverage for unit tests
3. Document your testing strategy in the README.md
4. Include screenshots of your test coverage reports
5. Demonstrate debugging techniques in your code

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices) 