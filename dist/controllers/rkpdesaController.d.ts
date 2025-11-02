import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare class RKPDesaController {
    getAll(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getByTahun(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=rkpdesaController.d.ts.map