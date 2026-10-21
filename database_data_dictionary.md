# RS Refurbished Laptops & Services — Database Documentation

**Database File**: [`data/rs_refurbished_database.json`](file:///c:/Users/DELL/.gemini/antigravity/scratch/rs-refurbished-laptops/data/rs_refurbished_database.json)  
**Total Tables / Collections**: **5** (`users`, `laptops`, `orders`, `inquiries`, `serviceTickets`)

---

# SECTION 1: DATA TABLES (SCHEMA SPECIFICATIONS)
*Format: Field Name | Datatype | Size | Constraints*

### 1. Table Name: `users`
| Field Name | Datatype | Size | Constraints |
|---|---|---|---|
| `id` | VARCHAR | 50 | PRIMARY KEY, NOT NULL |
| `name` | VARCHAR | 100 | NOT NULL |
| `email` | VARCHAR | 150 | UNIQUE, NOT NULL |
| `phone` | VARCHAR | 25 | NULL |
| `role` | VARCHAR | 20 | NOT NULL, DEFAULT 'customer' |
| `provider` | VARCHAR | 30 | NOT NULL, DEFAULT 'email' |
| `avatar` | VARCHAR | 500 | NULL |
| `createdAt` | TIMESTAMP | 30 | NOT NULL |
| `lastLogin` | TIMESTAMP | 30 | NULL |

---

### 2. Table Name: `laptops`
| Field Name | Datatype | Size | Constraints |
|---|---|---|---|
| `id` | VARCHAR | 50 | PRIMARY KEY, NOT NULL |
| `name` | VARCHAR | 150 | NOT NULL |
| `brand` | VARCHAR | 50 | NOT NULL |
| `model` | VARCHAR | 100 | NULL |
| `price` | DECIMAL | 10, 2 | NOT NULL, CHECK (price >= 0) |
| `originalPrice` | DECIMAL | 10, 2 | NULL |
| `category` | VARCHAR | 50 | NOT NULL |
| `targetAudience` | JSON / ARRAY | 255 | NULL |
| `conditionGrade` | VARCHAR | 50 | NOT NULL |
| `processor` | VARCHAR | 100 | NOT NULL |
| `processorFamily` | VARCHAR | 50 | NOT NULL |
| `ram` | VARCHAR | 50 | NOT NULL |
| `ramSize` | INT | 4 | NOT NULL, CHECK (ramSize > 0) |
| `storage` | VARCHAR | 50 | NOT NULL |
| `storageSize` | INT | 6 | NOT NULL, CHECK (storageSize > 0) |
| `display` | VARCHAR | 100 | NOT NULL |
| `screenSize` | DECIMAL | 4, 1 | NOT NULL |
| `gpu` | VARCHAR | 100 | NULL |
| `os` | VARCHAR | 50 | NOT NULL |
| `warrantyMonths` | INT | 3 | NOT NULL, DEFAULT 12 |
| `batteryHealth` | VARCHAR | 30 | NULL |
| `stockCount` | INT | 6 | NOT NULL, DEFAULT 0, CHECK (stockCount >= 0) |
| `inStock` | BOOLEAN | 1 | NOT NULL, DEFAULT true |
| `inspectionScore` | VARCHAR | 50 | NULL |
| `featured` | BOOLEAN | 1 | NOT NULL, DEFAULT false |
| `tags` | JSON / ARRAY | 255 | NULL |
| `image` | VARCHAR | 500 | NOT NULL |
| `description` | TEXT | 65535 | NULL |
| `specs` | JSON | 65535 | NULL |
| `createdAt` | TIMESTAMP | 30 | NOT NULL |
| `updatedAt` | TIMESTAMP | 30 | NOT NULL |

---

### 3. Table Name: `orders`
| Field Name | Datatype | Size | Constraints |
|---|---|---|---|
| `id` | VARCHAR | 50 | PRIMARY KEY, NOT NULL |
| `quoteNumber` | VARCHAR | 50 | NOT NULL |
| `date` | DATE | 10 | NOT NULL |
| `month` | VARCHAR | 10 | NULL |
| `customerName` | VARCHAR | 100 | NOT NULL |
| `customerPhone` | VARCHAR | 25 | NOT NULL |
| `customerEmail` | VARCHAR | 150 | NULL |
| `companyName` | VARCHAR | 150 | NULL |
| `companyPhone` | VARCHAR | 25 | NULL |
| `gstin` | VARCHAR | 15 | NULL |
| `items` | JSON / ARRAY | 65535 | NOT NULL |
| `quantity` | INT | 6 | NOT NULL, CHECK (quantity > 0) |
| `tier` | VARCHAR | 50 | NULL, DEFAULT 'Individual' |
| `totalAmount` | DECIMAL | 12, 2 | NOT NULL, CHECK (totalAmount >= 0) |
| `amountPaid` | DECIMAL | 12, 2 | NOT NULL, DEFAULT 0 |
| `paymentStatus` | VARCHAR | 30 | NOT NULL, DEFAULT 'Pending' |
| `paymentMode` | VARCHAR | 50 | NULL |
| `paymentRef` | VARCHAR | 100 | NULL |
| `status` | VARCHAR | 50 | NOT NULL, DEFAULT 'Payment Confirmed' |
| `notes` | TEXT | 65535 | NULL |
| `createdAt` | TIMESTAMP | 30 | NOT NULL |
| `updatedAt` | TIMESTAMP | 30 | NOT NULL |

---

### 4. Table Name: `inquiries`
| Field Name | Datatype | Size | Constraints |
|---|---|---|---|
| `id` | VARCHAR | 50 | PRIMARY KEY, NOT NULL |
| `date` | DATE | 10 | NOT NULL |
| `customerName` | VARCHAR | 100 | NOT NULL |
| `companyName` | VARCHAR | 150 | NULL |
| `clientType` | VARCHAR | 50 | NOT NULL, DEFAULT 'Corporate' |
| `email` | VARCHAR | 150 | NULL |
| `phone` | VARCHAR | 25 | NOT NULL |
| `laptopModel` | VARCHAR | 150 | NOT NULL |
| `quantity` | INT | 6 | NOT NULL, DEFAULT 1 |
| `budgetPerUnit` | VARCHAR | 50 | NULL |
| `serviceType` | VARCHAR | 100 | NULL |
| `status` | VARCHAR | 30 | NOT NULL, DEFAULT 'Pending' |
| `notes` | TEXT | 65535 | NULL |
| `createdAt` | TIMESTAMP | 30 | NOT NULL |
| `updatedAt` | TIMESTAMP | 30 | NOT NULL |

---

### 5. Table Name: `serviceTickets`
| Field Name | Datatype | Size | Constraints |
|---|---|---|---|
| `id` | VARCHAR | 50 | PRIMARY KEY, NOT NULL |
| `date` | DATE | 10 | NOT NULL |
| `customerName` | VARCHAR | 100 | NOT NULL |
| `phone` | VARCHAR | 25 | NOT NULL |
| `laptopBrandModel` | VARCHAR | 150 | NOT NULL |
| `issueType` | VARCHAR | 200 | NOT NULL |
| `serviceCategory` | VARCHAR | 100 | NULL |
| `estimatedCost` | VARCHAR | 50 | NULL |
| `status` | VARCHAR | 50 | NOT NULL, DEFAULT 'Pending Inspection' |
| `pickupRequired` | BOOLEAN | 1 | NOT NULL, DEFAULT false |
| `address` | VARCHAR | 255 | NULL |
| `createdAt` | TIMESTAMP | 30 | NOT NULL |
| `updatedAt` | TIMESTAMP | 30 | NOT NULL |

---

# SECTION 2: DATA DICTIONARY
*Format: Field Name | Datatype | Description | Table Name*

| Field Name | Datatype | Description | Table Name |
|---|---|---|---|
| `id` | VARCHAR | Unique identifier for registered user account | `users` |
| `name` | VARCHAR | Full legal name of user | `users` |
| `email` | VARCHAR | Unique user login email address | `users` |
| `phone` | VARCHAR | Mobile contact number with country code | `users` |
| `role` | VARCHAR | Authorization access role ('customer' or 'admin') | `users` |
| `provider` | VARCHAR | Sign-in method ('email', 'google', or 'owner_portal') | `users` |
| `avatar` | VARCHAR | Public URL to user profile avatar picture | `users` |
| `createdAt` | TIMESTAMP | Account registration ISO-8601 timestamp | `users` |
| `lastLogin` | TIMESTAMP | Timestamp of most recent user login | `users` |
| `id` | VARCHAR | Unique SKU product identifier for laptop | `laptops` |
| `name` | VARCHAR | Full title of laptop model | `laptops` |
| `brand` | VARCHAR | Manufacturer brand (Dell, Lenovo, Apple, HP, Asus) | `laptops` |
| `model` | VARCHAR | Hardware model or series number | `laptops` |
| `price` | DECIMAL | Current discounted sale price in INR (₹) | `laptops` |
| `originalPrice` | DECIMAL | Original brand-new retail MRP in INR (₹) | `laptops` |
| `category` | VARCHAR | Category (Business, Ultrabook, Creative & Professional, Workstation) | `laptops` |
| `targetAudience` | JSON / ARRAY | Recommended buyer segments (Individual, Corporate, Student) | `laptops` |
| `conditionGrade` | VARCHAR | Cosmetic and functional grade (Grade A+, Grade A) | `laptops` |
| `processor` | VARCHAR | Complete processor name, generation, and clock speed | `laptops` |
| `processorFamily` | VARCHAR | CPU grouping family for filtering (Intel Core i3/i5/i7, Apple Silicon) | `laptops` |
| `ram` | VARCHAR | Formatted RAM specification with upgrade expandability | `laptops` |
| `ramSize` | INT | Numeric RAM memory capacity in Gigabytes (GB) | `laptops` |
| `storage` | VARCHAR | Formatted drive specification and bus type (e.g., NVMe SSD) | `laptops` |
| `storageSize` | INT | Numeric SSD/HDD storage capacity in Gigabytes (GB) | `laptops` |
| `display` | VARCHAR | Screen panel specifications, anti-glare finish, and resolution | `laptops` |
| `screenSize` | DECIMAL | Diagonal display measurement in inches | `laptops` |
| `gpu` | VARCHAR | Integrated or dedicated graphics processor unit | `laptops` |
| `os` | VARCHAR | Preloaded genuine operating system license | `laptops` |
| `warrantyMonths` | INT | Hardware warranty protection period in months | `laptops` |
| `batteryHealth` | VARCHAR | Certified tested battery capacity percentage | `laptops` |
| `stockCount` | INT | Units physically available in warehouse inventory | `laptops` |
| `inStock` | BOOLEAN | Inventory availability flag (true if stockCount > 0) | `laptops` |
| `inspectionScore` | VARCHAR | Multi-point diagnostic test certification score | `laptops` |
| `featured` | BOOLEAN | Flag to display laptop in homepage hero showcase | `laptops` |
| `tags` | JSON / ARRAY | Promotional badges (e.g. Best Under 20k, Certified A+) | `laptops` |
| `image` | VARCHAR | Direct HTTPS image link for laptop display | `laptops` |
| `description` | TEXT | Detailed marketing overview and chassis description | `laptops` |
| `specs` | JSON | Hardware specifications object (weight, ports, camera, audio, TPM) | `laptops` |
| `createdAt` | TIMESTAMP | ISO-8601 record creation timestamp | `laptops` |
| `updatedAt` | TIMESTAMP | ISO-8601 record last updated timestamp | `laptops` |
| `id` | VARCHAR | Unique sales order tracking number | `orders` |
| `quoteNumber` | VARCHAR | Official quotation and invoice reference number | `orders` |
| `date` | DATE | Date of order placement (YYYY-MM-DD) | `orders` |
| `month` | VARCHAR | Accounting month index (YYYY-MM) | `orders` |
| `customerName` | VARCHAR | Name of buyer or company procurement officer | `orders` |
| `customerPhone` | VARCHAR | Contact telephone or WhatsApp number | `orders` |
| `customerEmail` | VARCHAR | Email address for digital invoice and receipt delivery | `orders` |
| `companyName` | VARCHAR | Registered corporate legal entity name | `orders` |
| `companyPhone` | VARCHAR | Corporate office telephone or landline | `orders` |
| `gstin` | VARCHAR | 15-character Goods and Services Tax Identification Number for 18% ITC | `orders` |
| `items` | JSON / ARRAY | Array of line items purchased with name, quantity, and unit price | `orders` |
| `quantity` | INT | Cumulative quantity count of all laptops ordered | `orders` |
| `tier` | VARCHAR | Customer procurement tier (Individual, Startup, Corporate) | `orders` |
| `totalAmount` | DECIMAL | Total gross invoice billing amount in INR (₹) | `orders` |
| `amountPaid` | DECIMAL | Payment collected to date in INR (₹) | `orders` |
| `paymentStatus` | VARCHAR | Payment collection status (Paid, Pending, Partial) | `orders` |
| `paymentMode` | VARCHAR | Transaction gateway or method (Online, UPI, NEFT/RTGS, Cash) | `orders` |
| `paymentRef` | VARCHAR | Transaction reference, UTR number, or cheque receipt ID | `orders` |
| `status` | VARCHAR | Order dispatch stage (Payment Confirmed, Dispatched, Delivered) | `orders` |
| `notes` | TEXT | Special delivery instructions or payment terms | `orders` |
| `createdAt` | TIMESTAMP | ISO-8601 creation timestamp | `orders` |
| `updatedAt` | TIMESTAMP | ISO-8601 last update timestamp | `orders` |
| `id` | VARCHAR | Unique sales quote inquiry reference number | `inquiries` |
| `date` | DATE | Date inquiry was submitted (YYYY-MM-DD) | `inquiries` |
| `customerName` | VARCHAR | Full name of requester | `inquiries` |
| `companyName` | VARCHAR | Business or enterprise organization name | `inquiries` |
| `clientType` | VARCHAR | Organization category (Corporate, Individual, SME) | `inquiries` |
| `email` | VARCHAR | Contact email for dispatching official quote PDF | `inquiries` |
| `phone` | VARCHAR | Direct WhatsApp/mobile number for quotation trigger | `inquiries` |
| `laptopModel` | VARCHAR | Laptop model or custom configuration requested | `inquiries` |
| `quantity` | INT | Required unit volume of laptops | `inquiries` |
| `budgetPerUnit` | VARCHAR | Buyer's expected budget per unit in INR (₹) | `inquiries` |
| `serviceType` | VARCHAR | Type of procurement (Bulk Purchase, Monthly Rental, Retail Purchase) | `inquiries` |
| `status` | VARCHAR | Lead pipeline stage (Pending, Contacted, Completed) | `inquiries` |
| `notes` | TEXT | Detailed procurement notes, RAM/SSD upgrade requests | `inquiries` |
| `createdAt` | TIMESTAMP | ISO-8601 creation timestamp | `inquiries` |
| `updatedAt` | TIMESTAMP | ISO-8601 last update timestamp | `inquiries` |
| `id` | VARCHAR | Unique service repair ticket identification code | `serviceTickets` |
| `date` | DATE | Service booking date (YYYY-MM-DD) | `serviceTickets` |
| `customerName` | VARCHAR | Client or device owner name | `serviceTickets` |
| `phone` | VARCHAR | Contact telephone number for diagnostic updates | `serviceTickets` |
| `laptopBrandModel` | VARCHAR | Customer device brand and model brought for repair | `serviceTickets` |
| `issueType` | VARCHAR | Reported hardware defect, fault symptom, or service request | `serviceTickets` |
| `serviceCategory` | VARCHAR | Service type (Chip-Level, Screen Replacement, RAM/SSD Boost, Corporate AMC) | `serviceTickets` |
| `estimatedCost` | VARCHAR | Estimated repair cost quotation in INR (₹) | `serviceTickets` |
| `status` | VARCHAR | Repair fulfillment stage (Pending Inspection, In Progress, Completed) | `serviceTickets` |
| `pickupRequired` | BOOLEAN | Doorstep pickup request flag (true = doorstep pickup, false = walk-in) | `serviceTickets` |
| `address` | VARCHAR | Customer address for pickup and doorstep return delivery | `serviceTickets` |
| `createdAt` | TIMESTAMP | ISO-8601 creation timestamp | `serviceTickets` |
| `updatedAt` | TIMESTAMP | ISO-8601 last update timestamp | `serviceTickets` |
