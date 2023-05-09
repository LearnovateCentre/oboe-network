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
        interests: true,
        groups: true,
      },
    });
    res.status(200).json(employee);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
