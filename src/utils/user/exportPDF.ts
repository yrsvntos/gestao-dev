// utils/exportPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { UserProps } from ".";
import { formatDate } from "./formatDate";

export function exportTablePDF(users: UserProps[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("GestãoDev - Lista de Colaboradores", 14, 22);

  const tableColumn = ["Nome", "Email", "Telefone", "Função", "Departamento", "Estado"];
  const tableRows: any[] = [];

  users.forEach(user => {
    tableRows.push([
      `${user.nome} ${user.apelido || ""}`,
      user.email,
      user.telefone || "",
      user.funcao || "",
      user.departamento || "",
      user.estado || "",
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    headStyles: {
        fillColor: [0, 0, 0], // bg-zinc-800 escuro
        textColor: [255, 255, 255], // branco
        fontStyle: "normal",
        halign: "center",
        lineWidth: 0.2,
        lineColor: [75, 85, 99], // cor da borda do cabeçalho
    }, 
    bodyStyles: {
        fillColor: [255, 255, 255], // branco
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [107, 114, 128], // borda das células (cinza)
    },
  });

  doc.save("colaboradores.pdf");
}

export function exportUserPDF(user: UserProps) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Ficha do Colaborador - ${user.nome} ${user.apelido}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Nome: ${user.nome} ${user.apelido || ""}`, 14, 40);
  doc.text(`Email: ${user.email}`, 14, 50);
  doc.text(`Telefone: ${user.telefone || ""}`, 14, 60);
  doc.text(`Função: ${user.funcao || ""}`, 14, 70);
  doc.text(`Departamento: ${user.departamento || ""}`, 14, 80);
  doc.text(`Contrato: ${user.contrato || ""}`, 14, 90);
  doc.text(`Género: ${user.genero || ""}`, 14, 100);
  doc.text(`Estado: ${user.estado || ""}`, 14, 110);
  doc.text(`Data Nascimento: ${formatDate(user.dataNascimento)}`, 14, 120);
  doc.text(`Morada: ${user.morada || ""}`, 14, 130);

  doc.save(`${user.nome}_ficha.pdf`);
}
