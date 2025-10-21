import hashPassword from './hash.ts'
import AccountDetails from '../types/AccountDetails.ts'
import { Connection } from 'mariadb/*'
import prisma from '../../database/db.ts'

/**
 * creates an account in the DB
 *
 * @param {Object} details - The account data.
 * @param {string} details.email - Account email address.
 * @param {string} details.password - Account password.
 * @param {string} role - type of role to give user (e.g. admin, user) default is 'user'.
 *
 * @returns {Promise<boolean>} was user created?
 */
export default async function createAccount(
  details: AccountDetails,
  role = 'user',
): Promise<boolean> {
  const hash = await hashPassword(details.password)
  try{

    //insert user into database
    const dbUser = await prisma.users.create({
      data: {
        email: details.email,
        hashed_password: hash
      }
    })

    //get 'role' id from the database.
    const dbRole = await prisma.roles.findFirst({
      where:{
        code: role
      },
      select:{
        id: true
      }
    })

    if(dbRole == null){
      console.error(`dbRole returned null. ${role} was given`)
      return false;
    }

    //attach a role to the user
    await prisma.user_roles.create({
      data:{
        user_id: dbUser.id,
        role_id: dbRole.id
      }
    })

  }catch(error: any){
    console.error(`${error.code}: \nmessage: ${error.message}\nmeta:\n${error.meta}`)
    return false;
  }

  return true
}
