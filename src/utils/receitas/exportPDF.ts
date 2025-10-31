// utils/exportPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReceitaProps } from ".";
import { formatDate } from "../despesas/formatDate";
import { formatCurrency } from "../formatNumber";

export function exportTablePDF(receitas: ReceitaProps[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("GestãoDev - Lista de Rceitas", 14, 22);

  const tableColumn = ["Categoria", "Descrição da Despesa", "Valor", "Metódo de Pagamento","Estado"];
  const tableRows: any[] = [];

  receitas.forEach(receita => {
    tableRows.push([
        `${receita.categoria}`,
        receita.descricao,
        formatCurrency(Number(receita.valor)),
        receita.metodoPagamento,
        receita.estado,
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

  // --- FOOTER PADRÃO (para todas as páginas) ---
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

    // (Opcional) Adicionar logotipo no topo — exemplo:
    // const logo = "data:image/png;base64,..."; // seu logo em Base64
    // doc.addImage(logo, "PNG", 170, 10, 25, 10);

  doc.save("receitas.pdf");
}

export function exportReceitaPDF(receita: ReceitaProps) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalhes da receita: ${receita.descricao}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Valor da receita: ${formatCurrency(Number(receita.valor))}`, 14, 50);
    doc.text(`Estado da despesa: ${receita.estado}`, 14, 60);
    doc.text(`Metodo de pagamento: ${receita.metodoPagamento}`, 14, 70);
    doc.text(`Data de crédito: ${formatDate(receita.data)}`, 14, 80);
    doc.text(`Observações: ${receita.observacoes}`, 14, 90);
    doc.text(`Criado por: ${receita.criadoPor.nome}`, 14, 100);
    doc.text(`Criado em: ${formatDate(receita.criadoEm)}`, 14, 110);

    
  // --- FOOTER PADRÃO (para todas as páginas) ---
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

  // (Opcional) Adicionar logotipo no topo — exemplo:
  // const logo = "data:image/png;base64,..."; // seu logo em Base64
  // doc.addImage(logo, "PNG", 170, 10, 25, 10);
 

  doc.save(`Detalhes_da_receita_${receita.descricao}.pdf`);
}
