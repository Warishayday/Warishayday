document.addEventListener('DOMContentLoaded', () => {
    const API_ENDPOINT = '/.netlify/functions/data';

    // =================================================================================
    // ===== DATA STRUCTURE (appData) =====
    // =================================================================================
    let appData = {
        categories: [],
        products: [],
        cart: {},
        adminPin: '210406',
        subAdmins: [],
        shopSettings: {
            shopName: "WARISHAYDAY",
            slogan: "ร้านค้าไอเท็ม Hay Day",
            managerName: "", 
            shareholderName: "", 
            themeColor: "#28a745",
            fontFamily: "'Kanit', sans-serif",
            globalFontFamily: "'Kanit', sans-serif",
            orderNumberFormat: 'format1',
            orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
            logo: null,
            useLogo: false,
            darkMode: false,
            shopNameEffect: {
                enabled: false,
                offsetX: 2,
                offsetY: 2,
                blur: 4,
                color: '#000000'
            },
            backgroundImage: null,
            backgroundOpacity: 1,
            backgroundBlur: 0,
            loadingBackgroundImage: null,
            loadingBackgroundOpacity: 0.7,
            language: 'th',
            lowStockThreshold: 50,
            copyrightText: "Copyright © 2025 Warishayday", 
            copyrightOpacity: 1,
            globalFontSize: 100,
            shopNameFontSize: 100,
            sloganFontSize: 100,
            festivalEffects: {
                rain: { enabled: false, intensity: 20, opacity: 1 },
                snow: { enabled: false, intensity: 20, opacity: 1 },
                fireworks: { enabled: false, duration: 1, opacity: 1 },
                custom: 'none'
            },
            systemOpen: true,
            maintenanceMessage: "ขณะนี้ร้านค้ากำลังปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวกครับ",
            loadingBarStyle: 'style-1'
        },
        analytics: {
            dailyTraffic: Array(7).fill(0),
            hourlyTraffic: Array(24).fill(0),
            productSales: {},
            orders: [],
            totalSales: 0,
            monthlyProfit: 0
        },
        menuOrder: [
            'admin', 'stock', 'order-number', 'dashboard', 'tax', 'manage-account'
        ]
    };

    // =================================================================================
    // ===== FONT & TRANSLATION DATA =====
    // =================================================================================
    const FONT_OPTIONS = [
        { name: "Kanit", value: "'Kanit', sans-serif" }, { name: "Chakra Petch", value: "'Chakra Petch', sans-serif" },
        { name: "IBM Plex Sans Thai", value: "'IBM Plex Sans Thai', sans-serif" }, { name: "Sarabun", value: "'Sarabun', sans-serif" },
        { name: "Prompt", value: "'Prompt', sans-serif" }, { name: "Mali", value: "'Mali', sans-serif" },
        { name: "Anuphan", value: "'Anuphan', sans-serif" }, { name: "Taviraj", value: "'Taviraj', serif" },
        { name: "Trirong", value: "'Trirong', serif" },
    ];
    
    const translations = {
        th: {
            loadingMessage: "กำลังดาวน์โหลดข้อมูลล่าสุด...",
            closeBtn: "ปิด", cancelBtn: "ยกเลิก", confirmBtn: "ยืนยัน", saveBtn: "บันทึก", editBtn: "แก้ไข", deleteBtn: "ลบ",
            searchPlaceholder: "ค้นหาสินค้า...", itemsListTitle: "รายการสินค้า", tableHeaderItem: "สินค้า", tableHeaderLevel: "เลเวล", tableHeaderQuantity: "จำนวน", tableHeaderManage: "จัดการ",
            viewOrderBtn: "รายการสั่งซื้อ", confirmOrderBtn: "ยืนยันสั่งซื้อ", totalAmount: "ยอดรวม",
            adminLoginTitle: "เข้าสู่ระบบหลังบ้าน", pinLabel: "PIN", loginBtn: "เข้าสู่ระบบ", backToShopBtn: "กลับหน้าหลักสั่งสินค้า", invalidPinError: "PIN ไม่ถูกต้อง!",
            adminPanelTitle: "Admin Panel", viewShopBtn: "มุมมองหน้าร้าน", logoutBtn: "ออกจากระบบ",
            menuAdmin: "ตั้งค่าร้าน", menuStock: "สต๊อกสินค้า", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuTax: "ตรวจสอบภาษี", menuManageAccount: "Manage account", editMenuOrderBtn: "EDIT",
            shopInfoTitle: "ข้อมูลร้าน", systemFontsTitle: "System Fonts", fontPreviewText: "ตัวอย่างฟอนต์ระบบ",
            shopNameLabel: "ชื่อร้านค้า", shopSloganLabel: "สโลแกนร้าน", managerNameLabel: "ชื่อผู้จัดการระบบ", shareholderNameLabel: "ชื่อผู้ถือหุ้นใหญ่",
            globalFontLabel: "ฟอนต์ระบบทั้งหมด", shopNameFontLabel: "ฟอนต์ชื่อร้าน", enableEffectLabel: "เปิดใช้เอฟเฟกต์ชื่อร้าน",
            effectOffsetX: "เงาแนวนอน (X)", effectOffsetY: "เงาแนวตั้ง (Y)", effectBlur: "ความเบลอ", effectColor: "สีเงา",
            orderFormatLabel: "รูปแบบเลขที่ออเดอร์", useLogoLabel: "ใช้โลโก้", uploadLogoLabel: "อัปโหลดโลโก้ (PNG)",
            backgroundSettingsTitle: "ตั้งค่าพื้นหลัง", uploadBgLabel: "อัปโหลดภาพพื้นหลัง", bgOpacityLabel: "ความโปร่งใส (จาง-ชัด)", bgBlurLabel: "ความเบลอ (น้อย-มาก)",
            removeBgBtn: "ลบพื้นหลัง", previewBgBtn: "ดูตัวอย่าง", themeColorLabel: "ธีมสี (Theme)", saveSettingsBtn: "บันทึกการตั้งค่า",
            copyrightTextLabel: "ข้อความ Copyright", copyrightOpacityLabel: "ความคมชัด", changePinTitle: "เปลี่ยนรหัสผ่าน", newPinLabel: "PIN ใหม่", saveNewPinBtn: "บันทึก PIN ใหม่",
            manageCategoriesTitle: "จัดการหมวดหมู่", categoryNameLabel: "ชื่อหมวดหมู่", categoryIconLabel: "ไอค่อนหมวดหมู่ (ไฟล์ PNG)", minOrderLabel: "จำนวนสั่งซื้อขั้นต่ำ",
            tableHeaderPriceSettings: "ตั้งค่าราคา", saveCategoryBtn: "เพิ่ม/บันทึกหมวดหมู่", categoryListTitle: "รายการหมวดหมู่",
            tableHeaderIcon: "ไอค่อน", tableHeaderName: "ชื่อ", tableHeaderMinOrder: "ขั้นต่ำ",
            manageProductsTitle: "จัดการสินค้า", productNameLabel: "ชื่อสินค้า", levelLabel: "เลเวล", stockQuantityLabel: "จำนวนคงเหลือ", categoryLabel: "หมวดหมู่",
            productIconLabel: "ไอค่อนสินค้า (ไฟล์ PNG)", productAvailableLabel: "เปิดขายสินค้านี้", saveProductBtn: "บันทึกสินค้า", cancelEditBtn: "ยกเลิกแก้ไข",
            tableHeaderStock: "คงเหลือ", tableHeaderStatus: "สถานะ", statusAvailable: "เปิดขาย", statusUnavailable: "ปิดขาย",
            selectDateLabel: "เลือกวันที่:", resetDataBtn: "รีเซ็ทข้อมูล", activeOrdersTitle: "รายการออเดอร์ปัจจุบัน", cancelledOrdersTitle: "รายการออเดอร์ที่ถูกยกเลิก",
            tableHeaderOrderNo: "เลขออเดอร์", tableHeaderDateTime: "วันที่/เวลา", tableHeaderTotal: "ยอดรวม", viewDetailsBtn: "ดูรายละเอียด", cancelOrderBtn: "ยกเลิก",
            dashboardTitle: "ภาพรวมร้านค้า", monthlyProfitTitle: "กำไรเดือนนี้", dailyOrdersTitle: "ยอดออเดอร์วันนี้", monthlyOrdersTitle: "ยอดออเดอร์เดือนนี้", yearlySalesTitle: "ยอดขายรวม (ปีนี้)",
            lowStockTitle: "สินค้าที่ต้องเติม (10 อันดับ)", lowStockThresholdLabel: "แจ้งเตือนเมื่อเหลือน้อยกว่า:", lowStockInfo: "รบกวนเติมสินค้าสำหรับรายการที่มีไฟกระพริบ",
            noLowStockItems: "ไม่มีสินค้าใกล้หมด", categorySalesTitle: "ยอดขายตามหมวดหมู่", topSellingTitle: "สินค้าขายดี (Top 5)",
            periodDay: "วันนี้", periodMonth: "เดือนนี้", periodYear: "ปีนี้", trafficStatsTitle: "สถิติการเข้าใช้งาน", productStatsTitle: "สถิติสินค้า (ตามจำนวนที่สั่ง)",
            manageAccountTitle: "จัดการบัญชี", subAdminLimitInfo: "จำกัดจำนวนผู้ใช้ย่อยได้สูงสุด 20 คน", usernameLabel: "ชื่อผู้ใช้", addUserBtn: "เพิ่มผู้ใช้", subAdminListTitle: "รายการผู้ใช้ย่อย",
            orderSummaryTitle: "สรุปออเดอร์", copyOrderPrompt: "กรุณาคัดลอกข้อความด้านล่างเพื่อส่งให้ทางร้าน", copyOrderBtn: "คัดลอกออเดอร์", copySuccessMessage: "คัดลอกออเดอร์สำเร็จ",
            yourOrderListTitle: "รายการสั่งซื้อของคุณ", confirmPinTitle: "ยืนยันรหัส PIN", enterPinPrompt: "กรอกรหัส PIN เพื่อยืนยัน",
            confirmResetTitle: "ยืนยันการรีเซ็ทข้อมูล", selectResetPeriodPrompt: "กรุณาเลือกช่วงเวลาที่ต้องการรีเซ็ทข้อมูล", periodWeek: "สัปดาห์นี้", periodAll: "ข้อมูลทั้งหมด",
            priceSettingsTitle: "ตั้งค่าราคา", priceSettingsInfo: "กำหนดราคาสำหรับหมวดหมู่:", savePriceBtn: "บันทึกราคา",
            reorderMenuTitle: "จัดเรียงเมนู", reorderMenuInfo: "ลากและวางเพื่อจัดลำดับเมนูตามต้องการ", saveOrderBtn: "บันทึกการจัดเรียง",
            setPermissionsTitle: "ตั้งค่าสิทธิ์การเข้าถึง", savePermissionsBtn: "บันทึกสิทธิ์",
            loadingBackgroundTitle: "พื้นหลัง Loading", uploadLoadingBgLabel: "อัปโหลดภาพพื้นหลัง Loading",
            saveSuccessMessage: "บันทึกสำเร็จ!", systemStatusLabel: "สถานะร้าน",
            shopNameFontSizeLabel: "ขนาดฟอนต์ชื่อร้าน", sloganFontSizeLabel: "ขนาดฟอนต์สโลแกน", globalFontSizeLabel: "ขนาดฟอนต์ทั้งระบบ",
            festivalTitle: "Festival Effects", rainEffectLabel: "เอฟเฟกต์ฝนตก", rainIntensityLabel: "ความหนัก", effectOpacityLabel: "ความชัด",
            snowEffectLabel: "เอฟเฟกต์หิมะตก", snowIntensityLabel: "ความหนัก", fireworksEffectLabel: "เอฟเฟกต์พลุ", fireworksDurationLabel: "ระยะเวลา (นาที)",
            customEffectLabel: "เอฟเฟกต์อื่นๆ", systemStatusSettingsTitle: "ตั้งค่าการเปิด/ปิดระบบ", maintenanceMessageLabel: "ข้อความที่จะแสดงเมื่อปิดระบบ",
            loadingBarStyleLabel: "รูปแบบแถบดาวน์โหลด", newOrdersTitle: "ออเดอร์ใหม่",
            taxCalculationTitle: "คำนวณภาษี (ภ.ง.ด. 90/94)", taxInfoText: "ระบบจะดึงยอดขายรวมทั้งปีมาคำนวณเบื้องต้น กรุณากรอกค่าลดหย่อนอื่นๆ เพื่อความถูกต้อง",
            taxTotalSalesLabel: "รายได้รวมจากระบบ (ทั้งปี)", taxOtherIncomeLabel: "รายได้อื่นๆ", taxDeductionLabel: "ค่าลดหย่อนส่วนตัวและอื่นๆ",
            calculateTaxBtn: "คำนวณภาษี", taxResultTitle: "ผลการคำนวณภาษี",
        },
        en: {
            loadingMessage: "Loading latest data...",
            closeBtn: "Close", cancelBtn: "Cancel", confirmBtn: "Confirm", saveBtn: "Save", editBtn: "Edit", deleteBtn: "Delete",
            searchPlaceholder: "Search for items...", itemsListTitle: "Item List", tableHeaderItem: "Item", tableHeaderLevel: "Level", tableHeaderQuantity: "Quantity", tableHeaderManage: "Manage",
            viewOrderBtn: "View Order", confirmOrderBtn: "Confirm Order", totalAmount: "Total",
            adminLoginTitle: "Admin Login", pinLabel: "PIN", loginBtn: "Login", backToShopBtn: "Back to Shop", invalidPinError: "Invalid PIN!",
            adminPanelTitle: "Admin Panel", viewShopBtn: "View Shop", logoutBtn: "Logout",
            menuAdmin: "Shop Settings", menuStock: "Stock", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuTax: "Tax Calculator", menuManageAccount: "Manage Account", editMenuOrderBtn: "EDIT",
            shopInfoTitle: "Shop Information", systemFontsTitle: "System Fonts", fontPreviewText: "System Font Preview",
            shopNameLabel: "Shop Name", shopSloganLabel: "Shop Slogan", managerNameLabel: "System Manager Name", shareholderNameLabel: "Major Shareholder Name",
            globalFontLabel: "Global Font", shopNameFontLabel: "Shop Name Font", enableEffectLabel: "Enable Shop Name Effect",
            effectOffsetX: "Offset X", effectOffsetY: "Offset Y", effectBlur: "Blur", effectColor: "Color",
            orderFormatLabel: "Order Number Format", useLogoLabel: "Use Logo", uploadLogoLabel: "Upload Logo (PNG)",
            backgroundSettingsTitle: "Background Settings", uploadBgLabel: "Upload Background Image", bgOpacityLabel: "Opacity (Faint-Clear)", bgBlurLabel: "Blur (Less-More)",
            removeBgBtn: "Remove Background", previewBgBtn: "Preview", themeColorLabel: "Theme Color", saveSettingsBtn: "Save Settings",
            copyrightTextLabel: "Copyright Text", copyrightOpacityLabel: "Opacity", changePinTitle: "Change PIN", newPinLabel: "New PIN", saveNewPinBtn: "Save New PIN",
            manageCategoriesTitle: "Manage Categories", categoryNameLabel: "Category Name", categoryIconLabel: "Category Icon (PNG)", minOrderLabel: "Minimum Order Quantity",
            tableHeaderPriceSettings: "Price Settings", saveCategoryBtn: "Add/Save Category", categoryListTitle: "Category List",
            tableHeaderIcon: "Icon", tableHeaderName: "Name", tableHeaderMinOrder: "Min. Qty",
            manageProductsTitle: "Manage Products", productNameLabel: "Product Name", levelLabel: "Level", stockQuantityLabel: "Stock Quantity", categoryLabel: "Category",
            productIconLabel: "Product Icon (PNG)", productAvailableLabel: "This product is available", saveProductBtn: "Save Product", cancelEditBtn: "Cancel Edit",
            tableHeaderStock: "Stock", tableHeaderStatus: "Status", statusAvailable: "Available", statusUnavailable: "Unavailable",
            selectDateLabel: "Select Date:", resetDataBtn: "Reset Data", activeOrdersTitle: "Active Orders", cancelledOrdersTitle: "Cancelled Orders",
            tableHeaderOrderNo: "Order No.", tableHeaderDateTime: "Date/Time", tableHeaderTotal: "Total", viewDetailsBtn: "Details", cancelOrderBtn: "Cancel",
            dashboardTitle: "Dashboard", monthlyProfitTitle: "This Month's Profit", dailyOrdersTitle: "Today's Orders", monthlyOrdersTitle: "This Month's Orders", yearlySalesTitle: "This Year's Sales",
            lowStockTitle: "Low Stock Items (Top 10)", lowStockThresholdLabel: "Alert when stock is less than:", lowStockInfo: "Please restock items with a blinking light.",
            noLowStockItems: "No items are low on stock", categorySalesTitle: "Sales by Category", topSellingTitle: "Top 5 Selling Items",
            periodDay: "Today", periodMonth: "This Month", periodYear: "This Year", trafficStatsTitle: "Traffic Statistics", productStatsTitle: "Product Statistics (by quantity)",
            manageAccountTitle: "Manage Accounts", subAdminLimitInfo: "Sub-admin limit is 20 users.", usernameLabel: "Username", addUserBtn: "Add User", subAdminListTitle: "Sub-Admin List",
            orderSummaryTitle: "Order Summary", copyOrderPrompt: "Please copy the text below to send to the shop.", copyOrderBtn: "Copy Order", copySuccessMessage: "Order copied successfully",
            yourOrderListTitle: "Your Order List", confirmPinTitle: "Confirm PIN", enterPinPrompt: "Enter PIN to confirm",
            confirmResetTitle: "Confirm Data Reset", selectResetPeriodPrompt: "Please select the period for data reset.", periodWeek: "This Week", periodAll: "All Data",
            priceSettingsTitle: "Price Settings", priceSettingsInfo: "Set prices for category:", savePriceBtn: "Save Prices",
            reorderMenuTitle: "Reorder Menu", reorderMenuInfo: "Drag and drop to reorder the menu.", saveOrderBtn: "Save Order",
            setPermissionsTitle: "Set Permissions", savePermissionsBtn: "Save Permissions",
            loadingBackgroundTitle: "Loading Background", uploadLoadingBgLabel: "Upload Loading Background",
            saveSuccessMessage: "Saved!", systemStatusLabel: "Shop Status",
            shopNameFontSizeLabel: "Shop Name Font Size", sloganFontSizeLabel: "Slogan Font Size", globalFontSizeLabel: "Global Font Size",
            festivalTitle: "Festival Effects", rainEffectLabel: "Rain Effect", rainIntensityLabel: "Intensity", effectOpacityLabel: "Opacity",
            snowEffectLabel: "Snow Effect", snowIntensityLabel: "Intensity", fireworksEffectLabel: "Fireworks Effect", fireworksDurationLabel: "Duration (min)",
            customEffectLabel: "Other Effects", systemStatusSettingsTitle: "System Status Settings", maintenanceMessageLabel: "Message to display when closed",
            loadingBarStyleLabel: "Loading Bar Style", newOrdersTitle: "New Orders",
            taxCalculationTitle: "Tax Calculator (P.N.D. 90/94)", taxInfoText: "The system uses total annual sales for initial calculation. Please enter other deductions for accuracy.",
            taxTotalSalesLabel: "Total Sales from System (Annual)", taxOtherIncomeLabel: "Other Income", taxDeductionLabel: "Personal & Other Allowances",
            calculateTaxBtn: "Calculate Tax", taxResultTitle: "Tax Calculation Result",
        }
    };

    const MENU_NAMES = {
        'admin': 'menuAdmin', 'stock': 'menuStock', 'order-number': 'menuOrderNumber',
        'dashboard': 'menuDashboard', 'tax': 'menuTax', 'manage-account': 'menuManageAccount'
    };
    const SUB_MENUS = {
        'admin': { 
            'shop-info': 'shopInfoTitle', 'system-fonts': 'systemFontsTitle', 'background': 'backgroundSettingsTitle', 
            'loading-bg': 'loadingBackgroundTitle', 'festival': 'festivalTitle', 'system-status': 'systemStatusSettingsTitle', 'pin': 'changePinTitle' 
        },
        'stock': { 'categories': 'manageCategoriesTitle', 'products': 'manageProductsTitle' },
        'order-number': { 'new-orders': 'newOrdersTitle', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' }
    };

    // =================================================================================
    // ===== CORE FUNCTIONS (Save, Load, Utilities) =====
    // =================================================================================
    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const saveState = async () => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData),
            });
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            console.log('Data saved successfully!');
        } catch (error) {
            console.error('Failed to save state:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
        }
    };

    const loadState = async () => {
        try {
            const response = await fetch(API_ENDPOINT);
            if (response.status === 404) {
                console.log('No data found, initializing with default data.');
                await saveState(); 
                return;
            }
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const serverData = await response.json();
            const defaultAppData = {
                cart: {},
                shopSettings: {
                    shopName: "WARISHAYDAY", slogan: "ร้านค้าไอเท็ม Hay Day", managerName: "", shareholderName: "", themeColor: "#28a745", fontFamily: "'Kanit', sans-serif",
                    globalFontFamily: "'Kanit', sans-serif", logo: null, useLogo: false, darkMode: false,
                    orderNumberFormat: 'format1', orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
                    shopNameEffect: { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: '#000000' },
                    backgroundImage: null, backgroundOpacity: 1, backgroundBlur: 0, 
                    loadingBackgroundImage: null, loadingBackgroundOpacity: 0.7,
                    language: 'th', lowStockThreshold: 50,
                    copyrightText: "Copyright © 2025 Warishayday", copyrightOpacity: 1,
                    globalFontSize: 100, shopNameFontSize: 100, sloganFontSize: 100,
                    festivalEffects: { rain: { enabled: false, intensity: 20, opacity: 1 }, snow: { enabled: false, intensity: 20, opacity: 1 }, fireworks: { enabled: false, duration: 1, opacity: 1 }, custom: 'none' },
                    systemOpen: true, maintenanceMessage: "ขณะนี้ร้านค้ากำลังปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวกครับ",
                    loadingBarStyle: 'style-1'
                },
                analytics: { dailyTraffic: Array(7).fill(0), hourlyTraffic: Array(24).fill(0), productSales: {}, orders: [], totalSales: 0, monthlyProfit: 0 },
                subAdmins: [],
                menuOrder: ['admin', 'stock', 'order-number', 'dashboard', 'tax', 'manage-account'],
                categories: [], products: [],
            };
            appData = { ...defaultAppData, ...serverData };
            appData.shopSettings = {...defaultAppData.shopSettings, ...(serverData.shopSettings || {})};
            appData.shopSettings.festivalEffects = {...defaultAppData.shopSettings.festivalEffects, ...(serverData.shopSettings?.festivalEffects || {})};
            appData.analytics.orders = appData.analytics.orders || [];
            appData.analytics.orders.forEach(o => { if(!o.status) o.status = 'active'; });
            appData.categories.forEach(cat => { if (cat.minOrderQuantity === undefined) cat.minOrderQuantity = 30; });
            appData.products.forEach(prod => {
                if (prod.isAvailable === undefined) prod.isAvailable = true;
                if (prod.stock === undefined) prod.stock = -1;
            });
            const validMenus = new Set(defaultAppData.menuOrder);
            appData.menuOrder = (appData.menuOrder || defaultAppData.menuOrder).filter(item => validMenus.has(item));
            defaultAppData.menuOrder.forEach(item => { if (!appData.menuOrder.includes(item)) appData.menuOrder.push(item); });
            appData.subAdmins.forEach(sa => {
                if (!sa.permissions) {
                    sa.permissions = {};
                    appData.menuOrder.forEach(key => sa.permissions[key] = true);
                } else {
                    Object.keys(sa.permissions).forEach(key => { if (!validMenus.has(key)) delete sa.permissions[key]; });
                }
            });
        } catch (error) {
            console.error('Failed to load state:', error);
            alert('ไม่สามารถโหลดข้อมูลร้านค้าได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองรีเฟรชหน้าเว็บ');
        }
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const showSaveFeedback = (buttonEl) => {
        const feedbackEl = buttonEl.nextElementSibling;
        if (feedbackEl && feedbackEl.classList.contains('save-feedback')) {
            feedbackEl.textContent = translations[appData.shopSettings.language].saveSuccessMessage;
            feedbackEl.classList.add('show');
            setTimeout(() => {
                feedbackEl.classList.remove('show');
            }, 2000);
        }
    };

    // =================================================================================
    // ===== DOM ELEMENT SELECTORS =====
    // =================================================================================
    const views = {
        customer: document.getElementById('customer-view'),
        adminLogin: document.getElementById('admin-login-view'),
        adminPanel: document.getElementById('admin-panel-view'),
        maintenance: document.getElementById('maintenance-overlay')
    };
    const shopNameDisplay = document.getElementById('shop-name-display');
    const sloganElement = document.getElementById('slogan');
    const categoryTabsContainer = document.getElementById('category-tabs');
    const productTableBody = document.getElementById('product-table-body');
    const currentCategoryName = document.getElementById('current-category-name');
    const orderValidationMsg = document.getElementById('order-validation-message');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const viewOrderBtn = document.getElementById('view-order-btn');
    const orderModal = document.getElementById('order-modal');
    const cartModal = document.getElementById('cart-modal');
    const orderDetails = document.getElementById('order-details');
    const cartDetails = document.getElementById('cart-details');
    const searchBox = document.getElementById('search-box');
    const backToAdminBtn = document.getElementById('back-to-admin-btn');
    const adminGearIcon = document.getElementById('admin-gear-icon');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const adminMenuContainer = document.querySelector('.admin-menu');
    const copyrightFooter = document.getElementById('copyright-footer');
    const festivalContainer = document.getElementById('festival-effects-container');
    
    // =================================================================================
    // ===== STATE VARIABLES =====
    // =================================================================================
    let activeAdminMenu = 'admin';
    let activeAdminSubMenus = { admin: 'shop-info', stock: 'categories', 'order-number': 'new-orders' };
    let activeCategoryId = null;
    let adminActiveCategoryId = null;
    let editingProductId = null;
    let editingCategoryId = null;
    let editingSubAdminId = null;
    let catIconFile = null;
    let prodIconFile = null;
    let logoFile = null;
    let bgFile = null;
    let loadingBgFile = null;
    let isAdminLoggedIn = false;
    let loggedInUser = null; 
    let dailyTrafficChart, productSalesChart, categorySalesChart;
    const datePicker = document.getElementById('date-picker');
    let orderDatePicker, fp;
    let selectedDate = new Date().toISOString().slice(0, 10);
    let festivalIntervals = {};

    // =================================================================================
    // ===== UI RENDERING & THEME APPLICATION =====
    // =================================================================================
    const setLanguage = (lang) => {
        appData.shopSettings.language = lang;
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            const translation = translations[lang][key];
            if (translation) {
                if (el.placeholder !== undefined) el.placeholder = translation;
                else el.textContent = translation;
            }
        });
        langToggleBtn.textContent = '🌎';
    };

    const applyBackground = () => {
        const bgOverlay = document.getElementById('background-overlay');
        if (appData.shopSettings.backgroundImage) {
            bgOverlay.style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
            bgOverlay.style.opacity = appData.shopSettings.backgroundOpacity;
            bgOverlay.style.filter = `blur(${appData.shopSettings.backgroundBlur}px)`;
        } else {
            bgOverlay.style.backgroundImage = 'none';
        }
    };

    const applyLoadingBackground = () => {
        const loaderBg = document.getElementById('loader-background');
        const loaderOverlay = document.getElementById('loader-overlay');
        if (appData.shopSettings.loadingBackgroundImage) {
            loaderBg.style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
            loaderOverlay.style.backgroundColor = `rgba(0, 0, 0, ${appData.shopSettings.loadingBackgroundOpacity})`;
        } else {
            loaderBg.style.backgroundImage = 'none';
            loaderOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
        const progressBar = document.querySelector('.progress-bar-container .progress-bar');
        if(progressBar) progressBar.className = `progress-bar ${appData.shopSettings.loadingBarStyle}`;
    };
    
    const applyFontSizes = () => {
        const root = document.documentElement;
        root.style.setProperty('--global-font-size-multiplier', appData.shopSettings.globalFontSize / 100);
        root.style.setProperty('--shop-name-font-size-multiplier', appData.shopSettings.shopNameFontSize / 100);
        root.style.setProperty('--slogan-font-size-multiplier', appData.shopSettings.sloganFontSize / 100);
    };

    const applyTheme = () => {
        document.documentElement.style.setProperty('--primary-color', appData.shopSettings.themeColor);
        document.documentElement.style.setProperty('--global-font', appData.shopSettings.globalFontFamily);
        shopNameDisplay.style.fontFamily = appData.shopSettings.fontFamily;
        shopNameDisplay.textContent = appData.shopSettings.shopName;
        sloganElement.textContent = appData.shopSettings.slogan;
        const effect = appData.shopSettings.shopNameEffect;
        shopNameDisplay.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : '1px 1px 2px rgba(0,0,0,0.1)';
        
        const shopLogoDisplay = document.getElementById('shop-logo-display');
        const headerTitleContainer = document.getElementById('header-title-container');
        if (appData.shopSettings.useLogo && appData.shopSettings.logo) {
            shopLogoDisplay.src = appData.shopSettings.logo;
            shopLogoDisplay.style.display = 'block';
            shopNameDisplay.style.display = 'none';
            headerTitleContainer.style.flexDirection = 'row';
            sloganElement.style.marginTop = '0';
        } else {
            shopLogoDisplay.style.display = 'none';
            shopNameDisplay.style.display = 'block';
            headerTitleContainer.style.flexDirection = 'column';
            sloganElement.style.marginTop = '-15px';
        }

        if (appData.shopSettings.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }

        copyrightFooter.textContent = appData.shopSettings.copyrightText;
        copyrightFooter.style.opacity = appData.shopSettings.copyrightOpacity;

        applyFontSizes();
        applyBackground();
        applyLoadingBackground();
        renderFestivalEffects();
        setLanguage(appData.shopSettings.language);
    };

    // =================================================================================
    // ===== FESTIVAL EFFECTS LOGIC =====
    // =================================================================================
    const createEffectElement = (type) => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = `${Math.random() * 100}vw`;
        el.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        switch(type) {
            case 'rain':
                el.style.width = '1px';
                el.style.height = '15px';
                el.style.backgroundColor = 'rgba(174,194,224,0.8)';
                el.style.top = '-20px';
                el.style.animationName = 'fall';
                break;
            case 'snow':
                el.innerHTML = '❄️';
                el.style.fontSize = `${Math.random() * 20 + 10}px`;
                el.style.top = '-30px';
                el.style.animationName = 'fall';
                break;
        }
        
        if (!document.getElementById('fall-animation')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'fall-animation';
            styleSheet.innerText = `@keyframes fall { to { transform: translateY(105vh); } }`;
            document.head.appendChild(styleSheet);
        }
        
        festivalContainer.appendChild(el);
        setTimeout(() => el.remove(), 5000);
    };

    const renderFestivalEffects = () => {
        festivalContainer.innerHTML = '';
        Object.values(festivalIntervals).forEach(clearInterval);
        festivalIntervals = {};

        const effects = appData.shopSettings.festivalEffects;
        if (effects.rain.enabled) {
            festivalContainer.style.opacity = effects.rain.opacity;
            festivalIntervals.rain = setInterval(() => {
                createEffectElement('rain');
            }, 1000 / effects.rain.intensity);
        }
        if (effects.snow.enabled) {
            festivalContainer.style.opacity = effects.snow.opacity;
            festivalIntervals.snow = setInterval(() => {
                createEffectElement('snow');
            }, 1000 / effects.snow.intensity);
        }
    };

    // =================================================================================
    // ===== CUSTOMER VIEW LOGIC =====
    // =================================================================================
    const renderCustomerView = () => {
        applyTheme();
        renderCategoryTabs();
        renderProducts();
        checkOrderValidation();
        adminGearIcon.style.display = isAdminLoggedIn ? 'none' : 'flex';
        backToAdminBtn.style.display = isAdminLoggedIn ? 'flex' : 'none';
        themeToggleBtn.style.display = 'flex';
        langToggleBtn.style.display = 'flex';
    };

    const renderCategoryTabs = () => {
        categoryTabsContainer.innerHTML = '';
        appData.categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `tab ${cat.id === activeCategoryId ? 'active' : ''}`;
            tab.dataset.id = cat.id;
            tab.innerHTML = `${cat.icon ? `<img src="${cat.icon}" alt="${cat.name}">` : ''}<span>${cat.name}</span>`;
            categoryTabsContainer.appendChild(tab);
        });
    };

    const renderProducts = (searchTerm = '') => {
        productTableBody.innerHTML = '';
        let productsToDisplay = [];
        
        if (searchTerm) {
            productsToDisplay = appData.products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
            currentCategoryName.textContent = `ผลการค้นหาสำหรับ: "${searchTerm}"`;
        } else {
            const activeCategory = appData.categories.find(c => c.id === activeCategoryId);
            if (!activeCategory) {
                productTableBody.innerHTML = '<tr><td colspan="4">กรุณาเลือกหมวดหมู่</td></tr>';
                currentCategoryName.textContent = '';
                return;
            }
            currentCategoryName.textContent = `${activeCategory.name}`;
            productsToDisplay = appData.products.filter(p => p.categoryId === activeCategoryId);
        }
        
        if (productsToDisplay.length === 0) {
             productTableBody.innerHTML = '<tr><td colspan="4">ไม่พบสินค้าที่ตรงกับเงื่อนไข</td></tr>';
        } else {
            productsToDisplay.forEach(prod => {
                const quantity = appData.cart[prod.id] || 0;
                const isPhysicallyOutOfStock = prod.stock !== -1 && prod.stock <= 0;
                const isUnavailableByAdmin = !prod.isAvailable;
                const row = document.createElement('tr');
                if (isUnavailableByAdmin || isPhysicallyOutOfStock) row.classList.add('product-unavailable');
                let quantityAndManageCells = isUnavailableByAdmin ? `<td colspan="2" class="status-cell">สินค้าหมดชั่วคราว</td>` : `
                    <td><span class="quantity-display">${quantity}</span></td>
                    <td>
                        <div class="quantity-controls">
                            <button class="btn btn-primary btn-small" data-id="${prod.id}" data-op="10" ${isPhysicallyOutOfStock ? 'disabled' : ''}>+10</button>
                            <button class="btn btn-danger btn-small" data-id="${prod.id}" data-op="-10" ${isPhysicallyOutOfStock ? 'disabled' : ''}>-10</button>
                        </div>
                    </td>`;
                row.innerHTML = `
                    <td>${prod.icon ? `<img src="${prod.icon}" alt="${prod.name}">` : ''}${prod.name}</td>
                    <td>${prod.level}</td>
                    ${quantityAndManageCells}`;
                productTableBody.appendChild(row);
            });
        }
    };

    const calculatePrice = (categoryId, quantity) => {
        const category = appData.categories.find(c => c.id === categoryId);
        if (!category || !category.perPiecePrices) return { price: 0, type: 'ไม่ได้ตั้งราคา' };
        
        const sortedPrices = category.perPiecePrices.sort((a, b) => b.quantity - a.quantity);
        let remainingQty = quantity;
        let totalPrice = 0;
        let priceDetails = [];

        for (const priceTier of sortedPrices) {
            if (remainingQty >= priceTier.quantity) {
                const count = Math.floor(remainingQty / priceTier.quantity);
                totalPrice += count * priceTier.price;
                remainingQty -= count * priceTier.quantity;
                priceDetails.push(`${count}x${priceTier.quantity}`);
            }
        }
        return { price: totalPrice, type: priceDetails.join(' + ') || 'ราคาต่อชิ้น' };
    };

    const checkOrderValidation = () => {
        let minOrderMessages = [], totalOrderPrice = 0;
        const itemsByCategory = {};
        for (const productId in appData.cart) {
            const quantity = appData.cart[productId];
            if (quantity > 0) {
                const product = appData.products.find(p => p.id == productId);
                if (product) {
                    if (!itemsByCategory[product.categoryId]) itemsByCategory[product.categoryId] = { total: 0, items: [] };
                    itemsByCategory[product.categoryId].total += quantity;
                }
            }
        }
        for (const categoryId in itemsByCategory) {
            const total = itemsByCategory[categoryId].total;
            const category = appData.categories.find(c => c.id == categoryId);
            if (!category) continue;
            if (total > 0 && total < category.minOrderQuantity) {
                minOrderMessages.push(`<div class="validation-link" data-cat-id="${categoryId}">➡️ หมวด "${category.name}" ขั้นต่ำ ${category.minOrderQuantity} ชิ้น (ขาด ${category.minOrderQuantity - total} ชิ้น)</div>`);
            }
            const priceResult = calculatePrice(parseInt(categoryId), total);
            totalOrderPrice += priceResult.price;
        }
        if (minOrderMessages.length > 0) {
            orderValidationMsg.innerHTML = minOrderMessages.join('');
            confirmOrderBtn.disabled = true;
            viewOrderBtn.disabled = true;
        } else {
            if (totalOrderPrice > 0) {
                orderValidationMsg.innerHTML = `<span style="color: var(--text-color); font-weight: bold;">${translations[appData.shopSettings.language].totalAmount}: ${totalOrderPrice} บาท</span>`;
                confirmOrderBtn.disabled = false;
                viewOrderBtn.disabled = false;
            } else {
                orderValidationMsg.textContent = '';
                confirmOrderBtn.disabled = true;
                viewOrderBtn.disabled = false;
            }
        }
    };

    const createOrderSummaryText = (orderNumber = null) => {
        let summaryText = `${appData.shopSettings.shopName}\n`;
        if (orderNumber) summaryText += `เลขที่ออเดอร์: ${orderNumber}\n\n`;
        const itemsByCategory = {};
        let totalOrderPrice = 0;
        appData.categories.forEach(cat => { itemsByCategory[cat.id] = { name: cat.name, items: [], totalQuantity: 0 }; });
        for (const productId in appData.cart) {
            const quantity = appData.cart[productId];
            if (quantity > 0) {
                const product = appData.products.find(p => p.id == productId);
                if (product && itemsByCategory[product.categoryId]) {
                    itemsByCategory[product.categoryId].items.push(`LV${product.level} ${product.name} x ${quantity}`);
                    itemsByCategory[product.categoryId].totalQuantity += quantity;
                }
            }
        }
        for (const categoryId in itemsByCategory) {
            const categoryData = itemsByCategory[categoryId];
            if (categoryData.items.length > 0) {
                summaryText += `--- หมวดหมู่: ${categoryData.name} ---\n${categoryData.items.join('\n')}\n`;
                const priceResult = calculatePrice(parseInt(categoryId), categoryData.totalQuantity);
                if (priceResult.price > 0) {
                    summaryText += `ราคาหมวดหมู่: ${priceResult.price} บาท\n`;
                    totalOrderPrice += priceResult.price;
                }
                summaryText += '\n';
            }
        }
        summaryText += `ยอดรวมทั้งหมด: ${totalOrderPrice} บาท`;
        return (totalOrderPrice === 0 && Object.values(appData.cart).every(q => q === 0)) ? 'ไม่มีสินค้าในรายการสั่งซื้อ' : summaryText;
    };
    
    // =================================================================================
    // ===== ADMIN PANEL LOGIC =====
    // =================================================================================
    const switchView = (viewName) => {
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[viewName].classList.add('active');
    };

    const renderAdminMenu = () => {
        adminMenuContainer.innerHTML = '';
        const isSuperAdmin = loggedInUser && loggedInUser.isSuper;
        const lang = appData.shopSettings.language;
        appData.menuOrder.forEach(menuKey => {
            let showMenuItem = isSuperAdmin || (loggedInUser && loggedInUser.permissions && loggedInUser.permissions[menuKey]);
            if (showMenuItem && MENU_NAMES[menuKey]) {
                const translationKey = MENU_NAMES[menuKey];
                const btn = document.createElement('button');
                btn.className = `btn menu-btn ${menuKey === activeAdminMenu ? 'active' : ''}`;
                btn.dataset.menu = menuKey;
                btn.textContent = translations[lang][translationKey];
                adminMenuContainer.appendChild(btn);
            }
        });
        if (isSuperAdmin) {
            const reorderBtn = document.createElement('button');
            reorderBtn.className = 'btn btn-small';
            reorderBtn.id = 'reorder-menu-btn';
            reorderBtn.textContent = translations[lang].editMenuOrderBtn;
            adminMenuContainer.appendChild(reorderBtn);
            // FIX: Event listener for this button needs to be handled by delegation or re-added.
            // For simplicity, we'll re-add it here as it's a single button.
            reorderBtn.addEventListener('click', renderReorderMenuModal);
        }
    };
    
    const renderSubMenu = (menuKey, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const subMenuConfig = SUB_MENUS[menuKey];
        if (!subMenuConfig) return;

        const lang = appData.shopSettings.language;
        for (const subKey in subMenuConfig) {
            const tab = document.createElement('div');
            tab.className = `tab ${subKey === activeAdminSubMenus[menuKey] ? 'active' : ''}`;
            tab.dataset.sub = subKey;
            tab.textContent = translations[lang][subMenuConfig[subKey]];
            container.appendChild(tab);
        }
    };

    const renderAdminPanel = () => {
        document.querySelectorAll('.admin-menu-content').forEach(el => el.style.display = 'none');
        const isSuperAdmin = loggedInUser && loggedInUser.isSuper;
        renderAdminMenu();

        const permissions = (loggedInUser && loggedInUser.permissions) || {};
        const canAccess = (menu) => isSuperAdmin || permissions[menu];

        if (activeAdminMenu === 'admin' && canAccess('admin')) {
            const container = document.getElementById('admin-menu-admin');
            container.style.display = 'block';
            renderSubMenu('admin', 'admin-settings-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus.admin;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            
            if (activeSub === 'shop-info') {
                document.getElementById('shop-name').value = appData.shopSettings.shopName;
                document.getElementById('shop-slogan').value = appData.shopSettings.slogan;
                document.getElementById('manager-name').value = appData.shopSettings.managerName;
                document.getElementById('shareholder-name').value = appData.shopSettings.shareholderName;
                document.getElementById('order-format-select').value = appData.shopSettings.orderNumberFormat;
            } else if (activeSub === 'system-fonts') {
                document.getElementById('global-font-size-slider').value = appData.shopSettings.globalFontSize;
                document.getElementById('shop-name-font-size-slider').value = appData.shopSettings.shopNameFontSize;
                document.getElementById('slogan-font-size-slider').value = appData.shopSettings.sloganFontSize;
                document.getElementById('global-font-size-value').textContent = appData.shopSettings.globalFontSize;
                document.getElementById('shop-name-font-size-value').textContent = appData.shopSettings.shopNameFontSize;
                document.getElementById('slogan-font-size-value').textContent = appData.shopSettings.sloganFontSize;
                document.getElementById('shop-global-font').value = appData.shopSettings.globalFontFamily;
                document.getElementById('shop-font').value = appData.shopSettings.fontFamily;
                document.getElementById('logo-toggle').checked = appData.shopSettings.useLogo;
                if(appData.shopSettings.logo) document.getElementById('logo-preview').src = appData.shopSettings.logo;
                const effect = appData.shopSettings.shopNameEffect;
                document.getElementById('effect-toggle').checked = effect.enabled;
                document.getElementById('effect-offset-x').value = effect.offsetX;
                document.getElementById('effect-offset-y').value = effect.offsetY;
                document.getElementById('effect-blur').value = effect.blur;
                document.getElementById('effect-color').value = effect.color;
                document.getElementById('effect-controls-container').style.display = effect.enabled ? 'grid' : 'none';
                document.getElementById('copyright-text').value = appData.shopSettings.copyrightText;
                document.getElementById('copyright-opacity').value = appData.shopSettings.copyrightOpacity;
            } else if (activeSub === 'background') {
                document.getElementById('bg-opacity').value = appData.shopSettings.backgroundOpacity;
                document.getElementById('bg-blur').value = appData.shopSettings.backgroundBlur;
                if(appData.shopSettings.backgroundImage) document.getElementById('bg-preview').style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
            } else if (activeSub === 'loading-bg') {
                document.getElementById('loading-bg-opacity').value = appData.shopSettings.loadingBackgroundOpacity;
                document.getElementById('loading-bar-style-select').value = appData.shopSettings.loadingBarStyle;
                if(appData.shopSettings.loadingBackgroundImage) document.getElementById('loading-bg-preview').style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
            } else if (activeSub === 'festival') {
                const effects = appData.shopSettings.festivalEffects;
                document.getElementById('rain-effect-toggle').checked = effects.rain.enabled;
                document.getElementById('rain-intensity').value = effects.rain.intensity;
                document.getElementById('rain-opacity').value = effects.rain.opacity;
                document.getElementById('snow-effect-toggle').checked = effects.snow.enabled;
                document.getElementById('snow-intensity').value = effects.snow.intensity;
                document.getElementById('snow-opacity').value = effects.snow.opacity;
            } else if (activeSub === 'system-status') {
                document.getElementById('maintenance-message-input').value = appData.shopSettings.maintenanceMessage;
            }
        } else if (activeAdminMenu === 'stock' && canAccess('stock')) {
            const container = document.getElementById('admin-menu-stock');
            container.style.display = 'block';
            renderSubMenu('stock', 'admin-stock-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus.stock;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            if (activeSub === 'categories') {
                renderAdminCategories();
            } else if (activeSub === 'products') {
                renderAdminProductTabs();
                renderAdminProducts();
                populateCategoryDropdown();
            }
        } else if (activeAdminMenu === 'order-number' && canAccess('order-number')) {
            const container = document.getElementById('admin-menu-order-number');
            container.style.display = 'block';
            renderSubMenu('order-number', 'admin-order-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`admin-sub-${activeAdminSubMenus['order-number']}`).classList.add('active');
            if (!orderDatePicker) {
                orderDatePicker = flatpickr("#order-date-picker", { mode: "range", dateFormat: "Y-m-d", onClose: (selectedDates) => renderOrderNumberView(selectedDates) });
            }
            renderOrderNumberView(orderDatePicker.selectedDates);
        } else if (activeAdminMenu === 'dashboard' && canAccess('dashboard')) {
            document.getElementById('admin-menu-dashboard').style.display = 'block';
            document.getElementById('low-stock-threshold').value = appData.shopSettings.lowStockThreshold;
            if (!fp) fp = flatpickr(datePicker, { defaultDate: selectedDate, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => { selectedDate = dateStr; renderDashboard(); } });
            renderDashboard();
        } else if (activeAdminMenu === 'tax' && canAccess('tax')) {
            document.getElementById('admin-menu-tax').style.display = 'block';
            renderTaxView();
        } else if (activeAdminMenu === 'manage-account' && canAccess('manage-account')) {
            document.getElementById('admin-menu-manage-account').style.display = 'block';
            renderSubAdmins();
        } else {
            if (!isSuperAdmin) {
                const firstPermittedMenu = appData.menuOrder.find(key => permissions[key]);
                if (firstPermittedMenu) {
                    activeAdminMenu = firstPermittedMenu;
                    renderAdminPanel();
                }
            }
        }
        document.getElementById('system-status-toggle').checked = appData.shopSettings.systemOpen;
    };

    // =================================================================================
    // ===== SPECIFIC ADMIN VIEW RENDERERS (Dashboard, Tax, Orders, etc.) =====
    // =================================================================================
    const renderDashboard = () => {
        const today = new Date(), currentMonth = today.getMonth(), currentYear = today.getFullYear();
        const ordersToday = appData.analytics.orders.filter(o => o.timestamp.startsWith(selectedDate) && o.status !== 'new');
        const ordersInMonth = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && new Date(o.timestamp).getMonth() === currentMonth && o.status !== 'new');
        const ordersInYear = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && o.status !== 'new');
        const monthlyProfit = ordersInMonth.reduce((sum, order) => sum + order.total, 0);
        const yearlySales = ordersInYear.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('monthly-profit').textContent = `${monthlyProfit.toLocaleString()} บาท`;
        document.getElementById('daily-orders').textContent = ordersToday.length;
        document.getElementById('monthly-orders').textContent = ordersInMonth.length;
        document.getElementById('yearly-sales').textContent = `${yearlySales.toLocaleString()} บาท`;
        renderLowStockList();
        renderTopItems('month');
    };
    
    const renderLowStockList = () => {
        const listEl = document.getElementById('low-stock-list');
        listEl.innerHTML = '';
        const threshold = appData.shopSettings.lowStockThreshold || 50;
        const lowStockItems = appData.products.filter(p => p.stock !== -1 && p.stock < threshold).sort((a, b) => a.stock - b.stock).slice(0, 10);
        if (lowStockItems.length === 0) {
            listEl.innerHTML = `<li>${translations[appData.shopSettings.language].noLowStockItems}</li>`;
            return;
        }
        lowStockItems.forEach((item) => {
            const li = document.createElement('li');
            if (item.stock < 20) li.className = 'blinking-warning';
            li.innerHTML = `<span>${item.name}</span><strong>${item.stock} ชิ้น</strong>`;
            listEl.appendChild(li);
        });
    };

    const renderTopItems = (period) => {
        const listEl = document.getElementById('top-items-list');
        listEl.innerHTML = '';
        const today = new Date();
        let ordersToAnalyze = [];
        if(period === 'day') ordersToAnalyze = appData.analytics.orders.filter(o => o.timestamp.startsWith(today.toISOString().slice(0, 10)) && o.status !== 'new');
        else if (period === 'month') ordersToAnalyze = appData.analytics.orders.filter(o => new Date(o.timestamp).getMonth() === today.getMonth() && new Date(o.timestamp).getFullYear() === today.getFullYear() && o.status !== 'new');
        else ordersToAnalyze = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === today.getFullYear() && o.status !== 'new');
        const itemCounts = {};
        ordersToAnalyze.forEach(order => {
            for(const prodId in order.items) {
                const product = appData.products.find(p => p.id == prodId);
                if(product){
                    if(!itemCounts[product.name]) itemCounts[product.name] = 0;
                    itemCounts[product.name] += order.items[prodId];
                }
            }
        });
        const sortedItems = Object.entries(itemCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
        if (sortedItems.length === 0) {
            listEl.innerHTML = '<li>ยังไม่มีข้อมูลการขาย</li>';
            return;
        }
        sortedItems.forEach(([name, quantity]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span><strong>${quantity.toLocaleString()} ชิ้น</strong>`;
            listEl.appendChild(li);
        });
    };
    
    const renderAdminCategories = () => {
        const list = document.getElementById('admin-cat-list');
        list.innerHTML = '';
        appData.categories.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cat.icon ? `<img src="${cat.icon}" alt="icon" style="width:24px; height:24px;">` : 'ไม่มี'}</td>
                <td>${cat.name}</td>
                <td>${cat.minOrderQuantity}</td>
                <td><button class="btn btn-info btn-small btn-price-settings" data-id="${cat.id}">ตั้งค่า</button></td>
                <td><button class="btn btn-secondary btn-small btn-cat-edit" data-id="${cat.id}">แก้ไข</button><button class="btn btn-danger btn-small btn-cat-delete" data-id="${cat.id}">ลบ</button></td>`;
            list.appendChild(row);
        });
    };
    
    const renderAdminProductTabs = () => {
        const tabsContainer = document.getElementById('admin-product-tabs');
        tabsContainer.innerHTML = '';
        appData.categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `tab ${cat.id === adminActiveCategoryId ? 'active' : ''}`;
            tab.dataset.id = cat.id;
            tab.textContent = cat.name;
            tabsContainer.appendChild(tab);
        });
    };

    const renderAdminProducts = () => {
        const list = document.getElementById('admin-prod-list');
        list.innerHTML = '';
        const lang = appData.shopSettings.language;
        const productsInCategory = appData.products.filter(p => p.categoryId === adminActiveCategoryId);
        const activeCategory = appData.categories.find(c => c.id === adminActiveCategoryId);
        document.getElementById('admin-current-category-name').textContent = activeCategory ? `${activeCategory.name}` : 'กรุณาเลือกหมวดหมู่';
        if (productsInCategory.length === 0) list.innerHTML = '<tr><td colspan="6">ยังไม่มีสินค้าในหมวดนี้</td></tr>';
        else {
            productsInCategory.forEach(prod => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${prod.icon ? `<img src="${prod.icon}" alt="${prod.name}">` : 'ไม่มี'}</td><td>${prod.name}</td><td>${prod.level}</td><td>${prod.stock === -1 ? '∞' : prod.stock}</td><td>${prod.isAvailable ? translations[lang].statusAvailable : translations[lang].statusUnavailable}</td><td><button class="btn btn-secondary btn-small btn-edit" data-id="${prod.id}">แก้ไข</button><button class="btn btn-danger btn-small btn-delete" data-id="${prod.id}">ลบ</button></td>`;
                list.appendChild(row);
            });
        }
    };
    
    const renderOrderNumberView = (dateRange = []) => {
        const newList = document.getElementById('new-orders-list');
        const activeList = document.getElementById('active-orders-list');
        const cancelledList = document.getElementById('cancelled-orders-list');
        newList.innerHTML = ''; activeList.innerHTML = ''; cancelledList.innerHTML = '';
        const lang = appData.shopSettings.language;
        let orders = [...appData.analytics.orders];
        if (dateRange.length > 0) {
            const start = dateRange[0].setHours(0,0,0,0);
            const end = dateRange.length === 2 ? dateRange[1].setHours(23,59,59,999) : new Date(start).setHours(23,59,59,999);
            orders = orders.filter(o => { const orderDate = new Date(o.timestamp).getTime(); return orderDate >= start && orderDate <= end; });
        }
        orders.reverse().forEach(order => {
            const date = new Date(order.timestamp);
            const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH')}`;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${order.id}</td><td>${formattedDate}</td><td>${order.total.toLocaleString()} บาท</td>`;
            const actionsCell = document.createElement('td');
            
            if (order.status === 'new') {
                actionsCell.innerHTML = `<button class="btn btn-success btn-small confirm-new-order" data-id="${order.id}">Confirm</button><button class="btn btn-danger btn-small cancel-new-order" data-id="${order.id}">Cancel</button>`;
                row.appendChild(actionsCell);
                newList.appendChild(row);
            } else if (order.status === 'active') {
                actionsCell.innerHTML = `<button class="btn btn-info btn-small view-order-details" data-id="${order.id}">${translations[lang].viewDetailsBtn}</button><button class="btn btn-danger btn-small cancel-active-order" data-id="${order.id}">${translations[lang].cancelOrderBtn}</button>`;
                row.appendChild(actionsCell);
                activeList.appendChild(row);
            } else { // cancelled
                actionsCell.innerHTML = `<button class="btn btn-info btn-small view-order-details" data-id="${order.id}">${translations[lang].viewDetailsBtn}</button>`;
                row.appendChild(actionsCell);
                cancelledList.appendChild(row);
            }
        });
    };

    const renderTaxView = () => {
        const currentYear = new Date().getFullYear();
        const ordersInYear = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && o.status !== 'new');
        const yearlySales = ordersInYear.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('tax-total-sales').value = yearlySales.toLocaleString();
        document.getElementById('tax-result-container').style.display = 'none';
    };

    const calculateTax = () => {
        const yearlySales = parseFloat(document.getElementById('tax-total-sales').value.replace(/,/g, '')) || 0;
        const otherIncome = parseFloat(document.getElementById('tax-other-income').value) || 0;
        const deductions = parseFloat(document.getElementById('tax-deduction').value) || 0;
        
        const totalIncome = yearlySales + otherIncome;
        const assessableIncome = totalIncome * 0.4;
        const netIncome = assessableIncome - deductions;

        if (netIncome <= 0) {
            document.getElementById('tax-net-income').textContent = `รายได้สุทธิ: ${netIncome.toLocaleString()} บาท (ไม่ต้องเสียภาษี)`;
            document.getElementById('tax-total-tax').textContent = `ภาษีที่ต้องชำระ: 0 บาท`;
            document.getElementById('tax-result-container').style.display = 'block';
            return;
        }

        let tax = 0;
        let incomeLeft = netIncome;

        const taxBrackets = [
            { limit: 5000000, rate: 0.35 }, { limit: 2000000, rate: 0.30 },
            { limit: 1000000, rate: 0.25 }, { limit: 750000, rate: 0.20 },
            { limit: 500000, rate: 0.15 }, { limit: 300000, rate: 0.10 },
            { limit: 150000, rate: 0.05 }, { limit: 0, rate: 0.00 }
        ];

        for (const bracket of taxBrackets) {
            if (incomeLeft > bracket.limit) {
                tax += (incomeLeft - bracket.limit) * bracket.rate;
                incomeLeft = bracket.limit;
            }
        }

        document.getElementById('tax-net-income').textContent = `รายได้สุทธิ (หลังหักค่าใช้จ่ายและลดหย่อน): ${netIncome.toLocaleString()} บาท`;
        document.getElementById('tax-total-tax').textContent = `ภาษีที่ต้องชำระ: ${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท`;
        document.getElementById('tax-result-container').style.display = 'block';
    };

    // =================================================================================
    // ===== EVENT LISTENERS =====
    // =================================================================================
    const addEventListeners = () => {
        // FIX: Use event delegation for main admin menu
        adminMenuContainer.addEventListener('click', (e) => {
            const menuBtn = e.target.closest('.menu-btn');
            if (menuBtn && menuBtn.dataset.menu) {
                activeAdminMenu = menuBtn.dataset.menu;
                renderAdminPanel();
            }
        });

        // FIX: Use event delegation for sub-menus
        document.getElementById('admin-settings-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && tab.dataset.sub) {
                activeAdminSubMenus.admin = tab.dataset.sub;
                renderAdminPanel();
            }
        });

        document.getElementById('admin-stock-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && tab.dataset.sub) {
                activeAdminSubMenus.stock = tab.dataset.sub;
                renderAdminPanel();
            }
        });
        
        document.getElementById('admin-order-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && tab.dataset.sub) {
                activeAdminSubMenus['order-number'] = tab.dataset.sub;
                renderAdminPanel();
            }
        });
        
        // FIX: Use event delegation for dynamically generated product category tabs
        document.getElementById('admin-product-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && tab.dataset.id) {
                adminActiveCategoryId = parseInt(tab.dataset.id);
                renderAdminProducts();
                renderAdminProductTabs(); // Re-render to update active state
            }
        });

        // FIX: Use event delegation for customer category tabs
        categoryTabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && tab.dataset.id) {
                activeCategoryId = parseInt(tab.dataset.id);
                searchBox.value = '';
                renderCustomerView();
            }
        });

        langToggleBtn.addEventListener('click', async () => {
            const newLang = appData.shopSettings.language === 'th' ? 'en' : 'th';
            setLanguage(newLang);
            await saveState();
        });

        themeToggleBtn.addEventListener('click', async () => {
            appData.shopSettings.darkMode = !appData.shopSettings.darkMode;
            applyTheme();
            await saveState();
        });

        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            renderProducts(searchTerm);
            if (searchTerm) categoryTabsContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            else renderCategoryTabs();
        });

        productTableBody.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-op]');
            if (button) {
                const productId = button.dataset.id;
                const operation = parseInt(button.dataset.op);
                let currentQuantity = appData.cart[productId] || 0;
                currentQuantity = Math.max(0, currentQuantity + operation);
                appData.cart[productId] = currentQuantity;
                const quantityDisplay = button.closest('tr').querySelector('.quantity-display');
                if (quantityDisplay) quantityDisplay.textContent = currentQuantity;
                checkOrderValidation();
            }
        });

        confirmOrderBtn.addEventListener('click', () => {
            if (confirmOrderBtn.disabled) return;
            document.getElementById('order-modal-title').textContent = 'สรุปออเดอร์';
            document.getElementById('order-modal-prompt').style.display = 'block';
            document.getElementById('copy-order-btn').style.display = 'inline-block';
            const orderNumber = generateOrderNumber();
            orderDetails.textContent = createOrderSummaryText(orderNumber);
            orderDetails.dataset.orderNumber = orderNumber;
            orderModal.style.display = 'flex';
        });

        viewOrderBtn.addEventListener('click', () => {
            cartDetails.textContent = createOrderSummaryText();
            cartModal.style.display = 'flex';
        });

        document.getElementById('copy-order-btn').addEventListener('click', async (e) => {
            const orderText = orderDetails.textContent;
            try {
                await navigator.clipboard.writeText(orderText);
                const totalOrderPriceText = orderText.match(/ยอดรวมทั้งหมด: ([\d,]+) บาท/);
                const totalOrderPrice = totalOrderPriceText ? parseFloat(totalOrderPriceText[1].replace(/,/g, '')) : 0;
                if (!isNaN(totalOrderPrice) && totalOrderPrice > 0) {
                    const newOrder = { id: orderDetails.dataset.orderNumber, timestamp: new Date().toISOString(), total: totalOrderPrice, items: { ...appData.cart }, status: 'new' };
                    appData.analytics.orders.push(newOrder);
                    for (const prodId in appData.cart) {
                        if (appData.cart[prodId] > 0) {
                            const product = appData.products.find(p => p.id == prodId);
                            if (product && product.stock !== -1) product.stock = Math.max(0, product.stock - appData.cart[prodId]);
                        }
                    }
                }
                appData.cart = {};
                await saveState();
                orderModal.style.display = 'none';
                const successModal = document.getElementById('copy-success-modal');
                successModal.style.display = 'flex';
                setTimeout(() => {
                    successModal.style.display = 'none';
                    renderCustomerView();
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
        
        document.getElementById('close-order-modal-btn').addEventListener('click', () => orderModal.style.display = 'none');
        document.getElementById('close-cart-modal-btn').addEventListener('click', () => cartModal.style.display = 'none');
        document.getElementById('reset-cart-btn').addEventListener('click', () => {
             if (confirm('คุณต้องการรีเซ็ทรายการสั่งซื้อทั้งหมดหรือไม่?')) {
                appData.cart = {};
                renderCustomerView();
            }
        });

        adminGearIcon.addEventListener('click', () => {
            if (!isAdminLoggedIn) {
                switchView('adminLogin');
                themeToggleBtn.style.display = 'none';
                langToggleBtn.style.display = 'none';
            }
        });

        document.getElementById('back-to-customer-view-btn').addEventListener('click', () => {
            switchView('customer');
            renderCustomerView();
        });
        
        document.getElementById('login-btn').addEventListener('click', async () => {
            const pinInput = document.getElementById('pin-input');
            const loginError = document.getElementById('login-error');
            const pin = pinInput.value;
            let loggedIn = false;
            if (pin === appData.adminPin) {
                isAdminLoggedIn = true;
                loggedInUser = { name: 'Super Admin', isSuper: true };
                loggedIn = true;
            } else {
                const subAdmin = appData.subAdmins.find(sa => sa.pin === pin);
                if (subAdmin) {
                    isAdminLoggedIn = true;
                    loggedInUser = subAdmin;
                    loggedIn = true;
                }
            }
            if (loggedIn) {
                switchView('adminPanel');
                renderAdminPanel();
                pinInput.value = '';
                loginError.textContent = '';
                adminGearIcon.style.display = 'none';
                backToAdminBtn.style.display = 'flex';
                themeToggleBtn.style.display = 'none';
                langToggleBtn.style.display = 'none';
                await saveState();
            } else {
                loginError.textContent = translations[appData.shopSettings.language].invalidPinError;
            }
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            isAdminLoggedIn = false;
            loggedInUser = null;
            switchView('customer');
            renderCustomerView();
        });
        
        document.getElementById('view-shop-btn').addEventListener('click', () => {
            switchView('customer');
            renderCustomerView();
        });

        backToAdminBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                switchView('adminPanel');
                renderAdminPanel();
            }
        });

        document.getElementById('save-shop-info-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.target);
            appData.shopSettings.shopName = document.getElementById('shop-name').value;
            appData.shopSettings.slogan = document.getElementById('shop-slogan').value;
            appData.shopSettings.managerName = document.getElementById('manager-name').value;
            appData.shopSettings.shareholderName = document.getElementById('shareholder-name').value;
            appData.shopSettings.orderNumberFormat = document.getElementById('order-format-select').value;
            await saveState();
            applyTheme();
        });

        ['global-font-size', 'shop-name-font-size', 'slogan-font-size'].forEach(id => {
            const slider = document.getElementById(`${id}-slider`);
            const valueDisplay = document.getElementById(`${id}-value`);
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
                const key = id.replace(/-/g, '_').replace(/_slider$/, '').replace(/_([a-z])/g, g => g[1].toUpperCase());
                appData.shopSettings[key] = slider.value;
                applyFontSizes();
            });
        });

        document.getElementById('save-system-fonts-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.target);
            appData.shopSettings.fontFamily = document.getElementById('shop-font').value;
            appData.shopSettings.globalFontFamily = document.getElementById('shop-global-font').value;
            appData.shopSettings.useLogo = document.getElementById('logo-toggle').checked;
            appData.shopSettings.shopNameEffect = {
                enabled: document.getElementById('effect-toggle').checked,
                offsetX: document.getElementById('effect-offset-x').value,
                offsetY: document.getElementById('effect-offset-y').value,
                blur: document.getElementById('effect-blur').value,
                color: document.getElementById('effect-color').value
            };
            if (logoFile) appData.shopSettings.logo = await readFileAsBase64(logoFile);
            appData.shopSettings.copyrightText = document.getElementById('copyright-text').value;
            appData.shopSettings.copyrightOpacity = document.getElementById('copyright-opacity').value;
            await saveState();
            applyTheme();
        });

        document.getElementById('save-festival-settings-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.target);
            const effects = appData.shopSettings.festivalEffects;
            effects.rain.enabled = document.getElementById('rain-effect-toggle').checked;
            effects.rain.intensity = document.getElementById('rain-intensity').value;
            effects.rain.opacity = document.getElementById('rain-opacity').value;
            effects.snow.enabled = document.getElementById('snow-effect-toggle').checked;
            effects.snow.intensity = document.getElementById('snow-intensity').value;
            effects.snow.opacity = document.getElementById('snow-opacity').value;
            await saveState();
            renderFestivalEffects();
        });

        document.getElementById('system-status-toggle').addEventListener('change', async (e) => {
            appData.shopSettings.systemOpen = e.target.checked;
            checkSystemStatus();
            await saveState();
        });
        document.getElementById('save-system-status-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.target);
            appData.shopSettings.maintenanceMessage = document.getElementById('maintenance-message-input').value;
            checkSystemStatus();
            await saveState();
        });

        document.getElementById('save-loading-bg-settings-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.target);
            appData.shopSettings.loadingBackgroundOpacity = document.getElementById('loading-bg-opacity').value;
            appData.shopSettings.loadingBarStyle = document.getElementById('loading-bar-style-select').value;
            if (loadingBgFile) appData.shopSettings.loadingBackgroundImage = await readFileAsBase64(loadingBgFile);
            await saveState();
            applyLoadingBackground();
        });
        
        document.getElementById('calculate-tax-btn').addEventListener('click', calculateTax);
        
        document.getElementById('admin-menu-order-number').addEventListener('click', async (e) => {
            const target = e.target;
            const orderId = target.dataset.id;
            if (!orderId) return;

            if (target.classList.contains('confirm-new-order')) {
                const order = appData.analytics.orders.find(o => o.id === orderId);
                if (order) {
                    order.status = 'active';
                    await saveState();
                    renderOrderNumberView(orderDatePicker.selectedDates);
                }
            } else if (target.classList.contains('cancel-new-order')) {
                if (confirm(`คุณต้องการลบออเดอร์ ${orderId} ทิ้งถาวรใช่หรือไม่?`)) {
                    appData.analytics.orders = appData.analytics.orders.filter(o => o.id !== orderId);
                    await saveState();
                    renderOrderNumberView(orderDatePicker.selectedDates);
                }
            } else if (target.classList.contains('cancel-active-order')) {
                const order = appData.analytics.orders.find(o => o.id === orderId);
                if (order && confirm(`คุณต้องการยกเลิกออเดอร์ ${orderId} ใช่หรือไม่?`)) {
                    order.status = 'cancelled';
                    await saveState();
                    renderOrderNumberView(orderDatePicker.selectedDates);
                }
            } else if (target.classList.contains('view-order-details')) {
                viewOrderDetails(orderId);
            }
        });
        
        document.getElementById('admin-cat-list').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if(!target) return;
            const id = parseInt(target.dataset.id);

            if (target.classList.contains('btn-price-settings')) {
                renderPriceSettingsModal(id);
            } else if (target.classList.contains('btn-cat-edit')) {
                const category = appData.categories.find(c => c.id === id);
                if (category) {
                    editingCategoryId = id;
                    document.getElementById('cat-name').value = category.name;
                    document.getElementById('cat-min-order').value = category.minOrderQuantity;
                    document.getElementById('submit-cat-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                    document.getElementById('cancel-cat-edit-btn').style.display = 'inline-block';
                }
            } else if (target.classList.contains('btn-cat-delete')) {
                deleteCategory(id);
            }
        });

        document.getElementById('save-price-settings-btn').addEventListener('click', async () => {
            const category = appData.categories.find(c => c.id === editingCategoryId);
            if(category) {
                const newPrices = [];
                document.getElementById('per-piece-price-form').querySelectorAll('input').forEach(input => {
                    const quantity = parseInt(input.dataset.quantity);
                    const price = parseInt(input.value);
                    if (!isNaN(price) && price > 0) newPrices.push({ quantity, price });
                });
                category.perPiecePrices = newPrices;
                await saveState();
                renderAdminCategories();
                document.getElementById('price-settings-modal').style.display = 'none';
            }
        });
        document.getElementById('close-price-settings-modal-btn').addEventListener('click', () => {
            document.getElementById('price-settings-modal').style.display = 'none';
        });

        document.getElementById('submit-cat-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            showSaveFeedback(e.target);
            const name = document.getElementById('cat-name').value.trim();
            const minOrder = parseInt(document.getElementById('cat-min-order').value) || 0;
            if (!name) { alert('กรุณากรอกชื่อหมวดหมู่'); return; }
            let iconData = null;
            if (catIconFile) iconData = await readFileAsBase64(catIconFile);
            if (editingCategoryId) {
                const index = appData.categories.findIndex(c => c.id === editingCategoryId);
                if (index !== -1) {
                    appData.categories[index].name = name;
                    appData.categories[index].minOrderQuantity = minOrder;
                    if (iconData) appData.categories[index].icon = iconData;
                }
            } else appData.categories.push({ id: generateId(), name, icon: iconData, perPiecePrices: [], minOrderQuantity: minOrder });
            await saveState();
            resetCategoryForm();
            renderAdminPanel();
        });
    };
    
    const renderPriceSettingsModal = (categoryId) => {
        const category = appData.categories.find(c => c.id === categoryId);
        if (!category) return;
        editingCategoryId = categoryId;
        const modal = document.getElementById('price-settings-modal');
        document.getElementById('price-settings-category-name').textContent = category.name;
        const form = document.getElementById('per-piece-price-form');
        form.innerHTML = '';
        const prices = category.perPiecePrices || [];
        for (let i = 10; i <= 1000; i += 10) {
            const priceItem = prices.find(p => p.quantity === i);
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `<label>${i} ชิ้น: <input type="number" data-quantity="${i}" value="${priceItem ? priceItem.price : ''}" placeholder="ราคา (บาท)"></label>`;
            form.appendChild(div);
        }
        modal.style.display = 'flex';
    };

    const deleteCategory = async (id) => {
        if (confirm('การลบหมวดหมู่จะลบสินค้าทั้งหมดในหมวดหมู่นั้นด้วย ยืนยันหรือไม่?')) {
            appData.categories = appData.categories.filter(c => c.id !== id);
            appData.products = appData.products.filter(p => p.categoryId !== id);
            await saveState();
            renderAdminPanel();
        }
    };
    const resetCategoryForm = () => {
        editingCategoryId = null;
        document.getElementById('category-form').reset();
    };

    // =================================================================================
    // ===== INITIALIZATION =====
    // =================================================================================
    const checkSystemStatus = () => {
        const maintenanceOverlay = document.getElementById('maintenance-overlay');
        if (appData.shopSettings.systemOpen) {
            maintenanceOverlay.classList.remove('active');
        } else {
            document.getElementById('maintenance-shop-name').textContent = appData.shopSettings.shopName;
            document.getElementById('maintenance-message').textContent = appData.shopSettings.maintenanceMessage;
            maintenanceOverlay.classList.add('active');
        }
    };

    const init = async () => {
        applyLoadingBackground();
        await loadState();
        checkSystemStatus();
        if (!appData.shopSettings.systemOpen) {
             document.getElementById('loader-overlay').style.display = 'none';
             return;
        }
        
        if (appData.categories.length > 0) {
            if (!appData.categories.find(c => c.id === activeCategoryId)) activeCategoryId = appData.categories[0].id;
            adminActiveCategoryId = activeCategoryId;
        } else { activeCategoryId = null; adminActiveCategoryId = null; }
        
        populateFontSelectors();
        addEventListeners();
        renderCustomerView();
        document.getElementById('loader-overlay').style.display = 'none';
    };

    const populateFontSelectors = () => {
        const fontSelect = document.getElementById('shop-font');
        const globalFontSelect = document.getElementById('shop-global-font');
        fontSelect.innerHTML = ''; globalFontSelect.innerHTML = '';
        FONT_OPTIONS.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            fontSelect.appendChild(option.cloneNode(true));
            globalFontSelect.appendChild(option.cloneNode(true));
        });
    };

    const viewOrderDetails = (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if (!order) return;
        const originalCart = { ...appData.cart };
        appData.cart = order.items;
        orderDetails.textContent = createOrderSummaryText(order.id);
        appData.cart = originalCart;
        document.getElementById('order-modal-title').textContent = 'รายละเอียดออเดอร์';
        document.getElementById('order-modal-prompt').style.display = 'none';
        document.getElementById('copy-order-btn').style.display = 'none';
        orderModal.style.display = 'flex';
    };

    const generateOrderNumber = () => {
        const format = appData.shopSettings.orderNumberFormat;
        const counters = appData.shopSettings.orderNumberCounters;
        const now = new Date();
        let num = counters[format] || 1;
        counters[format] = num + 1;
        const pad = (n, width) => n.toString().padStart(width, '0');
        switch(format) {
            case 'format1': return `WHD${(now.getFullYear() + 543).toString().slice(-2)}/${pad(now.getMonth() + 1, 2)}/${pad(num, 4)}`;
            case 'format2': return `WHD-${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}-${pad(num, 4)}`;
            default: return `WHD-${Math.floor(Math.random() * 90000) + 10000}`;
        }
    };
    
    init();
});
