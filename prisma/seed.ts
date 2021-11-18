import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const Bob = await prisma.user.create({
    data: {
      email: 'bob@gmail.com',
      password:
        '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
      active: true,
      emailVerified: true,
      role: 'USER',
      Profile: {
        create: {
          name: 'Robert',
          username: 'Bob_Robert',
          country: 'Canada',
          bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          avatar: 'avatar/profile/2/6970e881-15f4-4682-ba86-562def8eaa1d.jpg'
        }
      }
    }
  })

  const Felipe = await prisma.user.create({
    data: {
      email: 'felipemillhouse@gmail.com',
      password:
        '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
      active: true,
      emailVerified: true,
      role: 'ADMIN',
      Profile: {
        create: {
          name: 'Felipe',
          username: 'felipemillhouse',
          country: 'Canada',
          bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          avatar: 'avatar/profile/2/6970e881-15f4-4682-ba86-562def8eaa1d.jpg'
        }
      }
    }
  })

  await prisma.follower.create({
    data: {
      idFollower: Felipe.profileId,
      idFollowing: Bob.profileId
    }
  })

  const TropicaBrand = await prisma.brand.create({
    data: {
      name: 'Tropica',
      website: 'https://www.tropica.com/',
      logo: 'brand/tropica-grey-logo-2019.png'
    }
  })

  const Plant1 = await prisma.plant.create({
    data: {
      name: "Eleocharis sp. 'Mini'",
      description:
        "Eleocharis sp. 'Mini' only grows to a height of 3-6 cm, which makes it even smaller than Eleocharis parvula (or rather, E. pusilla). It's also labeled Eleocharis acicularis 'Mini'. If you distribute it in small tufts over the entire area to be covered it will soon form a dense, lush lawn thanks to its many runners. It needs good light, but is a great choice as ground-covering plant as it is otherwise undemanding and hardly ever needs trimming.",
      avatar: 'plants/eleocharisMini.jpg',
      brandId: TropicaBrand.id
    }
  })
  await prisma.plant.create({
    data: {
      name: "Alternanthera reineckii 'Pink'",
      description:
        "Large motherplant, grown in a 9 cm square pot.  The pink underside of the leaves of Alternanthera reineckii 'Pink' provides an effective contrast to the many green plants in an aquarium - particularly when planted in groups. Stems becomes 25-50 cm tall.  Good light encourages the leaves to turn red. Easy to propagate by nipping off the terminal bud and planting it in the substrate. This also makes the mother plant more bushy, because more side shoots are formed. Alternanthera reineckii 'Pink'  originated in South America.",
      avatar:
        'https://tropica.com/imagegen.ashx?height=380&image=/Plants/023/2.png&crop=resize&class=product',
      brandId: TropicaBrand.id
    }
  })
  const Fert1 = await prisma.fertilizer.create({
    data: {
      name: 'Specialised Nutrition',
      description:
        'Contains nitrogen and phosphor for fast-growing and demanding plants, also contains iron, magnesium and vital micro nutrients. Suitable for aquariums with many and fast-growing plants',
      unit: 'ml/day',
      avatar: 'fertilizer/tropicaSpecializedNutrition.jpg',
      brandId: TropicaBrand.id
    }
  })
  const Fert2 = await prisma.fertilizer.create({
    data: {
      name: 'Premium Nutrition',
      description:
        'Contains iron, magnesium and vital micro nutrients, does not contain nitrogen and phosphor. Suitable for aquariums with few or slow-growing plants and many fish',
      unit: 'ml/day',
      avatar: 'fertilizer/tropicaPremiumNutrition.jpg',
      brandId: TropicaBrand.id
    }
  })

  await prisma.tank.create({
    data: {
      height: 11,
      width: 11,
      length: 11,
      name: 'Felipe Tank',
      Profile: {
        connect: {
          id: Felipe.profileId
        }
      },
      TankFertilizer: {
        createMany: {
          data: [
            {
              fertilizerId: Fert1.id
            },
            {
              fertilizerId: Fert2.id
            }
          ]
        }
      },
      TankPlant: {
        create: {
          plantId: Plant1.id
        }
      }
    }
  })

  await prisma.tank.create({
    data: {
      height: 11,
      width: 11,
      length: 11,
      name: 'Bob Tank',
      Profile: {
        connect: {
          id: Bob.profileId
        }
      }
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
