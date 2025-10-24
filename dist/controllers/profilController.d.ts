import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare class ProfilDesaController {
    getProfil(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfil(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    createProfil(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=profilController.d.ts.map