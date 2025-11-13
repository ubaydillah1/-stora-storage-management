/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

/**
 * Wraps a route handler (GET, POST, etc.) to provide automatic error handling.
 */
export function withErrorHandling<
  T extends (...args: any[]) => Promise<Response>
>(handler: T) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof Response) return err;

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
