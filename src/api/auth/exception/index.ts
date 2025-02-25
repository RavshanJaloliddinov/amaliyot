import { HttpException } from "@nestjs/common";

export class AuthorizationError extends HttpException {
    constructor() {
        super(
            JSON.stringify({
                statusCode: 401,
                message: "Authorization error: You are not authorized to access this resource.",
                error: "Unauthorized",
            }),
            401,
        );
    }
}
