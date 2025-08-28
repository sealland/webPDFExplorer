# PDF Explorer Web Application

A web application for browsing and viewing PDF files organized in a hierarchical folder structure (Year/Month/Day/runningnumber.pdf). The application mimics the browsing experience of Windows Explorer with a modern, responsive interface.

## Features

- **Hierarchical File Browsing**: Navigate through Year/Month/Day folder structure
- **Tree View**: Expandable folder tree for easy navigation
- **File Explorer**: Detailed view of files in current directory
- **PDF Viewer**: Built-in PDF viewer with zoom, navigation, and download capabilities
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface using Material-UI components

## Technology Stack

- **Frontend**: React with Material-UI
- **Backend**: Node.js with Express.js
- **PDF Rendering**: PDF.js (client-side)
- **File System**: Direct file system access (no database required)

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd pdf-explorer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Create PDF directory structure**
   Create a `pdfs` folder in the root directory and organize your PDF files as follows:
   ```
   pdfs/
   ├── 2023/
   │   ├── 01/
   │   │   ├── 01/
   │   │   │   ├── 001.pdf
   │   │   │   ├── 002.pdf
   │   │   │   └── 003.pdf
   │   │   └── 02/
   │   │       ├── 001.pdf
   │   │       └── 002.pdf
   │   └── 02/
   │       └── 15/
   │           └── 001.pdf
   └── 2024/
       └── 01/
           └── 01/
               └── 001.pdf
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and go to `http://localhost:3000`

## Usage

### Navigation
- **Folder Tree**: Click on folders to expand/collapse and navigate
- **File Explorer**: View files in the current directory with details
- **PDF Viewer**: Click on any PDF file to view it in the built-in viewer

### PDF Viewer Controls
- **Zoom**: Use the zoom in/out buttons to adjust the view
- **Navigation**: Use arrow buttons to navigate between pages
- **Download**: Click the download button to save the PDF
- **Open in New Tab**: Click the external link button to open in a new browser tab

## Project Structure

```
pdf-explorer/
├── server/
│   └── index.js          # Express.js backend server
├── client/
│   ├── public/
│   │   └── index.html    # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   ├── FolderTree.js    # Folder tree component
│   │   │   ├── FileExplorer.js  # File explorer component
│   │   │   └── PDFViewer.js     # PDF viewer component
│   │   ├── App.js        # Main React application
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
├── pdfs/                 # PDF files directory (create this)
├── package.json          # Backend dependencies
└── README.md            # This file
```

## API Endpoints

- `GET /api/folders` - Get the complete folder structure
- `GET /api/file/:filePath` - Get file information
- `GET /pdfs/:filePath` - Serve PDF files

## Error Handling

The application includes comprehensive error handling for:
- Missing files or directories
- Corrupted PDF files
- Network errors
- Invalid file paths

## Security Considerations

- The application only serves files from the `pdfs` directory
- File paths are validated to prevent directory traversal attacks
- CORS is enabled for development

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production

### Customization

You can customize the application by:
- Modifying the Material-UI theme in `App.js`
- Adding new features to the PDF viewer
- Implementing search functionality
- Adding user authentication

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `server/index.js` or kill the process using the port
2. **PDF files not loading**: Ensure files are in the correct directory structure
3. **CORS errors**: Check that the backend is running on the correct port

### Logs

Check the console output for detailed error messages and debugging information.

---

# แอปพลิเคชันเว็บ PDF Explorer

แอปพลิเคชันเว็บสำหรับการเรียกดูและดูไฟล์ PDF ที่จัดเรียงในโครงสร้างโฟลเดอร์แบบลำดับชั้น (ปี/เดือน/วัน/หมายเลขไฟล์.pdf) แอปพลิเคชันนี้เลียนแบบประสบการณ์การเรียกดูของ Windows Explorer ด้วยอินเทอร์เฟซที่ทันสมัยและตอบสนอง

## คุณสมบัติ

- **การเรียกดูไฟล์แบบลำดับชั้น**: นำทางผ่านโครงสร้างโฟลเดอร์ ปี/เดือน/วัน
- **มุมมองต้นไม้**: ต้นไม้โฟลเดอร์ที่ขยายได้สำหรับการนำทางที่ง่าย
- **ตัวสำรวจไฟล์**: มุมมองรายละเอียดของไฟล์ในไดเรกทอรีปัจจุบัน
- **ตัวดู PDF**: ตัวดู PDF ในตัวพร้อมความสามารถในการซูม นำทาง และดาวน์โหลด
- **การออกแบบที่ตอบสนอง**: ทำงานบนเดสก์ท็อปและอุปกรณ์มือถือ
- **UI ที่ทันสมัย**: อินเทอร์เฟซที่สะอาดตาโดยใช้คอมโพเนนต์ Material-UI

## เทคโนโลยีที่ใช้

- **Frontend**: React พร้อม Material-UI
- **Backend**: Node.js พร้อม Express.js
- **การแสดงผล PDF**: PDF.js (ฝั่งไคลเอนต์)
- **ระบบไฟล์**: การเข้าถึงระบบไฟล์โดยตรง (ไม่ต้องการฐานข้อมูล)

## การติดตั้ง

### ความต้องการเบื้องต้น

- Node.js (เวอร์ชัน 14 หรือสูงกว่า)
- npm (มาพร้อมกับ Node.js)

### คำแนะนำการติดตั้ง

1. **โคลนหรือดาวน์โหลดโปรเจกต์**
   ```bash
   git clone <repository-url>
   cd pdf-explorer
   ```

2. **ติดตั้ง dependencies**
   ```bash
   npm run install-all
   ```

