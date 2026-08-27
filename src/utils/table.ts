import { table } from "table";
import chalk from "chalk";

export function renderTable(
  headers: string[],
  rows: (string | number)[][],
  options?: { title?: string }
): string {
  const data = [headers, ...rows];
  return table(data, {
    header: {
      alignment: "center",
      content: options?.title ?? headers.join(" | "),
    },
    columns: {
      0: { alignment: "left" },
    },
    drawHorizontalLine: (index, size) => {
      if (index === 0) return true;
      if (index === 1) return true;
      if (index === size) return true;
      return false;
    },
  });
}

export function renderKeyValueTable(
  rows: [string, string][],
  title?: string
): string {
  const data = title ? [[chalk.bold(title), ""]] : [];
  data.push(...rows.map(([k, v]) => [chalk.dim(k), v]));
  
  return table(data, {
    columns: {
      0: { alignment: "right", width: 20 },
      1: { alignment: "left", width: 60 },
    },
    drawHorizontalLine: () => false,
  });
}