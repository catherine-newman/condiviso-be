# Condiviso Backend

This README provides an overview of the Condiviso app's backend structure, setup, and usage. Condiviso helps users to arrange food events and avoid food waste.

Link to hosted api: https://condiviso-be.onrender.com/api/events

## Table of Contents

- [Setup](#setup)
- [Usage] (#usage)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Contributors] (#contributors)
-[License] (#license)

## Setup

Ensure node (v14.1.0 or higher) is installed.

1. Clone this repository to your local machine.
    `git clone https://github.com/catherine-newman/condiviso-be`
2. Install dependencies using the command: `npm install`.
3. Set up your environment variables (see [Environment Variables](#environment-variables)).
4. Start the development server with: `npm run dev`.

## Usage
The endpoints available allow the following functionality:
- POST event/user/recipe
- GET api/event/events(filterable by location and associated user)/recipe/recipe/user
- PATCH event/recipe/user
- DELETE recipe

## Database

The backend uses MongoDB to store user data, events, and recipes. Database connection and management are handled by the db/connection.js module. Data seeding is performed using the db/data/run-seed.js script.

To seed the database with initial data, run the following command:
 `node db/data/run-seed.js`


## Environment Variables

Create the following environment variable files in the root directory:

- `.env.production`: Environment variables for production.
- `.env.test`: Environment variables for testing.

Example of `.env.production`:

ATLAS_URI=mongodb+srv://<username>:<password>@<cluster-url>/condivisoproject?retryWrites=true&w=majority

Note: Replace <username>, <password>, and <cluster-url> with your MongoDB Atlas credentials.

## Contributors

Catherine Newman, Harriet Hall, Luke Ford, Stephen Lancaster and Simone Dessi. 


## License

This project is licensed under the [MIT License]











 