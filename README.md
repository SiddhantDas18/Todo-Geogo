# Todo App

A modern Todo application built with Next.js, TypeScript, and Prisma. This application allows users to manage their tasks efficiently with a clean and intuitive interface.

## Features

- Create, read, update, and delete todos
- User authentication
- Modern UI with Framer Motion animations
- Responsive design
- Type-safe with TypeScript
- Database integration with Prisma

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)
- PostgreSQL (for database)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/todo"
   JWT_SECRET="your-secret-key"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t todo-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e DATABASE_URL="postgresql://user:password@host:5432/todo" -e JWT_SECRET="your-secret-key" todo-app
   ```

For production deployment, it's recommended to use Docker Compose to manage the application and database services together.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

- `/app` - Next.js application routes and pages
- `/Components` - Reusable React components
- `/middleware` - Custom middleware functions
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Framer Motion
- JWT for authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
