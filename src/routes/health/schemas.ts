import { Type } from "@sinclair/typebox";

export const healthCheckSchema = {
  response: {
    200: Type.Object({
      status: Type.String(),
      timestamp: Type.String(),
      version: Type.String(),
    }),
  },
  description: "Health check endpoint",
  tags: ["Health"],
};
