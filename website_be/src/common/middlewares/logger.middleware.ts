import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { timestamp } from "rxjs";

@Injectable()
export class LoggerMiddleWare implements NestMiddleware {
  private logger = new Logger("RequestLogger");

  use(request: Request, response: Response, next: NextFunction) {
    const now = Date.now();

    const generateRequestLog = () => {
      return {
        user_agent: request.get("user-agent") || "Unknown",
        method: request.method,
        url: request.originalUrl,
        status_code: response.statusCode,
        status_message: response.statusMessage,
        content_length: response.get("content-length") || 0,
        response_time: Date.now() - now,
        content_type: response.get("content-type") || "Unknown",
        accept: request.get("accept") || "Unknown",
        ip: request.get("x-forwarded-for") || request.ip,
        timestamp: new Date().toISOString(),
      }
    }

    response.on("finish", () => {
      this.logger.log(JSON.stringify(generateRequestLog()));
    });

    next();
  } 
}