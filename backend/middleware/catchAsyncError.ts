import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsyncError = (theFunc: AsyncRequestHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

export default catchAsyncError; 