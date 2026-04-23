import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the user (or any data) from the JWT payload
 * attached to the request.
 * 
 * Usage: @GetUser() user: any
 * Or specifically: @GetUser('sub') userId: number
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // This assumes an AuthGuard has already run and attached the user to the request

    return data ? user?.[data] : user;
  },
);
