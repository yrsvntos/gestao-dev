// utils/exportPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ColaboradorProps } from ".";

export function exportTablePDF(users: ColaboradorProps[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("GestãoDev - Lista de Usuários", 14, 22);

  const tableColumn = ["Nome", "Email", "Nível de acesso"];
  const tableRows: any[] = [];

  users.forEach(user => {
    tableRows.push([
      `${user.name || ""}`,
      user.email,
      user.role || "",
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

  const totalPagesExp = "{total_pages_count_string}";
  const pageCount = (doc as any).getNumberOfPages();


  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    const now = new Date();
    const dataHora =
      now.toLocaleDateString("pt-PT") +
      " " +
      now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

    // Linha separadora acima do footer
    doc.setDrawColor(180);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFontSize(9);
    doc.setTextColor(120);

    // Data e hora (esquerda)
    doc.text(`Gerado em: ${dataHora}`, 14, pageHeight - 10);

    // Texto central
    doc.text(
      "Processado por GestãoDev - Seu Sistema Administrativo",
      pageWidth / 1.87,
      pageHeight - 10,
      { align: "center" }
    );

    // Número da página (direita)
    doc.text(
      `Página ${i} de ${totalPagesExp}`,
      pageWidth - -20,
      pageHeight - 10,
      { align: "right" }
    );
  }

    // Atualiza o total de páginas
    doc.putTotalPages(totalPagesExp);


  doc.save("lista_de_usuarios.pdf");
}

export function exportUserPDF(user: ColaboradorProps) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Ficha do Usuário - ${user.name}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Nome: ${user.name ||  ""}`, 14, 40);
  doc.text(`Email: ${user.email}`, 14, 50);
  doc.text(`Nível de acesso: ${user.role || ""}`, 14, 60);


  const totalPagesExp = "{total_pages_count_string}";
  const pageCount = (doc as any).getNumberOfPages();


  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    const now = new Date();
    const dataHora =
      now.toLocaleDateString("pt-PT") +
      " " +
      now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

    // Linha separadora acima do footer
    doc.setDrawColor(180);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFontSize(9);
    doc.setTextColor(120);

    // Data e hora (esquerda)
    doc.text(`Gerado em: ${dataHora}`, 14, pageHeight - 10);

    // Texto central
    doc.text(
      "Processado por GestãoDev - Seu Sistema Administrativo",
      pageWidth / 1.87,
      pageHeight - 10,
      { align: "center" }
    );

    // Número da página (direita)
    doc.text(
      `Página ${i} de ${totalPagesExp}`,
      pageWidth - -20,
      pageHeight - 10,
      { align: "right" }
    );
  }

    // Atualiza o total de páginas
    doc.putTotalPages(totalPagesExp);


  doc.save(`${user.name}_ficha.pdf`);
}
