"use client";

import * as XLSX from "xlsx";

type ExcelExport = {
  filename: string;
  sheetName: string;
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  amountColumns: number[];
  summary?: Array<[string, number]>;
};

export function downloadExcel({
  filename,
  sheetName,
  title,
  columns,
  rows,
  amountColumns,
  summary = [],
}: ExcelExport) {
  const worksheet = XLSX.utils.aoa_to_sheet([
    [title],
    ...summary.map(([label, amount]) => [label, amount]),
    [],
    columns,
    ...rows,
  ]);
  const headerRow = summary.length + 4;
  const lastDataRow = headerRow + rows.length;
  const totalRow = lastDataRow + 1;
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(0, columns.length - 1) } },
  ];
  worksheet["!cols"] = columns.map((column, index) => ({
    wch: Math.max(
      14,
      Math.min(
        42,
        Math.max(
          column.length + 4,
          ...rows.map((row) => String(row[index] ?? "").length + 2),
        ),
      ),
    ),
  }));
  worksheet["!rows"] = [{ hpt: 24 }];
  worksheet["A1"].s = {
    font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "24361E" } },
    alignment: { horizontal: "left" },
  };
  for (let column = 0; column < columns.length; column += 1) {
    const cell = XLSX.utils.encode_cell({ r: headerRow - 1, c: column });
    worksheet[cell].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "6F9556" } },
      alignment: { horizontal: "center" },
    };
  }
  amountColumns.forEach((column) => {
    for (let row = headerRow + 1; row <= lastDataRow; row += 1) {
      const cell = XLSX.utils.encode_cell({ r: row - 1, c: column });
      if (worksheet[cell]) worksheet[cell].z = '#,##0 "₫"';
    }
    const totalCell = XLSX.utils.encode_cell({ r: totalRow - 1, c: column });
    worksheet[totalCell] = {
      t: "n",
      f: `SUM(${XLSX.utils.encode_col(column)}${headerRow + 1}:${XLSX.utils.encode_col(column)}${lastDataRow})`,
      z: '#,##0 "₫"',
      s: { font: { bold: true }, fill: { fgColor: { rgb: "EAF2E6" } } },
    };
  });
  worksheet[`A${totalRow}`] = {
    t: "s",
    v: "TỔNG CỘNG",
    s: { font: { bold: true }, fill: { fgColor: { rgb: "EAF2E6" } } },
  };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename, { compression: true });
}
