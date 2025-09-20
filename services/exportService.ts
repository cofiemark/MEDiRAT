interface CsvExportOptions<T> {
    data: T[];
    headers: { key: keyof T; label: string }[];
    filename: string;
}

const convertToCSV = <T extends object>(data: T[], headers: { key: keyof T; label: string }[]): string => {
    const headerRow = headers.map(h => `"${h.label}"`).join(',');
    
    const dataRows = data.map(row => {
        return headers.map(header => {
            const value = row[header.key];
            let formattedValue = '';

            if (value instanceof Date) {
                formattedValue = `"${value.toLocaleString()}"`;
            } else if (Array.isArray(value)) {
                formattedValue = `"${value.join('; ')}"`;
            } else if (typeof value === 'string') {
                // Escape double quotes by doubling them
                formattedValue = `"${value.replace(/"/g, '""')}"`;
            } else if (value !== null && value !== undefined) {
                formattedValue = String(value);
            }
            return formattedValue;
        }).join(',');
    }).join('\n');

    return `${headerRow}\n${dataRows}`;
};

export const exportToCSV = <T extends object>({ data, headers, filename }: CsvExportOptions<T>): void => {
    if (!data || data.length === 0) {
        // In a real app, you might show a more integrated notification
        alert('No data available to export.');
        return;
    }

    const csvString = convertToCSV(data, headers);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Feature detection for browser compatibility
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
