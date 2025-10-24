import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare class AuthController {
    login(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    register(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authController.d.ts.map