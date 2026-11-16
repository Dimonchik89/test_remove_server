import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('profile/:id')
  async getUserInfo(@Param('id') id: string) {
    return await this.userService.getUserInfo(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    return this.userService.deleteUser(id);
  }

  @Patch('restore/:id')
  restoreAccount(@Param('id') id: string) {
    return this.userService.restoreAccount(id);
  }
}
