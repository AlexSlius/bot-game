import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class AuthCrmGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        if (context.getType() !== 'http') {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'];

        if (!request.url.startsWith('/api/')) {
            return true;
        }

        if (apiKey && apiKey === process.env.API_KEY) {
            return true;
        }

        return false;
    }
}
