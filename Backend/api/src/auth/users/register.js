export default function register(req, res) {
  /*

 takes in
 {
  email
  password
  name
 }



 if any is missing, returns VAL error.
 if any with wrong type return val error
 if field contains invalid chars, val error
 if field contains too many chars, val error, email, password and name have different length minimums  

 use userSchema for type checking  

 if password is 8 chars or more and 4 numbers or more, it is seen as valid
 
 if database cannot find a user with the email and password (that was hashed before).
  send error

 if it reaches here, 
 create the account using a helper fuction to set the data, verify it and make the password the hash needed
 
 create refreshToken as cookie
 create accessToken
 
 send success code and access token 
 */
}
