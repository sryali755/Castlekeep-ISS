import ExcelJS from 'exceljs';
import { Offer, TestCase, TestPlanSummary } from './types';

export class ExcelGenerator {
  static generateWorkbook(
    offers: Offer[],
    positiveTests: TestCase[],
    negativeTests: TestCase[],
    summary: TestPlanSummary
  ): Buffer {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Tests');

    // Combine all tests
    const allTests = [...positiveTests, ...negativeTests];

    // Create header row
    const headers = [
      'Test ID',
      'Test Type',
      'Offer ID',
      'Offer Name',
      'Description',
      'Customer Status',
      'Customer Type',
      'Customer Tags',
      'Sales Channel',
      'Division',
      'Tenure Days',
      'Existing Services',
      'Speed Tier',
      'Expected Result',
    ];

    // Add header row with styling
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // Dark blue
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text
      };
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    });

    // Add data rows with color coding
    allTests.forEach((test) => {
      const row = worksheet.addRow([
        test.test_id,
        test.test_type,
        test.offer_id,
        test.offer_name,
        test.description || '',
        test.customer_status || '',
        test.customer_type || '',
        test.customer_tags || '',
        test.sales_channel || '',
        test.division || '',
        test.tenure_days || '',
        test.existing_services || '',
        test.speed_tier || '',
        test.expected_result || '',
      ]);

      const bgColor = test.test_type === 'Positive'
        ? 'FFC6EFCE' // Green for positive
        : 'FFFFC7CE'; // Pink/Red for negative

      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor },
        };
        cell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
      });
    });

    // Set column widths
    const colWidths = [12, 12, 15, 25, 30, 18, 15, 18, 18, 20, 15, 18, 12, 18];
    worksheet.columns = colWidths.map((w) => ({ width: w }));

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Return buffer synchronously
    const buffer = workbook.xlsx.writeBuffer();
    if (buffer instanceof Promise) {
      return Buffer.from([]);
    }
    return buffer as Buffer;
  }

  static async generateWorkbookAsync(
    offers: Offer[],
    positiveTests: TestCase[],
    negativeTests: TestCase[],
    summary: TestPlanSummary
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Tests');

    // Combine all tests
    const allTests = [...positiveTests, ...negativeTests];

    // Create header row
    const headers = [
      'Test ID',
      'Test Type',
      'Offer ID',
      'Offer Name',
      'Description',
      'Customer Status',
      'Customer Type',
      'Customer Tags',
      'Sales Channel',
      'Division',
      'Tenure Days',
      'Existing Services',
      'Speed Tier',
      'Expected Result',
    ];

    // Add header row with styling
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // Dark blue
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text
      };
      cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    });

    // Add data rows with color coding
    allTests.forEach((test) => {
      const row = worksheet.addRow([
        test.test_id,
        test.test_type,
        test.offer_id,
        test.offer_name,
        test.description || '',
        test.customer_status || '',
        test.customer_type || '',
        test.customer_tags || '',
        test.sales_channel || '',
        test.division || '',
        test.tenure_days || '',
        test.existing_services || '',
        test.speed_tier || '',
        test.expected_result || '',
      ]);

      const bgColor = test.test_type === 'Positive'
        ? 'FFC6EFCE' // Green for positive
        : 'FFFFC7CE'; // Pink/Red for negative

      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor },
        };
        cell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
      });
    });

    // Set column widths
    const colWidths = [12, 12, 15, 25, 30, 18, 15, 18, 18, 20, 15, 18, 12, 18];
    worksheet.columns = colWidths.map((w) => ({ width: w }));

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Return buffer
    return await workbook.xlsx.writeBuffer();
  }

  private static formatTestData(tests: TestCase[]): string[][] {
    const data = [
      [
        'Test ID',
        'Test Type',
        'Offer ID',
        'Offer Name',
        'Description',
        'Customer Status',
        'Customer Type',
        'Customer Tags',
        'Sales Channel',
        'Division',
        'Tenure Days',
        'Existing Services',
        'Speed Tier',
        'Expected Result',
      ],
    ];

    tests.forEach((test) => {
      data.push([
        test.test_id,
        test.test_type,
        test.offer_id,
        test.offer_name,
        test.description || '',
        test.customer_status || '',
        test.customer_type || '',
        test.customer_tags || '',
        test.sales_channel || '',
        test.division || '',
        test.tenure_days || '',
        test.existing_services || '',
        test.speed_tier || '',
        test.expected_result || '',
      ]);
    });

    return data;
  }

  static formatTestDataWithColors(tests: TestCase[]): string[][] {
    return this.formatTestData(tests);
  }
}
