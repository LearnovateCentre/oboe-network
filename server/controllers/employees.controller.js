import prisma from "../prisma/client.js";

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        interests: {
          include: {
            tags: true,
          },
        },
        groups: {
          include: {
            tags: true,
          },
        },
      },
    });

    // Extract the employee's interests tags
    const interestTags = employee.interests
      .map((interest) => interest.tags.map((tag) => tag.name))
      .flat();

    // Fetch recommended groups based on employee interests tags
    const recommendedGroups = await prisma.group.findMany({
      where: {
        tags: {
          some: {
            name: {
              in: interestTags,
            },
          },
        },
        employees: {
          none: {
            id: id,
          },
        },
      },
    });

    employee.recommendedGroups = recommendedGroups;

    res.status(200).json(employee);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        interests: {
          include: {
            tags: true,
          },
        },
        groups: {
          include: {
            tags: true,
          },
        },
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { groupId } = req.body;

  try {
    const employee = await prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        groups: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Group added to employee successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
