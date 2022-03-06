require('dotenv').config();

export class Config { 
  static port: number = Number(process.env.PORT) || 3001;
  static pgUser: string = process.env.PGUSER || 'selectel';
  static pgHost: string = process.env.PGHOST || '0.0.0.0';
  static pgDatabase: string = process.env.PGDATABASE || 'selectel';
  static pgPassword: string = process.env.PGPASSWORD || 'postgres';
  static pgPort: number = Number(process.env.PGPORT) || 5432;
  static signatureJWT: string = process.env.SIGNATUREJWT || 'ToDosSIGNaTUrEJWT143';
}
