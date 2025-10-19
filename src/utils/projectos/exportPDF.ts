// utils/exportPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProjectosProps } from ".";
import { formatDate } from "../user/formatDate";
import { formatCurrency } from "../formatNumber";

export function exportTablePDF(projectos: ProjectosProps[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("GestãoDev - Lista de Projectos", 14, 22);

  const tableColumn = ["Nome do Projecto", "Responsável", "Departamento", "Cliente", "Início", "Fim Previsto", "Orçamento", "Estado"];
  const tableRows: any[] = [];

  projectos.forEach(projecto => {
    tableRows.push([
      `${projecto.nome}`,
      projecto.responsavel,
      projecto.departamento,
      projecto.clienteId,
      formatDate(projecto.dataInicio),
      formatDate(projecto.dataFimPrevista),
      formatCurrency(projecto.valorOrcamento),
      projecto.status,
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

  doc.save("projectos.pdf");
}

export function exportProjectoPDF(projecto: ProjectosProps) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalhes do Projecto: ${projecto.nome} - ${projecto.clienteId}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${projecto.clienteId}`, 14, 40);
    doc.text(`Descrição do projecto: ${projecto.descricao}`, 14, 50);
    doc.text(`Referência do projecto: ${projecto.referencia}`, 14, 60);
    doc.text(`Responsável pelo projecto: ${projecto.responsavel}`, 14, 70);
    doc.text(`Departamento Responsável pelo projecto: ${projecto.departamento}`, 14, 80);
    doc.text(`Data de início do projecto: ${formatDate(projecto.dataInicio)}`, 14, 90);
    doc.text(`Data de fim prevista do projecto: ${formatDate(projecto.dataFimPrevista)}`, 14, 100);
    doc.text(`Data de fim real do projecto: ${formatDate(projecto.dataFimReal) || 'Não definida'}`, 14, 110);
    doc.text(`Estado do projecto: ${projecto.status}`, 14, 120);
    doc.text(`Valor do orçamento: ${formatCurrency(projecto.valorOrcamento)}`, 14, 130);
    doc.text(`Valor das despesas: ${formatCurrency(projecto.despesas)}`, 14, 140);
    doc.text(`Valor das receitas: ${formatCurrency(projecto.receitas)}`, 14, 150);

    
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
 

  doc.save(`Detalhes_do_projecto_${projecto.nome}.pdf`);
}
