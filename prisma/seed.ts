import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create an array of promises for creating users
  const userPromises = [];

  for (let i = 1; i <= 100; i++) {
    // Generate some dummy data for each user
    const name = `User ${i}`;
    const email = `user${i}@example.com`;
    // Randomly decide not to add a plan to some users (e.g., 25% chance)
    const addPlan = Math.random() > 0.25;
    // Randomly select a plan ID from 1 to 4 if a plan is to be added
    const planId = addPlan ? Math.floor(Math.random() * 4) + 1 : null;

    userPromises.push(
      prisma.user.create({
        data: {
          id: `DEMO_USER_${i}`,
          name: name,
          email: email,
          // Adjust the role, createdAt, updatedAt as per your requirements
          // Optionally add a plan to the user
          ...(planId && { planId: planId }),
        },
      }),
    );
  }

  // Wait for all User creations to be processed
  await Promise.all(userPromises);
  console.log("100 users created, some with random plans.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
