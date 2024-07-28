import { ActionAlreadyDoneError } from '@/shared/application/errors/action-already-done-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(ActionAlreadyDoneError)
export class ActionAlreadyDoneErrorFilter implements ExceptionFilter {
  catch(exception: ActionAlreadyDoneError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
