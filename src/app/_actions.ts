"use server";

import { prisma } from "@/services/prisma";

export const SavePdfBase64 = async (pdf: string) => {
  const placaCriada = await prisma.placasCriadas.create({
    data: {
      placa: pdf,
    },
  });
  return placaCriada;
};

export const GetPlacasCriadas = async () => {
  const placasCriadas = await prisma.placasCriadas.findMany();
  return placasCriadas;
};
