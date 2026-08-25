import prisma from "../config/prisma.js";

export async function createCategory(data) {
  return prisma.category.create({
    data,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
