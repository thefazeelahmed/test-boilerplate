import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { JwtGuard } from '../../../common/guards/jwt-guards';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import compileEmailTemplate from '../../../common/services/compile-email.service';
import { EmailService } from '../../../common/services/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userRepository: UserRepository) {}

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    const existingUser = await this.userService.findOne({
      email: signupDTO.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const { data } = await this.userService.create({
      ...signupDTO,
      emailVerificationToken: await this.authService.generateOtp(),
    });

    const encodedLink = this.authService.encodeLink({
      token: data.emailVerificationToken,
      email: data.email,
    });

    const link = this.authService.generateEncodedLink(
      'http://example.com',
      encodedLink,
    );

    const welcomeEmail = await compileEmailTemplate({
      fileName: 'welcome-email.mjml',
      data: {
        name: data.name,
        email: data.email,
        code: data.emailVerificationToken,
      },
    });

    const confirmEmailTemplate = await compileEmailTemplate({
      fileName: 'confirm-email.mjml',
      data: {
        name: data.name,
        email: data.email,
        code: data.emailVerificationToken,
        link,
      },
    });

    this.emailService.sendMail(
      data.email,
      'Confirm your email address',
      welcomeEmail,
    );

    this.emailService.sendMail(
      data.email,
      'Confirm your email address',
      confirmEmailTemplate,
    );

    return new ApiResponseDto('Signup Successful');
  }

  @UseGuards(JwtGuard)
  @Post('verify-token')
  async verifyToken(@Req() req) {
    const userDetails = req.user;

    return new ApiResponseDto('Login Successful', {
      user: userDetails,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    const user = await this.userService.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const otp = await this.authService.generateOtp();
    user.passwordResetToken = otp;
    user.passwordResetTokenExpiresAt = Date.now() + 30 * 60 * 1000;
    this.userService.findByIdAndUpdate(user._id, user);

    const template = await compileEmailTemplate({
      fileName: 'reset-password.mjml',
      data: {
        name: user.name,
        email: user.email,
        code: otp.toString(),
      },
    });

    this.emailService.sendMail(
      forgotPasswordDto.email,
      'Reset Password',
      template,
    );

    return new ApiResponseDto('OTP Generated');
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDTO) {
    const user = await this.userService.findOne({
      email: verifyEmailDto.email,
      emailVerificationToken: verifyEmailDto.otp,
    });

    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }

    if (Date.now() > user.emailVerificationTokenExpiresAt) {
      throw new BadRequestException('OTP Expired');
    }

    await this.userService.updateOne(
      {
        email: verifyEmailDto.email,
      },
      {
        emailVerified: true,
      },
      {
        new: true,
      },
    );

    return new ApiResponseDto('Email Verified', {}, null);
  }

  @Post('generate-verify-email-otp')
  async generateVerifyEmailOTP(@Body() verifyEmailDto: ForgotPasswordDTO) {
    const user = await this.userService.findOne({
      email: verifyEmailDto.email,
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const { data } = await this.userService.findByIdAndUpdate(user._id, {
      emailVerificationToken: await this.authService.generateOtp(),
      emailVerificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    const confirmEmailTemplate = await compileEmailTemplate({
      fileName: 'confirm-email.mjml',
      data: {
        name: data.name,
        email: data.email,
        code: data.emailVerificationToken,
      },
    });

    this.emailService.sendMail(
      data.email,
      'Confirm your email address',
      confirmEmailTemplate,
    );

    return new ApiResponseDto(
      'Email Verification Token Sent , Check Your Email',
      {},
      null,
    );
  }

  @Post('verify-password-otp')
  async verifyResetPasswordCode(@Body() verifyEmailDto: VerifyEmailDTO) {
    const user = await this.userService.findOne({
      email: verifyEmailDto.email,
      passwordResetToken: verifyEmailDto.otp,
    });

    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }

    return new ApiResponseDto('OTP Verified', {}, null);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    const user = await this.userService.findOne({
      email: resetPasswordDTO.email,
      otp: resetPasswordDTO.otp,
    });

    if (!user) {
      throw new BadRequestException("User with this email doesn't exist");
    }

    if (Date.now() > user.passwordResetTokenExpiresAt) {
      throw new BadRequestException('OTP Expired');
    }

    user.password = await bcrypt.hash(resetPasswordDTO.newPassword, 12);
    await this.userService.findByIdAndUpdate(user._id, user);
    return new ApiResponseDto('Password Reset Successful', {}, null, false);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findOne({
      email: loginDTO.email,
      isLoginEnabled: true,
      fields: 'password,emailVerified',
    });

    if (
      !user ||
      !(await this.authService.comparePassword(
        loginDTO.password,
        user.password,
      ))
    ) {
      throw new HttpException('Incorrect Credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.createToken(user);

    return new ApiResponseDto('Login Successful', { api_token: token }, null);
  }
}
