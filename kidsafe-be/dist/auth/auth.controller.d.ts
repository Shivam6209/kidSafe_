import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        token: string;
    }>;
    childLogin(body: {
        deviceId: string;
    }): Promise<{
        success: boolean;
        childId: number;
    }>;
}
