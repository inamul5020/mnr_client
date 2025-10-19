import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
    passcode?: string;
}
export declare const authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const verifyDeletePasscode: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const getClientIP: (req: Request) => string | undefined;
export declare const logAuditAction: (action: string, entityType: string, entityId: string, userId: string, oldValues: any | null, newValues: any | null, clientIntakeId: string | null, req: Request) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map