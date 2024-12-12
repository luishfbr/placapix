"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { List } from "lucide-react";
import React from "react";
import type { Placas } from "../page";
import { PDFDocument } from "pdf-lib";

interface Props {
  placas: Placas[];
}

export function HistoricoDePlacas({ placas }: Props) {
  const handleDownload = async (placa: string) => {
    try {
      // Converter a string Base64 para um Uint8Array
      const byteArray = Uint8Array.from(atob(placa), (char) =>
        char.charCodeAt(0)
      );

      // Carregar o documento PDF com o pdf-lib
      const pdfDoc = await PDFDocument.load(byteArray);

      // Salvar o PDF em um novo Blob
      const pdfBlob = await pdfDoc.save();

      // Criar URL para o Blob
      const pdfUrl = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      // Criar o link de download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `placa_${new Date().toISOString()}.pdf`;
      link.click();

      // Revogar o URL após o uso para liberar recursos
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <List /> Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {placas.length > 0 ? (
          placas.map((placa) => (
            <div key={placa.placa}>
              <Button onClick={() => handleDownload(placa.placa)}>
                {placa.createdAt.toLocaleString()}
              </Button>
            </div>
          ))
        ) : (
          <span>Não encontramos nenhuma placa...</span>
        )}
      </DialogContent>
    </Dialog>
  );
}
