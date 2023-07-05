import { employees } from "./data.ts";
import prisma from "./client.ts";

async function seed() {
  console.log("Seeding database...");

  try {
    await prisma.$transaction(async (prisma: any) => {
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
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            onboardee: employeeData.onboardee,
            team: employeeData.team,
            role: employeeData.role,
            level: employeeData.level as any,
            status: employeeData.status as any,
            picture: employeeData.picture,
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
