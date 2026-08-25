import prisma from "../config/prisma.js";

export async function createProduct(data) {
  const product = await prisma.product.create({
    data,
    include: {
      category: true,
    },
  });

  return product;
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  });
}
