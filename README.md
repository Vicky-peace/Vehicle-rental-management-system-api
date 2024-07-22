# CarHub Booking Website - API

## Overview

CarHub is a vehicle booking platform that allows users to browse, book, and manage vehicle rentals. This README provides an overview of the server-side architecture and features of the CarHub booking website, including details about the technologies used, key endpoints, and how to get started.

## Technologies Used

- **Hono**: A small, fast, and minimalistic web framework for building APIs.
- **Drizzle ORM**: Type-safe SQL ORM for database interactions.
- **Neon**: Serverless Postgres with modern developer workflows.
- **JWT**: JSON Web Tokens for user authentication.
- **Dotenv**: Module to load environment variables from a `.env` file.

## Project Structure

### Key Endpoints

- **`/api/users`**: Manages user operations such as registration, login, and user details.
- **`/api/bookings`**: Handles booking creation, retrieval, and updates.
- **`/api/locations`**: Provides location data for vehicle pickups.
- **`/api/payments`**: Manages payment transactions via Stripe.

### API Endpoints Breakdown

- **Users**
  - `POST /api/users/register`: Registers a new user.
  - `POST /api/users/login`: Authenticates a user and returns a JWT.
  - `GET /api/users/profile`: Retrieves the profile of the authenticated user.
  - `DELETE /api/users/:id`: Disables a user account (admin only).

- **Bookings**
  - `POST /api/bookings`: Creates a new booking.
  - `GET /api/bookings`: Retrieves all bookings.
  - `GET /api/bookings/:id`: Retrieves a specific booking by ID.
  - `PUT /api/bookings/:id/status`: Updates the status of a booking.

- **Locations**
  - `GET /api/locations`: Retrieves all available locations.

- **Payments**
  - `POST /api/payments`: Initiates a payment transaction via Stripe.

## Getting Started

### Prerequisites

- Node.js and pnpm installed on your machine.
- Neon database setup and running.
- Access to environment variables for database connection and JWT secrets.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/carhub-api.git
   cd carhub-api
