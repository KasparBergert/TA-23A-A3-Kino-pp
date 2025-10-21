import prisma from "../Backend/database/db";

async function runSeed(){
  await prisma.roles.createMany({
    data:[
      {code: 'user'},
      {code: 'admin'}
    ],
    skipDuplicates: true
  });

}

runSeed().then(() => prisma.$disconnect).catch((err) => {console.log(err)})
