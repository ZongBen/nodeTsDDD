import bcrypt from "bcrypt";

export class CryptoService {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
