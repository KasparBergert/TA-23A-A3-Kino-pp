import { Request, Response } from 'express'
import userRepository from '../../repositories/UserRepository'

export default async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.userId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    const user = await userRepository.getById(id)
    if (!user) return res.status(404).send('User not found')
    if (user.email === 'hannes@tamm.com') {
      return res.status(403).send('Protected account cannot be deleted')
    }
    await userRepository.delete(id)
    res.status(204).send()
  } catch {
    res.status(404).send('User not found')
  }
}
