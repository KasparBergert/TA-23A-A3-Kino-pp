import userManager from "../repositories/UserRepository";
import type TokenPair from "../../types/TokenPair";
import tokenService from "./TokenService";
import passwordUtils from "../../utils/passwordUtils";

class AuthService {

  //validates if user entered the right password
  private async validatePassword(email: string, entered_password: string): Promise<Boolean> {
    //search the database for a user, get the password hash and determine if the password is the same
    const user = await userManager.getUserByEmail(email);
    //check if user was found
    if (user === null) return false;

    return passwordUtils.verify(entered_password, user.password)
  }

  //gives both refresh and access token when entered are correct
  async createUserTokens(email: string, entered_password: string): Promise<null | TokenPair> {
    //validate if user has the right password
    const valid = this.validatePassword(email, entered_password)
    if(!valid){ return null; }

    const tokens = tokenService.createTokens(email);
    return tokens
  }

}


const authService = new AuthService();
export default authService;

