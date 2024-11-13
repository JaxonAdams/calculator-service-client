# "Premium Calculator" Client

# Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Test Credentials](#test-credentials)
4. [Setup](#setup)
5. [Running the Client Locally](#running-the-client-locally)

-----

## Project Overview

This project is a calculator service that performs various operations and provides an API for accessing these operations. The client-side application for interacting with this service is a React application.

The calculator uses a transaction-based system wherein a user starts with a certain balance, and requesting operations decreases that balance.

This respository hosts the client side of the project. You can find the server side [here](https://github.com/JaxonAdams/calculator-service-server).

-----

![image](https://github.com/user-attachments/assets/f088ff9b-88a0-4b1e-804a-b4e1b48bb4ff)

-----

![image](https://github.com/user-attachments/assets/593884ce-3d3f-4b1d-a418-ebb980dd9884)

-----

![image](https://github.com/user-attachments/assets/6dc2a2a2-8b50-466f-9dfe-b45ca95b7ea1)

-----

![image](https://github.com/user-attachments/assets/b9d10bc4-f3fe-4ed5-b40a-a81649804496)

-----

## Prerequisites

 - Node.js (v14 or higher)
 - npm (v6 or higher)

-----

## Test Credentials

If you'd like to test out my app, you can do so with the following login credentials for a test user:
```
test.user@example.com
HELLO-pw123~!
```

-----

## Setup

1. Clone the repository:
```bash
$ git clone https://github.com/JaxonAdams/calculator-service-client.git
$ cd calculator-service-client
```

2. Install dependencies:
```bash
$ npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ADMIN_API_KEY=your_admin_api_key  # Reach out to Jaxon if you'd like one for testing purposes
```

## Running the Client Locally

To start the development server, run:
```bash
$ npm run dev
```