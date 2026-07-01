import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SwaggerDecorator } from '../../common/decorators/swagger.decorator';
import { UserService } from './user.service';
import { allUsersSwagger, userByIdSwagger } from './swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
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

  @Get(':id')
  @SwaggerDecorator({
    operations: userByIdSwagger.operations,
    params: userByIdSwagger.params,
    responses: userByIdSwagger.responses,
  })
  async getUserById(@Param('id') id: string) {
    const data = await this.userService.getUserById(id);

    return {
      data,
      message: 'User fetched successfully',
    };
  }
}
