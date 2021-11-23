import { PrismaClient } from '@prisma/client'
import plants from './plantSeed'
import fertilizerTropica from './fertilizer/tropica'
import fertilizerAda from './fertilizer/ada'
import fertilizerSeachem from './fertilizer/seachem'
import fertilizerNilocG from './fertilizer/nilocG'
import fertilizerGreenAqua from './fertilizer/greenAqua'
import fertilizerCustom from './fertilizer/custom'
import fertilizerDennerle from './fertilizer/dennerle'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'apple@aquamind.app',
      password:
        '8c454bbf296aa786d6fe4fc7c9b9f6aae370b6061a452a1cdc7ad9ac04a5c164',
      active: true,
      emailVerified: true,
      role: 'USER',
      Profile: {
        create: {
          name: 'Apple Tester',
          username: 'appletest',
          country: 'Canada',
          bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          avatar: 'avatar/profile/0/Apple_gray_logo.jpg'
        }
      }
    }
  })
  await prisma.user.create({
    data: {
      email: 'felipemillhouse@gmail.com',
      password:
        '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
      active: true,
      emailVerified: true,
      role: 'ADMIN',
      Profile: {
        create: {
          name: 'Felipe Santos',
          username: 'felipe',
          country: 'Canada',
          bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          avatar: 'avatar/profile/0/Apple_gray_logo.jpg'
        }
      }
    }
  })

  // Fertilizer Tropica
  await prisma.brand.create({
    data: {
      name: 'Tropica',
      website: 'https://www.tropica.com',
      logo: 'brand/tropica-grey-logo-2019.png',
      Fertilizer: {
        createMany: {
          data: fertilizerTropica
        }
      }
    }
  })
  // Fertilizer ADA
  await prisma.brand.create({
    data: {
      name: 'ADA',
      website: 'https://www.adana.co.jp',
      logo: 'brand/LogoADA.jpg',
      Fertilizer: {
        createMany: {
          data: fertilizerAda
        }
      }
    }
  })
  // Fertilizer Seachem
  await prisma.brand.create({
    data: {
      name: 'Seachem',
      website: 'https://www.seachem.com',
      logo: 'brand/LogoSeachem.jpg',
      Fertilizer: {
        createMany: {
          data: fertilizerSeachem
        }
      }
    }
  })
  // Fertilizer co-op
  await prisma.brand.create({
    data: {
      name: 'Aquarium Co-op',
      website: 'https://www.aquariumcoop.com',
      logo: 'brand/LogoCoOp.jpg',
      Fertilizer: {
        create: {
          name: 'Easy Green All-in-One Fertilizer',
          description:
            'Contains All Essential Nutrients Plants Need Easy Dosing, 1 Pump Per 10 Gallons Fish, Shrimp, and Snail Safe',
          unit: 'ml/day',
          avatar: 'fertilizer/EasyGreenAllInOne.jpg'
        }
      }
    }
  })
  // Fertilizer nilocg
  await prisma.brand.create({
    data: {
      name: 'NilocG',
      website: 'https://www.nilocg.com',
      logo: 'brand/nilocg.jpg',
      Fertilizer: {
        createMany: {
          data: fertilizerNilocG
        }
      }
    }
  })
  // Fertilizer GreenAqua
  await prisma.brand.create({
    data: {
      name: 'Green Aqua',
      website: 'https://greenaqua.hu',
      logo: 'brand/LogoGreenAqua.jpg',
      Fertilizer: {
        createMany: {
          data: fertilizerGreenAqua
        }
      }
    }
  })
  // Fertilizer Custom
  await prisma.brand.create({
    data: {
      name: 'No Brand',
      website: '',
      logo: '',
      Fertilizer: {
        createMany: {
          data: fertilizerCustom
        }
      }
    }
  })
  // Fertilizer Dennerle
  await prisma.brand.create({
    data: {
      name: 'Dennerle',
      website: 'https://dennerle.com',
      logo: 'brand/dennerleLogo.jpg',
      Fertilizer: {
        createMany: {
          data: fertilizerDennerle
        }
      }
    }
  })

  await prisma.plant.createMany({
    data: plants
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
