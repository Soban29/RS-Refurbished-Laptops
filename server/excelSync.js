import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXCEL_DB_FILE = path.join(DATA_DIR, 'rs_refurbished_database.xlsx');

/**
 * Creates or updates rs_refurbished_database.xlsx side-by-side with rs_refurbished_database.json
 * @param {Object} db - The database object containing laptops, users, orders, inquiries, serviceTickets, accessories
 */
export async function syncDatabaseToExcel(db) {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'RS Refurbished Laptops & Services';
    workbook.lastModifiedBy = 'Admin Database System';
    workbook.created = new Date();
    workbook.modified = new Date();

    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate 800
    };
    const headerFont = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    const headerAlignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };

    // Helper to format a worksheet
    const formatWorksheet = (ws, columns, rows) => {
      ws.columns = columns;
      ws.getRow(1).height = 26;
      ws.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = headerAlignment;
      });

      rows.forEach((row) => {
        const addedRow = ws.addRow(row);
        addedRow.height = 20;
        addedRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }
          };
        });
      });

      // Auto-fit column widths
      ws.columns.forEach((col) => {
        let maxLength = 12;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const val = cell.value ? String(cell.value) : '';
          if (val.length > maxLength) {
            maxLength = Math.min(val.length + 3, 40);
          }
        });
        col.width = maxLength;
      });
    };

    // 1. Laptops Inventory Sheet
    const laptops = Array.isArray(db.laptops) ? db.laptops : [];
    const wsLaptops = workbook.addWorksheet('Laptops Inventory', { properties: { tabColor: { argb: 'FF2563EB' } } });
    formatWorksheet(
      wsLaptops,
      [
        { header: 'ID', key: 'id' },
        { header: 'Brand', key: 'brand' },
        { header: 'Model', key: 'model' },
        { header: 'Laptop Name', key: 'name' },
        { header: 'Price (₹)', key: 'price' },
        { header: 'Original (₹)', key: 'originalPrice' },
        { header: 'Condition Grade', key: 'conditionGrade' },
        { header: 'Processor', key: 'processor' },
        { header: 'RAM', key: 'ram' },
        { header: 'Storage', key: 'storage' },
        { header: 'Display', key: 'display' },
        { header: 'Stock Count', key: 'stockCount' },
        { header: 'Status', key: 'inStock' },
        { header: 'Warranty', key: 'warranty' }
      ],
      laptops.map(l => ({
        id: l.id || '',
        brand: l.brand || '',
        model: l.model || '',
        name: l.name || '',
        price: l.price || 0,
        originalPrice: l.originalPrice || 0,
        conditionGrade: l.conditionGrade || 'Grade A+',
        processor: l.processor || '',
        ram: l.ram || '',
        storage: l.storage || '',
        display: l.display || '',
        stockCount: l.stockCount || 0,
        inStock: l.inStock ? 'In Stock' : 'Out of Stock',
        warranty: l.warrantyMonths ? `${l.warrantyMonths}-Month Testing Warranty` : '1-Month Testing Warranty'
      }))
    );

    // 2. Accessories & Upgrades Sheet
    const accessories = Array.isArray(db.accessories) ? db.accessories : [];
    const wsAccessories = workbook.addWorksheet('Accessories & Upgrades', { properties: { tabColor: { argb: 'FF10B981' } } });
    formatWorksheet(
      wsAccessories,
      [
        { header: 'ID', key: 'id' },
        { header: 'Category', key: 'category' },
        { header: 'Accessory Name', key: 'name' },
        { header: 'Price (₹)', key: 'price' },
        { header: 'Original (₹)', key: 'originalPrice' },
        { header: 'Compatibility', key: 'compatibility' },
        { header: 'Stock Count', key: 'stockCount' },
        { header: 'Status', key: 'inStock' },
        { header: 'Warranty', key: 'warranty' }
      ],
      accessories.map(a => ({
        id: a.id || '',
        category: a.category || '',
        name: a.name || '',
        price: a.price || 0,
        originalPrice: a.originalPrice || 0,
        compatibility: a.compatibility || 'Universal',
        stockCount: a.stockCount || 0,
        inStock: a.inStock !== false ? 'In Stock' : 'Out of Stock',
        warranty: a.warranty || '6-Month RS Warranty'
      }))
    );

    // 3. Registered Users Sheet
    const users = Array.isArray(db.users) ? db.users : [];
    const wsUsers = workbook.addWorksheet('Users & Customers', { properties: { tabColor: { argb: 'FF6366F1' } } });
    formatWorksheet(
      wsUsers,
      [
        { header: 'User ID', key: 'id' },
        { header: 'Full Name', key: 'name' },
        { header: 'Email Address', key: 'email' },
        { header: 'Phone Number', key: 'phone' },
        { header: 'Role', key: 'role' },
        { header: 'Provider', key: 'provider' },
        { header: 'Registered Date', key: 'createdAt' },
        { header: 'Last Login', key: 'lastLogin' }
      ],
      users.map(u => ({
        id: u.id || '',
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        role: u.role || 'customer',
        provider: u.provider || 'email',
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : '',
        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : ''
      }))
    );

    // 4. Orders & Sales Sheet
    const orders = Array.isArray(db.orders) ? db.orders : [];
    const wsOrders = workbook.addWorksheet('Orders & Sales', { properties: { tabColor: { argb: 'FFF59E0B' } } });
    formatWorksheet(
      wsOrders,
      [
        { header: 'Order ID', key: 'id' },
        { header: 'Customer Name', key: 'customerName' },
        { header: 'Phone', key: 'phone' },
        { header: 'Email', key: 'email' },
        { header: 'Total Amount (₹)', key: 'amount' },
        { header: 'Payment Method', key: 'paymentMethod' },
        { header: 'Order Status', key: 'status' },
        { header: 'Order Date', key: 'date' },
        { header: 'Items Purchased', key: 'items' }
      ],
      orders.map(o => ({
        id: o.id || '',
        customerName: o.customerName || (o.customer && o.customer.name) || '',
        phone: o.phone || (o.customer && o.customer.phone) || '',
        email: o.email || (o.customer && o.customer.email) || '',
        amount: o.totalAmount || o.amount || 0,
        paymentMethod: o.paymentMethod || 'UPI / COD',
        status: o.status || 'Pending',
        date: o.date ? new Date(o.date).toLocaleString('en-IN') : '',
        items: Array.isArray(o.items) ? o.items.map(it => `${it.name || it.model} (x${it.quantity || 1})`).join('; ') : ''
      }))
    );

    // 5. Quote Inquiries Sheet
    const inquiries = Array.isArray(db.inquiries) ? db.inquiries : [];
    const wsInquiries = workbook.addWorksheet('Quote Inquiries', { properties: { tabColor: { argb: 'FF06B6D4' } } });
    formatWorksheet(
      wsInquiries,
      [
        { header: 'Inquiry ID', key: 'id' },
        { header: 'Customer Name', key: 'customerName' },
        { header: 'Company Name', key: 'companyName' },
        { header: 'Phone Number', key: 'phone' },
        { header: 'Client Type', key: 'clientType' },
        { header: 'Requested Model', key: 'laptopModel' },
        { header: 'Service Type', key: 'serviceType' },
        { header: 'Budget Per Unit', key: 'budgetPerUnit' },
        { header: 'Status', key: 'status' },
        { header: 'Date', key: 'date' },
        { header: 'Notes', key: 'notes' }
      ],
      inquiries.map(inq => ({
        id: inq.id || '',
        customerName: inq.customerName || '',
        companyName: inq.companyName || '',
        phone: inq.phone || '',
        clientType: inq.clientType || 'Individual',
        laptopModel: inq.laptopModel || '',
        serviceType: inq.serviceType || '',
        budgetPerUnit: inq.budgetPerUnit || '',
        status: inq.status || 'Pending',
        date: inq.date || '',
        notes: inq.notes || ''
      }))
    );

    // 6. Service Tickets Sheet
    const serviceTickets = Array.isArray(db.serviceTickets) ? db.serviceTickets : [];
    const wsServices = workbook.addWorksheet('Service Tickets', { properties: { tabColor: { argb: 'FFEC4899' } } });
    formatWorksheet(
      wsServices,
      [
        { header: 'Ticket ID', key: 'id' },
        { header: 'Customer Name', key: 'customerName' },
        { header: 'Phone Number', key: 'phone' },
        { header: 'Laptop Brand & Model', key: 'laptopBrandModel' },
        { header: 'Issue Reported', key: 'issueType' },
        { header: 'Pickup Service', key: 'pickupRequired' },
        { header: 'Address', key: 'address' },
        { header: 'Status', key: 'status' },
        { header: 'Date', key: 'date' }
      ],
      serviceTickets.map(t => ({
        id: t.id || '',
        customerName: t.customerName || '',
        phone: t.phone || '',
        laptopBrandModel: t.laptopBrandModel || '',
        issueType: t.issueType || '',
        pickupRequired: t.pickupRequired ? 'Yes (Doorstep)' : 'No (Store Walk-in)',
        address: t.address || 'In-store',
        status: t.status || 'Pending Inspection',
        date: t.date || ''
      }))
    );

    // Write file to disk
    await workbook.xlsx.writeFile(EXCEL_DB_FILE);
    return EXCEL_DB_FILE;
  } catch (err) {
    console.error('[Excel Sync Error]:', err.message);
    return null;
  }
}
