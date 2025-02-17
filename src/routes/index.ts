import { FastifyInstance } from "fastify";

export default async function indexRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    reply.type("text/html").send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Fastify Bank Service API</title>
            <style>
              body {
                font-family: system-ui;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                line-height: 1.6;
              }
              .container {
                text-align: center;
              }
              .swagger-link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background: #43a047;
                color: white;
                text-decoration: none;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 Fastify Bank Service API</h1>
              <p>Welcome to our blazingly fast banking service built with Fastify!</p>
              <p>Manage your money at the speed of light.</p>
              <a href="/docs" class="swagger-link">View API Documentation</a>
            </div>
          </body>
        </html>
      `);
  });
}
