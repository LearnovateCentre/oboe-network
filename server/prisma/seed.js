import { employees } from "./data.js";
import prisma from "./client.js";

async function seed() {
  console.log("Seeding database...");

  for (const employee of employees) {
    const { skills, interests, groups, ...employeeData } = employee;

    const newEmployee = await prisma.employee.create({
      data: {
        ...employeeData,
        skills: {
          create: skills.map((skill) => ({
            ...skill,
            skill: {
              connectOrCreate: {
                where: { name: skill.skill.name },
                create: { name: skill.skill.name },
              },
            },
          })),
        },
        interests: {
          create: interests.map((interest) => ({
            name: interest.name,
          })),
        },
        groups: {
          create: groups.map((group) => ({
            name: group.name,
          })),
        },
      },
    });

    console.log(`Created employee with email: ${newEmployee.email}`);
  }

  console.log("Done seeding database.");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
