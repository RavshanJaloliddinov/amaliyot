import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';


@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const requestTime = new Date().toISOString();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName = 'UnknownError';

        // TypeORM QueryFailedError
        if (exception instanceof QueryFailedError) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorName = 'QueryFailedError';

            const driverError = exception.driverError;

            // PostgreSQL xato kodlari bo'yicha tekshirish
            switch (driverError.code) {
                case '23505': // unique_violation
                    message = 'Unique constraint failed: one or more fields must be unique';
                    break;
                case '23503': // foreign_key_violation
                    message = 'Foreign key constraint failed: related record does not exist';
                    break;
                case '23502': // not_null_violation
                    message = 'Not null constraint failed: required field is missing';
                    break;
                default:
                    message = driverError.message || 'Database query failed';
            }

            return response.status(statusCode).json({
                statusCode,
                message,
                errorName,
                requestTime,
                url: request.url,
            });
        }

        // HttpException (NestJS o'ziga xos xatolari)
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
            errorName = exception.name;

            return response.status(statusCode).json({
                statusCode,
                message,
                errorName,
                requestTime,
                url: request.url,
            });
        }

        // Boshqa barcha xatolar uchun
        return response.status(statusCode).json({
            statusCode,
            message: exception?.message || message,
            errorName: exception?.name || errorName,
            requestTime,
            url: request.url,
        });
    }
}
