import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }

    if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
    ) {
        return res
            .status(409)
            .json({ success: false, message: "Resource already exists" });
    }

    console.error("Unexpected error", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

export default errorHandler;
