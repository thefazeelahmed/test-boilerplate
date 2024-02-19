import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { EmailService } from '../../../common/services/email.service';
import { JwtGuard } from '../../../common/guards/jwt-guards';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password-dto';

import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @UseGuards(JwtGuard)
  @Get('')
  async getAll(@Req() request, @Query() params) {
    const filters = await this.userService.roleBaseFilters(
      request.user.role,
      request.user,
    );

    return await this.userService.findAll({
      ...params,
      ...filters,
      populateFields: {
        path: 'workshop',
      },
    });
  }

  @Get('who-am-i')
  async whoAmI(@Query() params) {
    return await this.userService.findAll(params);
  }

  @UseGuards(JwtGuard)
  @Patch('update-password')
  async updatePassword(
    @Req() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.userService.findOne({
      _id: request.user.id,
      fields: 'password',
    });

    if (
      !user ||
      !(await this.authService.comparePassword(
        updatePasswordDto.currentPassword,
        user.password,
      ))
    ) {
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
    }

    if (
      !(updatePasswordDto.confirmNewPassword === updatePasswordDto.newPassword)
    ) {
      throw new BadRequestException("Passwords Doesn't Match");
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 12);
    return this.userService.findByIdAndUpdate(request.user._id, user);
  }
}
