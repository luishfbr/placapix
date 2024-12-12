"use client ";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatePDF } from "@/lib/create-pdf";
import type { Placa } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface PageToVizuProps {
  values: Placa;
  executeFetch: () => void;
}

export default function PageToVizu({ values, executeFetch }: PageToVizuProps) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 6;

  const allPlates = values.fields.flatMap((field) =>
    Array.from({ length: field.qtd }).map(() => ({
      imgUrl: field.imgUrl || "",
      name: field.name || "Nome do Beneficiado",
      key: field.key || "Chave Pix",
    }))
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const platesToShow = allPlates.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allPlates.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleUpdate = () => {
    executeFetch();
  };

  const handleCreatePdf = () => {
    CreatePDF(values, handleUpdate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veja como ficará a sua placa</CardTitle>
        <CardDescription>
          Verifique ao lado os dados inseridos. Página {currentPage + 1} de{" "}
          {totalPages}.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-[450px] h-[650px] bg-white grid grid-cols-2 gap-4 justify-around py-4">
        {platesToShow.map((plate, index) => (
          <div
            key={index}
            className="aspect-square border border-black flex flex-col py-2 items-center justify-center"
          >
            <Image src={plate.imgUrl} alt="Plate" width={145} height={145} />
            <div className="flex flex-col text-center">
              <span className="text-[10px] text-black">{plate.name}</span>
              <span className="text-[10px] text-black">{plate.key}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-row gap-6 justify-center items-center mt-6">
        <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
          <ArrowLeft />
        </Button>
        <Button
          onClick={() => handleCreatePdf()}
          type="button"
          className="w-full"
        >
          Imprimir
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
