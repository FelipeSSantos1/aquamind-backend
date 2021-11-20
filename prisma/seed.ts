import { PrismaClient } from '@prisma/client'
import plants from './plantSeed'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'apple@aquamind.app',
      password:
        '8c454bbf296aa786d6fe4fc7c9b9f6aae370b6061a452a1cdc7ad9ac04a5c164', // 2VySWQiOiI1YmVlMWI3OS0wNz
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

  const TropicaBrand = await prisma.brand.create({
    data: {
      name: 'Tropica',
      website: 'https://www.tropica.com/',
      logo: 'brand/tropica-grey-logo-2019.png'
    }
  })

  await prisma.plant.createMany({
    data: plants
  })
  await prisma.fertilizer.create({
    data: {
      name: 'Specialised Nutrition',
      description:
        'Contains nitrogen and phosphor for fast-growing and demanding plants, also contains iron, magnesium and vital micro nutrients. Suitable for aquariums with many and fast-growing plants',
      unit: 'ml/day',
      avatar: 'fertilizer/tropicaSpecializedNutrition.jpg',
      brandId: TropicaBrand.id
    }
  })
  await prisma.fertilizer.create({
    data: {
      name: 'Premium Nutrition',
      description:
        'Contains iron, magnesium and vital micro nutrients, does not contain nitrogen and phosphor. Suitable for aquariums with few or slow-growing plants and many fish',
      unit: 'ml/day',
      avatar: 'fertilizer/tropicaPremiumNutrition.jpg',
      brandId: TropicaBrand.id
    }
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
