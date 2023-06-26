import { Request, Response } from 'express';
export declare const getEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getEmployees: (req: Request, res: Response) => Promise<void>;
export declare const updateEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
