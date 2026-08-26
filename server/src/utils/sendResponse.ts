import type { Response } from 'express';

function sendResponse(
  res: Response,
  {
    statusCode,
    data = null,
    message,
  }: {
    statusCode: number;
    data?: unknown;
    message?: string;
  },
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export default sendResponse;
