import prisma from '../../../Backend/db'

export async function createRoles() {
  await prisma.roles.createMany({
    data: [{ code: 'admin' }, { code: 'user' }],
    skipDuplicates: true,
  })
}
