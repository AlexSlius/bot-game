import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const type = host.getType();

        this.logger.error(`Exception caught (type: ${type}):`, exception);

        if (type === 'http') {
            const response = host.switchToHttp().getResponse();
            response.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
}
