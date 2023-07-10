import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CreateUserDTO } from '../dto/create-user.dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): CreateUserDTO => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
