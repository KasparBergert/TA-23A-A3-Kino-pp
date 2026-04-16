import prisma from '../../db'
import type TokenPair from "../../types/TokenPair";
import tokenService from "./TokenService";
import passwordUtils from "../../utils/passwordUtils";

class AuthService {

  //validates if user entered the right password
  private async validatePassword(email: string, entered_password: string): Promise<Boolean> {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user === null) return false;

    return passwordUtils.verify(user.password, entered_password)
  }

  //gives both refresh and access token when entered are correct
  async createUserTokens(email: string, entered_password: string): Promise<null | TokenPair> {
    const valid = await this.validatePassword(email, entered_password)
    if (!valid) { return null; }

    const tokens = tokenService.createTokens({ email });
    return tokens
  }

}


const authService = new AuthService();
export default authService;
