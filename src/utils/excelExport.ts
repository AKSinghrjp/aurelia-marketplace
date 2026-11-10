import * as XLSX from 'xlsx';
import { Order } from '../types';

export interface SalesReportRow {
  'Order / Lot Reference': string;
  'Sale Channel': 'Direct Store' | 'Auction Winner';
  'Date & Time': string;
  'Product / Lot Title': string;
  'Category': string;
  'Seller Firm': string;
  'Seller GSTIN': string;
  'Customer Name': string;
  'Customer Phone': string;
  'Delivery Address': string;
  'Quantity Sold': number;
  'Sale Amount (INR)': number;
  'Estimated GST (INR)': number;
  'Settlement Mechanism': string;
  'Status': string;
}

export const generateSalesReportData = (orders: Order[]): SalesReportRow[] => {
  const rows: SalesReportRow[] = [];

  orders.forEach((order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        const itemTotal = item.product.price * item.quantity;
        // Estimated GST portion (e.g. 5% or 18% standard curatorial bracket)
        const gstAmount = Math.round((itemTotal * 0.18) / 1.18);

        rows.push({
          'Order / Lot Reference': order.id,
          'Sale Channel': order.saleType || 'Direct Store',
          'Date & Time': new Date(order.createdAt).toLocaleString('en-IN'),
          'Product / Lot Title': item.product.title,
          'Category': item.product.category,
          'Seller Firm': item.product.sellerName || order.sellerName || 'Verified Merchant',
          'Seller GSTIN': item.product.sellerGst || order.sellerGst || 'N/A',
          'Customer Name': order.customerName,
          'Customer Phone': order.customerPhone,
          'Delivery Address': order.shippingAddress,
          'Quantity Sold': item.quantity,
          'Sale Amount (INR)': itemTotal,
          'Estimated GST (INR)': gstAmount,
          'Settlement Mechanism': order.paymentMethod,
          'Status': order.status,
        });
      });
    } else {
      // Fallback for orders without multiple items (e.g. single auction settlement)
      const gstAmount = Math.round((order.totalAmount * 0.18) / 1.18);
      rows.push({
        'Order / Lot Reference': order.id,
        'Sale Channel': order.saleType || 'Auction Winner',
        'Date & Time': new Date(order.createdAt).toLocaleString('en-IN'),
        'Product / Lot Title': 'Acquired Antique Lot',
        'Category': 'Antique',
        'Seller Firm': order.sellerName || 'Verified Merchant',
        'Seller GSTIN': order.sellerGst || 'N/A',
        'Customer Name': order.customerName,
        'Customer Phone': order.customerPhone,
        'Delivery Address': order.shippingAddress,
        'Quantity Sold': 1,
        'Sale Amount (INR)': order.totalAmount,
        'Estimated GST (INR)': gstAmount,
        'Settlement Mechanism': order.paymentMethod,
        'Status': order.status,
      });
    }
  });

  return rows;
};

/**
 * Downloads a genuine .xlsx Excel spreadsheet workbook directly to user's computer
 */
export const downloadExcelSalesReport = (orders: Order[], filenamePrefix = 'Aurelia_Sales_Report') => {
  const data = generateSalesReportData(orders);

  if (data.length === 0) {
    alert('No sales records available yet to export to Excel.');
    return;
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for beautiful readability in Excel
  worksheet['!cols'] = [
    { wch: 18 }, // Order ID
    { wch: 16 }, // Sale Channel
    { wch: 22 }, // Date & Time
    { wch: 38 }, // Product Title
    { wch: 14 }, // Category
    { wch: 26 }, // Seller Firm
    { wch: 18 }, // Seller GSTIN
    { wch: 22 }, // Customer Name
    { wch: 16 }, // Phone
    { wch: 40 }, // Address
    { wch: 14 }, // Quantity
    { wch: 18 }, // Sale Amount
    { wch: 18 }, // GST Amount
    { wch: 26 }, // Settlement Mechanism
    { wch: 14 }, // Status
  ];

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'All Sold Products');

  // Generate file name with current date
  const dateStr = new Date().toISOString().split('T')[0];
  const fullFilename = `${filenamePrefix}_${dateStr}.xlsx`;

  // Write file and trigger download
  XLSX.writeFile(workbook, fullFilename);
};

/**
 * Exports data as CSV as an additional format
 */
export const downloadCsvSalesReport = (orders: Order[], filenamePrefix = 'Aurelia_Sales_Report') => {
  const data = generateSalesReportData(orders);
  if (data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
