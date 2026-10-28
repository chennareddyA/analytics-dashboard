export type ExportColumn<T> = {
  header: string
  value: (row: T) => string | number
  width?: number
  format?: string
}

// Builds an .xlsx file in the browser and downloads it.
// Only the rows passed in are exported, so filters and sorting are respected.
export async function exportToExcel<T>(rows: T[], columns: ExportColumn<T>[], fileName: string) {
  // Load the Excel library only when someone actually exports
  const { default: writeXlsxFile } = await import('write-excel-file/browser')

  const header = columns.map((c) => ({ value: c.header, fontWeight: 'bold' as const }))
  const body = rows.map((row) =>
    columns.map((c) => {
      const value = c.value(row)
      return c.format && typeof value === 'number' ? { value, format: c.format } : value
    }),
  )

  await writeXlsxFile([header, ...body], {
    sheet: 'Data',
    stickyRowsCount: 1,
    columns: columns.map((c) => ({ width: c.width ?? 16 })),
  }).toFile(fileName)
}
