import { Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { BaseError } from '../exceptions/BaseError';
import { UserService } from '../services/user.service';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { HttpBaseError } from '../exceptions/HttpBaseError';

export class UserController {
  
  static async signUp (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        throw new BaseError({
          httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, 
          name: 'Data validation', 
          description: errors.array().map((el) => {
            return `${el.param}: ${el.msg}`;
        }).join()});
      } else {
        const name: string = req.body.name;
        const login: string = req.body.login;

        const id: number = await UserService.signUp({
          login: login,
          name: name,
          password: req.body.password,
        })

        res.json(UserService.genrateJWT({id: id, name: name, login: login}));
      }
    } catch (e) {
      HttpBaseError({response: res, err: e});
    }
  }

  static async login (req: Request, res: Response): Promise<void> {
    try {
      res.json(await UserService.login(req.body.login, req.body.password));
    } catch (e) {
      HttpBaseError({response: res, err: e,})
    }
  }

  static async attachCurrentUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(2);
      const decodedTokenData: string = UserController.getTokenFromHeader(req);
      
      req.body.currentUser = await UserService.checkToken(decodedTokenData);
      next();
    } catch (e) {
      HttpBaseError({response: res, err: e,})
    }
  }

  static getTokenFromHeader (req: Request): string {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
  }

}