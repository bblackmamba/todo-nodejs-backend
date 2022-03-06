import { request, Request, Response, } from 'express';
const pjson = require('../../package.json');

export class HealthController {

  static  getHealth (req: Request, res: Response): void {
    res.status(200).json({
      name: pjson.name,
      version: pjson.version,
    })
  }
}
