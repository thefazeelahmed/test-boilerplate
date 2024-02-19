import { Module, forwardRef } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { JwtAuthService } from './services/jwt-auth.service';
import { AuthService } from '../modules/common/auth/auth.service';
import { UserModule } from '../modules/common/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [EmailService, JwtAuthService, AuthService],
  exports: [EmailService, JwtAuthService, AuthService],
})
export class CommonModule {}