3. **สร้างโครงสร้างไดเรกทอรี PDF**
   สร้างโฟลเดอร์ `pdfs` ในไดเรกทอรีหลักและจัดระเบียบไฟล์ PDF ของคุณดังนี้:
   ```
   pdfs/
   ├── 2023/
   │   ├── 01/
   │   │   ├── 01/
   │   │   │   ├── 001.pdf
   │   │   │   ├── 002.pdf
   │   │   │   └── 003.pdf
   │   │   └── 02/
   │   │       ├── 001.pdf
   │   │       └── 002.pdf
   │   └── 02/
   │       └── 15/
   │           └── 001.pdf
   └── 2024/
       └── 01/
           └── 01/
               └── 001.pdf
   ```

4. **เริ่มต้นแอปพลิเคชัน**
   ```bash
   npm run dev
   ```

5. **เข้าถึงแอปพลิเคชัน**
   เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`

## การใช้งาน

### การนำทาง
- **ต้นไม้โฟลเดอร์**: คลิกที่โฟลเดอร์เพื่อขยาย/ย่อและนำทาง
- **ตัวสำรวจไฟล์**: ดูไฟล์ในไดเรกทอรีปัจจุบันพร้อมรายละเอียด
- **ตัวดู PDF**: คลิกที่ไฟล์ PDF ใดๆ เพื่อดูในตัวดูในตัว

### ตัวควบคุมตัวดู PDF
- **ซูม**: ใช้ปุ่มซูมเข้า/ออกเพื่อปรับมุมมอง
- **การนำทาง**: ใช้ปุ่มลูกศรเพื่อนำทางระหว่างหน้า
- **ดาวน์โหลด**: คลิกปุ่มดาวน์โหลดเพื่อบันทึก PDF
- **เปิดในแท็บใหม่**: คลิกปุ่มลิงก์ภายนอกเพื่อเปิดในแท็บเบราว์เซอร์ใหม่

## โครงสร้างโปรเจกต์

```
pdf-explorer/
├── server/
│   └── index.js          # เซิร์ฟเวอร์ backend Express.js
├── client/
│   ├── public/
│   │   └── index.html    # ไฟล์ HTML หลัก
│   ├── src/
│   │   ├── components/
│   │   │   ├── FolderTree.js    # คอมโพเนนต์ต้นไม้โฟลเดอร์
│   │   │   ├── FileExplorer.js  # คอมโพเนนต์ตัวสำรวจไฟล์
│   │   │   └── PDFViewer.js     # คอมโพเนนต์ตัวดู PDF
│   │   ├── App.js        # แอปพลิเคชัน React หลัก
│   │   ├── index.js      # จุดเริ่มต้น React
│   │   └── index.css     # สไตล์ทั่วโลก
│   └── package.json      # dependencies ฝั่ง frontend
├── pdfs/                 # ไดเรกทอรีไฟล์ PDF (สร้างขึ้น)
├── package.json          # dependencies ฝั่ง backend
└── README.md            # ไฟล์นี้
```

## API Endpoints

- `GET /api/folders` - รับโครงสร้างโฟลเดอร์ทั้งหมด
- `GET /api/file/:filePath` - รับข้อมูลไฟล์
- `GET /pdfs/:filePath` - ให้บริการไฟล์ PDF

## การจัดการข้อผิดพลาด

แอปพลิเคชันรวมการจัดการข้อผิดพลาดที่ครอบคลุมสำหรับ:
- ไฟล์หรือไดเรกทอรีที่หายไป
- ไฟล์ PDF ที่เสียหาย
- ข้อผิดพลาดเครือข่าย
- เส้นทางไฟล์ที่ไม่ถูกต้อง

## การพิจารณาด้านความปลอดภัย

- แอปพลิเคชันให้บริการเฉพาะไฟล์จากไดเรกทอรี `pdfs`
- เส้นทางไฟล์ได้รับการตรวจสอบเพื่อป้องกันการโจมตีแบบ directory traversal
- CORS เปิดใช้งานสำหรับการพัฒนา

## การพัฒนา

### สคริปต์ที่มีอยู่

- `npm start` - เริ่มเซิร์ฟเวอร์การผลิต
- `npm run dev` - เริ่มทั้ง frontend และ backend ในโหมดการพัฒนา
- `npm run server` - เริ่มเฉพาะเซิร์ฟเวอร์ backend
- `npm run client` - เริ่มเฉพาะเซิร์ฟเวอร์การพัฒนา frontend
- `npm run build` - สร้าง frontend สำหรับการผลิต

### การปรับแต่ง

คุณสามารถปรับแต่งแอปพลิเคชันได้โดย:
- แก้ไขธีม Material-UI ใน `App.js`
- เพิ่มคุณสมบัติใหม่ให้กับตัวดู PDF
- ใช้ฟังก์ชันการค้นหา
- เพิ่มการยืนยันตัวตนผู้ใช้

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **พอร์ตถูกใช้งานอยู่**: เปลี่ยนพอร์ตใน `server/index.js` หรือฆ่าโปรเซสที่ใช้พอร์ต
2. **ไฟล์ PDF ไม่โหลด**: ตรวจสอบว่าไฟล์อยู่ในโครงสร้างไดเรกทอรีที่ถูกต้อง
3. **ข้อผิดพลาด CORS**: ตรวจสอบว่า backend ทำงานบนพอร์ตที่ถูกต้อง

### บันทึก

ตรวจสอบผลลัพธ์คอนโซลสำหรับข้อความข้อผิดพลาดรายละเอียดและข้อมูลการดีบัก
