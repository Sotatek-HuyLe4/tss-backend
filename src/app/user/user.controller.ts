import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SwaggerDecorator } from '../../common/decorators/swagger.decorator';
import { UserService } from './user.service';
import { allUsersSwagger } from './swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @SwaggerDecorator({
    operations: allUsersSwagger.operations,
    responses: allUsersSwagger.responses,
  })
  async getAllUsers() {
    const data = await this.userService.getAllUsers();

    return {
      data,
      message: 'All users fetched successfully',
    };
  }
}
