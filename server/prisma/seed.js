import { employees } from "./data.js";
import prisma from "./client.js";

async function seed() {
  console.log("Seeding database...");

  try {
    await prisma.$transaction(async (prisma) => {
      const promises = employees.map(async (employee) => {
        const { skills, interests, groups, ...employeeData } = employee;

        const existingEmployee = await prisma.employee.findUnique({
          where: { email: employeeData.email },
        });

        if (existingEmployee) {
          console.log(
            `Employee with email: ${employeeData.email} already exists. Skipping...`
          );
          return;
        }

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
              connectOrCreate: interests.map((interest) => ({
                where: { name: interest.name },
                create: {
                  name: interest.name,
                  tags: {
                    connectOrCreate: interest.tags.map((tag) => ({
                      where: { name: tag.name },
                      create: { name: tag.name },
                    })),
                  },
                },
              })),
            },
            groups: {
              connectOrCreate: groups.map((group) => ({
                where: { name: group.name },
                create: {
                  name: group.name,
                  tags: {
                    connectOrCreate: group.tags.map((tag) => ({
                      where: { name: tag.name },
                      create: { name: tag.name },
                    })),
                  },
                },
              })),
            },
          },
        });

        console.log(`Created employee with email: ${newEmployee.email}`);
      });
      await Promise.all(promises);
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log("Done seeding database.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
