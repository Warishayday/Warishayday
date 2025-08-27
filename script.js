document.addEventListener('DOMContentLoaded', () => {
    const API_ENDPOINT = '/.netlify/functions/data';

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
            globalFontSize: 16, // NEW
            shopNameFontSize: 2.5, // NEW
            sloganFontSize: 1.2, // NEW
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
            loadingBarStyle: '1', // NEW
            language: 'th',
            lowStockThreshold: 50,
            copyrightText: "Copyright © 2025 Warishayday",
            copyrightOpacity: 1,
            shopEnabled: true, // NEW
            shopClosedMessage: "ร้านปิดปรับปรุงชั่วคราว", // NEW
            festival: { // NEW
                rain: { enabled: false, intensity: 20, opacity: 0.5 },
                snow: { enabled: false, intensity: 20, opacity: 0.5 },
                fireworks: { enabled: false, intensity: 1, opacity: 0.8 }
            }
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
            'admin', 'festival', 'stock', 'order-number', 'dashboard', 'manage-account'
        ]
    };

    const FONT_OPTIONS = [
        { name: "Kanit", value: "'Kanit', sans-serif" },
        { name: "Chakra Petch", value: "'Chakra Petch', sans-serif" },
        { name: "IBM Plex Sans Thai", value: "'IBM Plex Sans Thai', sans-serif" },
        { name: "Sarabun", value: "'Sarabun', sans-serif" },
        { name: "Prompt", value: "'Prompt', sans-serif" },
        { name: "Mali", value: "'Mali', sans-serif" },
        { name: "Anuphan", value: "'Anuphan', sans-serif" },
        { name: "Taviraj", value: "'Taviraj', serif" },
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
            menuAdmin: "ตั้งค่าร้าน", menuFestival: "Festival", menuStock: "สต๊อกสินค้า", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage account", editMenuOrderBtn: "EDIT",
            
            shopInfoTitle: "ข้อมูลร้าน",
            systemFontsTitle: "System Fonts",
            fontPreviewText: "ตัวอย่างฟอนต์ระบบ",
            shopNameLabel: "ชื่อร้านค้า", shopSloganLabel: "สโลแกนร้าน", 
            managerNameLabel: "ชื่อผู้จัดการระบบ",
            shareholderNameLabel: "ชื่อผู้ถือหุ้นใหญ่",
            globalFontLabel: "ฟอนต์ระบบทั้งหมด", shopNameFontLabel: "ฟอนต์ชื่อร้าน",
            globalFontSizeLabel: "ขนาดฟอนต์ทั้งระบบ", shopNameFontSizeLabel: "ขนาดฟอนต์ชื่อร้าน", sloganFontSizeLabel: "ขนาดฟอนต์สโลแกน",
            enableEffectLabel: "เปิดใช้เอฟเฟกต์ชื่อร้าน", effectOffsetX: "เงาแนวนอน (X)", effectOffsetY: "เงาแนวตั้ง (Y)", effectBlur: "ความเบลอ", effectColor: "สีเงา",
            orderFormatLabel: "รูปแบบเลขที่ออเดอร์", useLogoLabel: "ใช้โลโก้", uploadLogoLabel: "อัปโหลดโลโก้ (PNG)",
            backgroundSettingsTitle: "ตั้งค่าพื้นหลัง", uploadBgLabel: "อัปโหลดภาพพื้นหลัง", bgOpacityLabel: "ความโปร่งใส (จาง-ชัด)", bgBlurLabel: "ความเบลอ (น้อย-มาก)",
            removeBgBtn: "ลบพื้นหลัง", previewBgBtn: "ดูตัวอย่าง", themeColorLabel: "ธีมสี (Theme)", saveSettingsBtn: "บันทึกการตั้งค่า",
            copyrightTextLabel: "ข้อความ Copyright",
            copyrightOpacityLabel: "ความคมชัด",

            changePinTitle: "เปลี่ยนรหัสผ่าน", newPinLabel: "PIN ใหม่", saveNewPinBtn: "บันทึก PIN ใหม่",
            manageCategoriesTitle: "จัดการหมวดหมู่", categoryNameLabel: "ชื่อหมวดหมู่", categoryIconLabel: "ไอค่อนหมวดหมู่ (ไฟล์ PNG)", minOrderLabel: "จำนวนสั่งซื้อขั้นต่ำ",
            setPriceLabel: "ตั้งค่าราคา", setPerPiecePriceBtn: "ตั้งราคาต่อชิ้น", saveCategoryBtn: "เพิ่ม/บันทึกหมวดหมู่", categoryListTitle: "รายการหมวดหมู่",
            tableHeaderIcon: "ไอค่อน", tableHeaderName: "ชื่อ", tableHeaderMinOrder: "ขั้นต่ำ", tableHeaderPrice: "ราคา",
            manageProductsTitle: "จัดการสินค้า", productNameLabel: "ชื่อสินค้า", levelLabel: "เลเวล", stockQuantityLabel: "จำนวนคงเหลือ", categoryLabel: "หมวดหมู่",
            productIconLabel: "ไอค่อนสินค้า (ไฟล์ PNG)", productAvailableLabel: "เปิดขายสินค้านี้", saveProductBtn: "บันทึกสินค้า", cancelEditBtn: "ยกเลิกแก้ไข",
            tableHeaderStock: "คงเหลือ", tableHeaderStatus: "สถานะ", statusAvailable: "เปิดขาย", statusUnavailable: "ปิดขาย",
            selectDateLabel: "เลือกวันที่:", resetDataBtn: "รีเซ็ทข้อมูล", 
            confirmOrdersTitle: "คอนเฟิร์มออเดอร์", activeOrdersTitle: "รายการออเดอร์ปัจจุบัน", cancelledOrdersTitle: "รายการออเดอร์ที่ถูกยกเลิก",
            tableHeaderOrderNo: "เลขออเดอร์", tableHeaderDateTime: "วันที่/เวลา", tableHeaderTotal: "ยอดรวม", viewDetailsBtn: "ดูรายละเอียด", cancelOrderBtn: "ยกเลิก",
            dashboardTitle: "ภาพรวมร้านค้า", monthlyProfitTitle: "กำไรเดือนนี้", dailyOrdersTitle: "ยอดออเดอร์วันนี้", monthlyOrdersTitle: "ยอดออเดอร์เดือนนี้", yearlySalesTitle: "ยอดขายรวม (ปีนี้)",
            lowStockTitle: "สินค้าที่ต้องเติม (10 อันดับ)", lowStockThresholdLabel: "แจ้งเตือนเมื่อเหลือน้อยกว่า:", lowStockInfo: "รบกวนเติมสินค้าสำหรับรายการที่มีไฟกระพริบ",
            noLowStockItems: "ไม่มีสินค้าใกล้หมด", categorySalesTitle: "ยอดขายตามหมวดหมู่", topSellingTitle: "สินค้าขายดี (Top 5)",
            periodDay: "วันนี้", periodMonth: "เดือนนี้", periodYear: "ปีนี้", trafficStatsTitle: "สถิติการเข้าใช้งาน", productStatsTitle: "สถิติสินค้า (ตามจำนวนที่สั่ง)",
            manageAccountTitle: "จัดการบัญชี", subAdminLimitInfo: "จำกัดจำนวนผู้ใช้ย่อยได้สูงสุด 20 คน", usernameLabel: "ชื่อผู้ใช้", addUserBtn: "เพิ่มผู้ใช้", subAdminListTitle: "รายการผู้ใช้ย่อย",
            orderSummaryTitle: "สรุปออเดอร์", copyOrderPrompt: "กรุณาคัดลอกข้อความด้านล่างเพื่อส่งให้ทางร้าน", copyOrderBtn: "คัดลอกออเดอร์", copySuccessMessage: "คัดลอกออเดอร์สำเร็จ",
            yourOrderListTitle: "รายการสั่งซื้อของคุณ", confirmPinTitle: "ยืนยันรหัส PIN", enterPinPrompt: "กรอกรหัส PIN เพื่อยืนยัน",
            confirmResetTitle: "ยืนยันการรีเซ็ทข้อมูล", selectResetPeriodPrompt: "กรุณาเลือกช่วงเวลาที่ต้องการรีเซ็ทข้อมูล", periodWeek: "สัปดาห์นี้", periodAll: "ข้อมูลทั้งหมด",
            setPerPiecePriceTitle: "ตั้งราคาต่อชิ้น", setPerPiecePriceInfo: "กำหนดราคาสำหรับทุกๆ 10 ชิ้น", savePriceBtn: "บันทึกราคา",
            reorderMenuTitle: "จัดเรียงเมนู", reorderMenuInfo: "ลากและวางเพื่อจัดลำดับเมนูตามต้องการ", saveOrderBtn: "บันทึกการจัดเรียง",
            setPermissionsTitle: "ตั้งค่าสิทธิ์การเข้าถึง", savePermissionsBtn: "บันทึกสิทธิ์",
            loadingBackgroundTitle: "พื้นหลัง Loading", uploadLoadingBgLabel: "อัปโหลดภาพพื้นหลัง Loading", loadingBarStyleLabel: "รูปแบบแถบดาวน์โหลด",
            priceDetailsTitle: "รายละเอียดราคา", viewPriceBtn: "ดูราคา",
            festivalTitle: "Festival Effects", shopStatusLabel: "เปิดร้าน", shopClosedMessageLabel: "ข้อความเมื่อปิดร้าน",
            rainEffectLabel: "เอฟเฟกต์ฝนตก", rainIntensityLabel: "ความหนัก", effectOpacityLabel: "ความชัด",
            snowEffectLabel: "เอฟเฟกต์หิมะตก", snowIntensityLabel: "ความหนัก",
            fireworksEffectLabel: "เอฟเฟกต์พลุ", fireworksIntensityLabel: "ความถี่ (นาที)",
            saveSuccessMessage: "บันทึกสำเร็จ!",
        },
        en: {
            loadingMessage: "Loading latest data...",
            closeBtn: "Close", cancelBtn: "Cancel", confirmBtn: "Confirm", saveBtn: "Save", editBtn: "Edit", deleteBtn: "Delete",
            searchPlaceholder: "Search for items...", itemsListTitle: "Item List", tableHeaderItem: "Item", tableHeaderLevel: "Level", tableHeaderQuantity: "Quantity", tableHeaderManage: "Manage",
            viewOrderBtn: "View Order", confirmOrderBtn: "Confirm Order", totalAmount: "Total",
            adminLoginTitle: "Admin Login", pinLabel: "PIN", loginBtn: "Login", backToShopBtn: "Back to Shop", invalidPinError: "Invalid PIN!",
            adminPanelTitle: "Admin Panel", viewShopBtn: "View Shop", logoutBtn: "Logout",
            menuAdmin: "Shop Settings", menuFestival: "Festival", menuStock: "Stock", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage Account", editMenuOrderBtn: "EDIT",
            
            shopInfoTitle: "Shop Information",
            systemFontsTitle: "System Fonts",
            fontPreviewText: "System Font Preview",
            shopNameLabel: "Shop Name", shopSloganLabel: "Shop Slogan",
            managerNameLabel: "System Manager Name",
            shareholderNameLabel: "Major Shareholder Name",
            globalFontLabel: "Global Font", shopNameFontLabel: "Shop Name Font",
            globalFontSizeLabel: "Global Font Size", shopNameFontSizeLabel: "Shop Name Font Size", sloganFontSizeLabel: "Slogan Font Size",
            enableEffectLabel: "Enable Shop Name Effect", effectOffsetX: "Offset X", effectOffsetY: "Offset Y", effectBlur: "Blur", effectColor: "Color",
            orderFormatLabel: "Order Number Format", useLogoLabel: "Use Logo", uploadLogoLabel: "Upload Logo (PNG)",
            backgroundSettingsTitle: "Background Settings", uploadBgLabel: "Upload Background Image", bgOpacityLabel: "Opacity (Faint-Clear)", bgBlurLabel: "Blur (Less-More)",
            removeBgBtn: "Remove Background", previewBgBtn: "Preview", themeColorLabel: "Theme Color", saveSettingsBtn: "Save Settings",
            copyrightTextLabel: "Copyright Text",
            copyrightOpacityLabel: "Opacity",

            changePinTitle: "Change PIN", newPinLabel: "New PIN", saveNewPinBtn: "Save New PIN",
            manageCategoriesTitle: "Manage Categories", categoryNameLabel: "Category Name", categoryIconLabel: "Category Icon (PNG)", minOrderLabel: "Minimum Order Quantity",
            setPriceLabel: "Set Prices", setPerPiecePriceBtn: "Set Per-Piece Price", saveCategoryBtn: "Add/Save Category", categoryListTitle: "Category List",
            tableHeaderIcon: "Icon", tableHeaderName: "Name", tableHeaderMinOrder: "Min. Qty", tableHeaderPrice: "Price",
            manageProductsTitle: "Manage Products", productNameLabel: "Product Name", levelLabel: "Level", stockQuantityLabel: "Stock Quantity", categoryLabel: "Category",
            productIconLabel: "Product Icon (PNG)", productAvailableLabel: "This product is available", saveProductBtn: "Save Product", cancelEditBtn: "Cancel Edit",
            tableHeaderStock: "Stock", tableHeaderStatus: "Status", statusAvailable: "Available", statusUnavailable: "Unavailable",
            selectDateLabel: "Select Date:", resetDataBtn: "Reset Data", 
            confirmOrdersTitle: "Confirm Orders", activeOrdersTitle: "Active Orders", cancelledOrdersTitle: "Cancelled Orders",
            tableHeaderOrderNo: "Order No.", tableHeaderDateTime: "Date/Time", tableHeaderTotal: "Total", viewDetailsBtn: "Details", cancelOrderBtn: "Cancel",
            dashboardTitle: "Dashboard", monthlyProfitTitle: "This Month's Profit", dailyOrdersTitle: "Today's Orders", monthlyOrdersTitle: "This Month's Orders", yearlySalesTitle: "This Year's Sales",
            lowStockTitle: "Low Stock Items (Top 10)", lowStockThresholdLabel: "Alert when stock is less than:", lowStockInfo: "Please restock items with a blinking light.",
            noLowStockItems: "No items are low on stock", categorySalesTitle: "Sales by Category", topSellingTitle: "Top 5 Selling Items",
            periodDay: "Today", periodMonth: "This Month", periodYear: "This Year", trafficStatsTitle: "Traffic Statistics", productStatsTitle: "Product Statistics (by quantity)",
            manageAccountTitle: "Manage Accounts", subAdminLimitInfo: "Sub-admin limit is 20 users.", usernameLabel: "Username", addUserBtn: "Add User", subAdminListTitle: "Sub-Admin List",
            orderSummaryTitle: "Order Summary", copyOrderPrompt: "Please copy the text below to send to the shop.", copyOrderBtn: "Copy Order", copySuccessMessage: "Order copied successfully",
            yourOrderListTitle: "Your Order List", confirmPinTitle: "Confirm PIN", enterPinPrompt: "Enter PIN to confirm",
            confirmResetTitle: "Confirm Data Reset", selectResetPeriodPrompt: "Please select the period for data reset.", periodWeek: "This Week", periodAll: "All Data",
            setPerPiecePriceTitle: "Set Per-Piece Price", setPerPiecePriceInfo: "Set the price for every 10 pieces.", savePriceBtn: "Save Prices",
            reorderMenuTitle: "Reorder Menu", reorderMenuInfo: "Drag and drop to reorder the menu.", saveOrderBtn: "Save Order",
            setPermissionsTitle: "Set Permissions", savePermissionsBtn: "Save Permissions",
            loadingBackgroundTitle: "Loading Background", uploadLoadingBgLabel: "Upload Loading Background", loadingBarStyleLabel: "Loading Bar Style",
            priceDetailsTitle: "Price Details", viewPriceBtn: "View Prices",
            festivalTitle: "Festival Effects", shopStatusLabel: "Shop Open", shopClosedMessageLabel: "Shop Closed Message",
            rainEffectLabel: "Rain Effect", rainIntensityLabel: "Intensity", effectOpacityLabel: "Opacity",
            snowEffectLabel: "Snow Effect", snowIntensityLabel: "Intensity",
            fireworksEffectLabel: "Fireworks Effect", fireworksIntensityLabel: "Frequency (min)",
            saveSuccessMessage: "Saved!",
        }
    };

    const MENU_NAMES = {
        'admin': 'menuAdmin',
        'festival': 'menuFestival',
        'stock': 'menuStock',
        'order-number': 'menuOrderNumber',
        'dashboard': 'menuDashboard',
        'manage-account': 'menuManageAccount'
    };
    
    const SUB_MENUS = {
        'admin': { 
            'shop-info': 'shopInfoTitle', 
            'system-fonts': 'systemFontsTitle',
            'background': 'backgroundSettingsTitle', 
            'loading-bg': 'loadingBackgroundTitle', 
            'pin': 'changePinTitle' 
        },
        'stock': { 'categories': 'manageCategoriesTitle', 'products': 'manageProductsTitle' },
        'order-number': { 'confirm-orders': 'confirmOrdersTitle', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' }
    };

    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const showSaveFeedback = (buttonElement) => {
        const originalText = buttonElement.textContent;
        const lang = appData.shopSettings.language;
        buttonElement.textContent = translations[lang].saveSuccessMessage;
        buttonElement.disabled = true;
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.disabled = false;
        }, 1500);
    };

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
                    globalFontFamily: "'Kanit', sans-serif", globalFontSize: 16, shopNameFontSize: 2.5, sloganFontSize: 1.2, logo: null, useLogo: false, darkMode: false,
                    orderNumberFormat: 'format1', orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
                    shopNameEffect: { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: '#000000' },
                    backgroundImage: null, backgroundOpacity: 1, backgroundBlur: 0, 
                    loadingBackgroundImage: null, loadingBackgroundOpacity: 0.7, loadingBarStyle: '1',
                    language: 'th', lowStockThreshold: 50,
                    copyrightText: "Copyright © 2025 Warishayday", copyrightOpacity: 1,
                    shopEnabled: true, shopClosedMessage: "ร้านปิดปรับปรุงชั่วคราว",
                    festival: { rain: { enabled: false, intensity: 20, opacity: 0.5 }, snow: { enabled: false, intensity: 20, opacity: 0.5 }, fireworks: { enabled: false, intensity: 1, opacity: 0.8 } }
                },
                analytics: { dailyTraffic: Array(7).fill(0), hourlyTraffic: Array(24).fill(0), productSales: {}, orders: [], totalSales: 0, monthlyProfit: 0 },
                subAdmins: [],
                menuOrder: ['admin', 'festival', 'stock', 'order-number', 'dashboard', 'manage-account'],
                categories: [], products: [],
            };
            appData = { ...defaultAppData, ...serverData };
            appData.shopSettings = {...defaultAppData.shopSettings, ...appData.shopSettings};
            appData.shopSettings.festival = {...defaultAppData.shopSettings.festival, ...appData.shopSettings.festival};
            appData.analytics.orders = appData.analytics.orders || [];
            appData.analytics.orders.forEach(o => { if(!o.status) o.status = 'active'; });
            appData.categories.forEach(cat => { if (cat.minOrderQuantity === undefined) cat.minOrderQuantity = 30; });
            appData.products.forEach(prod => {
                if (prod.isAvailable === undefined) prod.isAvailable = true;
                if (prod.stock === undefined) prod.stock = -1;
            });
            const validMenus = new Set(defaultAppData.menuOrder);
            appData.menuOrder = (appData.menuOrder || defaultAppData.menuOrder).filter(item => validMenus.has(item));
            if (!appData.menuOrder.includes('festival')) {
                appData.menuOrder.splice(1, 0, 'festival');
            }
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

    const views = {
        customer: document.getElementById('customer-view'),
        adminLogin: document.getElementById('admin-login-view'),
        adminPanel: document.getElementById('admin-panel-view'),
    };
    const shopNameDisplay = document.getElementById('shop-name-display');
    const shopLogoDisplay = document.getElementById('shop-logo-display');
    const headerTitleContainer = document.getElementById('header-title-container');
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
    const festivalCanvas = document.getElementById('festival-canvas');
    const festivalCtx = festivalCanvas.getContext('2d');
    
    let activeAdminMenu = 'admin';
    let activeAdminSubMenus = { admin: 'shop-info', stock: 'categories', 'order-number': 'confirm-orders' };
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

    langToggleBtn.addEventListener('click', async () => {
        const newLang = appData.shopSettings.language === 'th' ? 'en' : 'th';
        setLanguage(newLang);
        await saveState();
    });

    const applyBackground = () => {
        const bgOverlay = document.getElementById('background-overlay');
        if (appData.shopSettings.backgroundImage) {
            bgOverlay.style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
            bgOverlay.style.opacity = appData.shopSettings.backgroundOpacity;
            bgOverlay.style.filter = `blur(${appData.shopSettings.backgroundBlur}px)`;
        } else {
            bgOverlay.style.backgroundImage = 'none';
            bgOverlay.style.opacity = 1;
            bgOverlay.style.filter = 'none';
        }
    };

    const applyLoadingBackground = () => {
        const loaderBg = document.getElementById('loader-background');
        const loaderOverlay = document.getElementById('loader-overlay');
        const progressBar = document.getElementById('progress-bar-container');
        if (appData.shopSettings.loadingBackgroundImage) {
            loaderBg.style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
            loaderOverlay.style.backgroundColor = `rgba(0, 0, 0, ${appData.shopSettings.loadingBackgroundOpacity})`;
        } else {
            loaderBg.style.backgroundImage = 'none';
            loaderOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
        progressBar.className = `progress-bar style-${appData.shopSettings.loadingBarStyle}`;
    };

    const applyTheme = () => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', appData.shopSettings.themeColor);
        root.style.setProperty('--global-font', appData.shopSettings.globalFontFamily);
        root.style.setProperty('--global-font-size', `${appData.shopSettings.globalFontSize}px`);
        root.style.setProperty('--shop-name-font-size', `${appData.shopSettings.shopNameFontSize}rem`);
        root.style.setProperty('--slogan-font-size', `${appData.shopSettings.sloganFontSize}rem`);
        
        shopNameDisplay.style.fontFamily = appData.shopSettings.fontFamily;
        shopNameDisplay.textContent = appData.shopSettings.shopName;
        sloganElement.textContent = appData.shopSettings.slogan;
        
        const effect = appData.shopSettings.shopNameEffect;
        shopNameDisplay.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : '1px 1px 2px rgba(0,0,0,0.1)';
        
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

        applyBackground();
        applyLoadingBackground();
        setLanguage(appData.shopSettings.language);
        updateShopStatusView();
        initFestivalEffects();
    };
    
    themeToggleBtn.addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.darkMode = !appData.shopSettings.darkMode;
        applyTheme();
        await saveState();
    });

    const updateShopStatusView = () => {
        const overlay = document.getElementById('shop-closed-overlay');
        if (!appData.shopSettings.shopEnabled) {
            document.getElementById('shop-closed-message').textContent = appData.shopSettings.shopClosedMessage;
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    };

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
            tab.addEventListener('click', () => {
                activeCategoryId = cat.id;
                searchBox.value = '';
                renderCustomerView();
            });
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

    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        renderProducts(searchTerm);
        if (searchTerm) categoryTabsContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        else renderCategoryTabs();
    });

    const calculatePrice = (categoryId, quantity) => {
        const category = appData.categories.find(c => c.id === categoryId);
        if (!category) return { price: 0, type: 'ไม่มีราคา' };
        let totalPrice = 0, priceType = '';
        if (category.bulkPrices && category.bulkPrices.length > 0) {
            const sortedBulkPrices = category.bulkPrices.sort((a, b) => b.min - a.min);
            for (const range of sortedBulkPrices) {
                if (quantity >= range.min && quantity <= range.max) {
                    return { price: range.price, type: `ราคาเหมา: ${range.min}-${range.max} ชิ้น` };
                }
            }
        }
        if (category.perPiecePrices && category.perPiecePrices.length > 0) {
            const sortedPerPiecePrices = category.perPiecePrices.sort((a, b) => b.quantity - a.quantity);
            let remainingQuantity = quantity;
            for (const priceItem of sortedPerPiecePrices) {
                if (remainingQuantity >= priceItem.quantity && priceItem.price > 0) {
                    const numBlocks = Math.floor(remainingQuantity / priceItem.quantity);
                    totalPrice += numBlocks * priceItem.price;
                    priceType += `${numBlocks} x ${priceItem.quantity} ชิ้น`;
                    remainingQuantity %= priceItem.quantity;
                    if (remainingQuantity > 0 && remainingQuantity < sortedPerPiecePrices[0].quantity) {
                         priceType += ` (เหลือ ${remainingQuantity} ชิ้น)`;
                         break;
                    } else if (remainingQuantity > 0) priceType += ' + ';
                }
            }
            if (totalPrice > 0) return { price: totalPrice, type: priceType.replace(/\s\+\s$/, '') };
        }
        return { price: 0, type: 'ไม่ได้ตั้งราคา' };
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

    orderValidationMsg.addEventListener('click', (e) => {
        const link = e.target.closest('.validation-link');
        if (link) {
            activeCategoryId = parseInt(link.dataset.catId);
            renderCustomerView();
            const tab = document.querySelector(`.tab[data-id="${activeCategoryId}"]`);
            if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
    
    const handleOrderAction = (isConfirm) => {
        if (isConfirm) {
            checkOrderValidation(); 
            if (orderValidationMsg.innerHTML.includes('ต้องสั่งขั้นต่ำ') || confirmOrderBtn.disabled) return;
        }
        if (isConfirm) {
            document.getElementById('order-modal-title').textContent = 'สรุปออเดอร์';
            document.getElementById('order-modal-prompt').style.display = 'block';
            document.getElementById('copy-order-btn').style.display = 'inline-block';
            const orderNumber = generateOrderNumber();
            orderDetails.textContent = createOrderSummaryText(orderNumber);
            orderDetails.dataset.orderNumber = orderNumber;
            orderModal.style.display = 'flex';
        } else {
            cartDetails.textContent = createOrderSummaryText();
            cartModal.style.display = 'flex';
        }
    };

    confirmOrderBtn.addEventListener('click', () => handleOrderAction(true));
    viewOrderBtn.addEventListener('click', () => handleOrderAction(false));

    document.getElementById('copy-order-btn').addEventListener('click', async () => {
        orderModal.style.display = 'none';
        const successModal = document.getElementById('copy-success-modal');
        successModal.style.display = 'flex';
        
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
                        if (product) {
                            if (!appData.analytics.productSales[product.name]) appData.analytics.productSales[product.name] = 0;
                            appData.analytics.productSales[product.name] += appData.cart[prodId];
                            if (product.stock !== -1) product.stock = Math.max(0, product.stock - appData.cart[prodId]);
                        }
                    }
                }
            }
            appData.cart = {};
            await saveState();
            setTimeout(() => {
                successModal.style.display = 'none';
                renderCustomerView();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('ไม่สามารถคัดลอกได้ กรุณาลองใหม่');
            successModal.style.display = 'none';
        }
    });
    
    document.getElementById('close-order-modal-btn').addEventListener('click', () => orderModal.style.display = 'none');
    document.getElementById('close-cart-modal-btn').addEventListener('click', () => cartModal.style.display = 'none');
    document.getElementById('reset-cart-btn').addEventListener('click', () => {
         if (confirm('คุณต้องการรีเซ็ทรายการสั่งซื้อทั้งหมดหรือไม่?')) {
            appData.cart = {};
            renderCustomerView();
            alert('รีเซ็ทรายการสั่งซื้อเรียบร้อยแล้ว!');
        }
    });

    const switchView = (viewName) => {
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[viewName].classList.add('active');
    };

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
            const today = new Date().getDay();
            appData.analytics.dailyTraffic[today] = (appData.analytics.dailyTraffic[today] || 0) + 1;
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
            reorderBtn.addEventListener('click', renderReorderMenuModal);
        }
        document.querySelectorAll('.admin-menu .menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                activeAdminMenu = e.currentTarget.dataset.menu;
                renderAdminPanel();
            });
        });
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
            tab.addEventListener('click', () => {
                activeAdminSubMenus[menuKey] = subKey;
                renderAdminPanel();
            });
            container.appendChild(tab);
        }
    };

    const renderAdminPanel = () => {
        document.querySelectorAll('.admin-menu-content').forEach(el => el.style.display = 'none');
        const isSuperAdmin = loggedInUser && loggedInUser.isSuper;
        renderAdminMenu();
        document.querySelectorAll('.admin-menu .menu-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.admin-menu .menu-btn[data-menu="${activeAdminMenu}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        const permissions = (loggedInUser && loggedInUser.permissions) || {};
        const canAccess = (menu) => isSuperAdmin || permissions[menu];
        
        document.getElementById('shop-enabled-toggle').checked = appData.shopSettings.shopEnabled;

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
                document.getElementById('global-font-size').value = appData.shopSettings.globalFontSize;
                document.getElementById('shop-name-font-size').value = appData.shopSettings.shopNameFontSize;
                document.getElementById('slogan-font-size').value = appData.shopSettings.sloganFontSize;
                document.getElementById('shop-global-font').value = appData.shopSettings.globalFontFamily;
                document.getElementById('shop-font').value = appData.shopSettings.fontFamily;
                document.getElementById('font-preview').style.fontFamily = appData.shopSettings.fontFamily;
                document.getElementById('global-font-preview').style.fontFamily = appData.shopSettings.globalFontFamily;
                document.getElementById('logo-toggle').checked = appData.shopSettings.useLogo;
                document.getElementById('logo-preview').style.display = appData.shopSettings.logo ? 'block' : 'none';
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
                updateFontPreviewEffect();
            } else if (activeSub === 'background') {
                document.getElementById('bg-opacity').value = appData.shopSettings.backgroundOpacity;
                document.getElementById('bg-blur').value = appData.shopSettings.backgroundBlur;
                const bgPreview = document.getElementById('bg-preview');
                bgPreview.style.display = appData.shopSettings.backgroundImage ? 'block' : 'none';
                if(appData.shopSettings.backgroundImage) bgPreview.style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
            } else if (activeSub === 'loading-bg') {
                document.getElementById('loading-bg-opacity').value = appData.shopSettings.loadingBackgroundOpacity;
                document.getElementById('loading-bar-style').value = appData.shopSettings.loadingBarStyle;
                const loadingBgPreview = document.getElementById('loading-bg-preview');
                loadingBgPreview.style.display = appData.shopSettings.loadingBackgroundImage ? 'block' : 'none';
                if(appData.shopSettings.loadingBackgroundImage) loadingBgPreview.style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
            }
        } else if (activeAdminMenu === 'festival' && canAccess('festival')) {
            const container = document.getElementById('admin-menu-festival');
            container.style.display = 'block';
            document.getElementById('shop-closed-message').value = appData.shopSettings.shopClosedMessage;
            document.getElementById('rain-effect-toggle').checked = appData.shopSettings.festival.rain.enabled;
            document.getElementById('rain-intensity').value = appData.shopSettings.festival.rain.intensity;
            document.getElementById('rain-opacity').value = appData.shopSettings.festival.rain.opacity;
            document.getElementById('snow-effect-toggle').checked = appData.shopSettings.festival.snow.enabled;
            document.getElementById('snow-intensity').value = appData.shopSettings.festival.snow.intensity;
            document.getElementById('snow-opacity').value = appData.shopSettings.festival.snow.opacity;
            document.getElementById('fireworks-effect-toggle').checked = appData.shopSettings.festival.fireworks.enabled;
            document.getElementById('fireworks-intensity').value = appData.shopSettings.festival.fireworks.intensity;
            document.getElementById('fireworks-opacity').value = appData.shopSettings.festival.fireworks.opacity;
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
    };

    const renderDashboard = () => {
        const today = new Date(), currentMonth = today.getMonth(), currentYear = today.getFullYear();
        const ordersToday = appData.analytics.orders.filter(o => o.timestamp.startsWith(selectedDate) && o.status !== 'cancelled');
        const ordersInMonth = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && new Date(o.timestamp).getMonth() === currentMonth && o.status !== 'cancelled');
        const ordersInYear = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && o.status !== 'cancelled');
        const monthlyProfit = ordersInMonth.reduce((sum, order) => sum + order.total, 0);
        const yearlySales = ordersInYear.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('monthly-profit').textContent = `${monthlyProfit.toLocaleString()} บาท`;
        document.getElementById('daily-orders').textContent = ordersToday.length;
        document.getElementById('monthly-orders').textContent = ordersInMonth.length;
        document.getElementById('yearly-sales').textContent = `${yearlySales.toLocaleString()} บาท`;
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
        const maxTraffic = Math.max(...appData.analytics.dailyTraffic);
        document.getElementById('most-active-day').textContent = `วันที่มีคนเข้าชมมากที่สุด: ${days[appData.analytics.dailyTraffic.indexOf(maxTraffic)]} (${maxTraffic} ครั้ง)`;
        const maxHourTraffic = Math.max(...appData.analytics.hourlyTraffic);
        const mostActiveHourIndex = appData.analytics.hourlyTraffic.indexOf(maxHourTraffic);
        document.getElementById('most-active-time').textContent = `ช่วงเวลาที่มีคนเข้าชมมากที่สุด: ${mostActiveHourIndex}:00 - ${mostActiveHourIndex + 1}:00 น. (${maxHourTraffic} ครั้ง)`;
        renderTrafficChart(days);
        renderProductSalesChart();
        renderCategorySalesChart(ordersInYear);
        renderLowStockList();
        renderTopItems('month');
        document.querySelectorAll('#top-items-controls .btn').forEach(b => b.classList.remove('active'));
        document.querySelector('#top-items-controls .btn[data-period="month"]').classList.add('active');
    };

    const renderTrafficChart = (days) => {
        if (dailyTrafficChart) dailyTrafficChart.destroy();
        dailyTrafficChart = new Chart(document.getElementById('dailyTrafficChart'), { type: 'bar', data: { labels: days, datasets: [{ label: 'จำนวนผู้เข้าชม', data: appData.analytics.dailyTraffic, backgroundColor: 'rgba(40, 167, 69, 0.5)', borderColor: 'rgba(40, 167, 69, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } } });
    };
    const renderProductSalesChart = () => {
        const productNames = Object.keys(appData.analytics.productSales);
        const productQuantities = Object.values(appData.analytics.productSales);
        document.getElementById('best-selling-product').textContent = `สินค้าที่สั่งเยอะสุด (ทั้งหมด): ${productNames.length > 0 ? productNames[productQuantities.indexOf(Math.max(...productQuantities))] : 'ไม่มีข้อมูล'}`;
        document.getElementById('least-selling-product').textContent = `สินค้าที่สั่งน้อยสุด (ทั้งหมด): ${productNames.length > 0 ? productNames[productQuantities.indexOf(Math.min(...productQuantities))] : 'ไม่มีข้อมูล'}`;
        if (productSalesChart) productSalesChart.destroy();
        productSalesChart = new Chart(document.getElementById('productSalesChart'), { type: 'doughnut', data: { labels: productNames, datasets: [{ label: 'ยอดสั่งสินค้า', data: productQuantities, backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'] }] }, options: { responsive: true, maintainAspectRatio: false } });
    };
    const renderCategorySalesChart = (orders) => {
        const salesByCategory = {};
        orders.forEach(order => {
            const itemsByCategoryInOrder = {};
            for (const prodId in order.items) {
                const product = appData.products.find(p => p.id == prodId);
                if (product && product.categoryId) {
                    if (!itemsByCategoryInOrder[product.categoryId]) itemsByCategoryInOrder[product.categoryId] = 0;
                    itemsByCategoryInOrder[product.categoryId] += order.items[prodId];
                }
            }
             for (const catId in itemsByCategoryInOrder) {
                const cat = appData.categories.find(c => c.id == catId);
                if (cat) {
                    const priceResult = calculatePrice(parseInt(catId), itemsByCategoryInOrder[catId]);
                    if (!salesByCategory[cat.name]) salesByCategory[cat.name] = 0;
                    salesByCategory[cat.name] += priceResult.price;
                }
            }
        });
        if (categorySalesChart) categorySalesChart.destroy();
        categorySalesChart = new Chart(document.getElementById('categorySalesChart'), { type: 'pie', data: { labels: Object.keys(salesByCategory), datasets: [{ label: 'ยอดขาย', data: Object.values(salesByCategory), backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6610f2', '#fd7e14', '#e83e8c', '#6c757d'] }] }, options: { responsive: true, maintainAspectRatio: false } });
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

    document.getElementById('low-stock-threshold').addEventListener('change', async (e) => {
        const newThreshold = parseInt(e.target.value);
        if (!isNaN(newThreshold) && newThreshold >= 0) {
            appData.shopSettings.lowStockThreshold = newThreshold;
            await saveState();
            renderLowStockList();
        }
    });

    const renderTopItems = (period) => {
        const listEl = document.getElementById('top-items-list');
        listEl.innerHTML = '';
        const today = new Date();
        let ordersToAnalyze = [];
        if(period === 'day') ordersToAnalyze = appData.analytics.orders.filter(o => o.timestamp.startsWith(today.toISOString().slice(0, 10)) && o.status !== 'cancelled');
        else if (period === 'month') ordersToAnalyze = appData.analytics.orders.filter(o => new Date(o.timestamp).getMonth() === today.getMonth() && new Date(o.timestamp).getFullYear() === today.getFullYear() && o.status !== 'cancelled');
        else ordersToAnalyze = appData.analytics.orders.filter(o => new Date(o.timestamp).getFullYear() === today.getFullYear() && o.status !== 'cancelled');
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

    document.getElementById('top-items-controls').addEventListener('click', (e) => {
        if(e.target.matches('.btn')) {
            document.querySelectorAll('#top-items-controls .btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTopItems(e.target.dataset.period);
        }
    });


    const renderAdminProductTabs = () => {
        const tabsContainer = document.getElementById('admin-product-tabs');
        tabsContainer.innerHTML = '';
        appData.categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `tab ${cat.id === adminActiveCategoryId ? 'active' : ''}`;
            tab.dataset.id = cat.id;
            tab.textContent = cat.name;
            tab.addEventListener('click', () => {
                adminActiveCategoryId = cat.id;
                renderAdminProducts();
                renderAdminProductTabs();
            });
            tabsContainer.appendChild(tab);
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
                <td><button class="btn btn-info btn-small btn-view-price" data-id="${cat.id}">${translations[appData.shopSettings.language].viewPriceBtn}</button></td>
                <td><button class="btn btn-secondary btn-small btn-cat-edit" data-id="${cat.id}">แก้ไข</button><button class="btn btn-danger btn-small btn-cat-delete" data-id="${cat.id}">ลบ</button></td>`;
            list.appendChild(row);
        });
    };
    
    document.getElementById('admin-cat-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-view-price')) {
            const catId = parseInt(e.target.dataset.id);
            const category = appData.categories.find(c => c.id === catId);
            if (category) {
                const priceDetails = document.getElementById('price-view-details');
                const priceText = [];
                if (category.perPiecePrices && category.perPiecePrices.length > 0) {
                    priceText.push(`<h3>ราคาต่อชิ้น:</h3>`, ...category.perPiecePrices.sort((a, b) => a.quantity - b.quantity).map(p => `<div>- ${p.quantity} ชิ้น = ${p.price} บาท</div>`));
                }
                if (category.bulkPrices && category.bulkPrices.length > 0) {
                    priceText.push(`<h3>ราคาเหมา:</h3>`, ...category.bulkPrices.sort((a, b) => a.min - b.min).map(p => `<div>- ${p.min}-${p.max} ชิ้น = ${p.price} บาท</div>`));
                }
                priceDetails.innerHTML = priceText.length > 0 ? priceText.join('') : '<div>ไม่ได้ตั้งราคา</div>';
                document.getElementById('price-view-modal').style.display = 'flex';
            }
        }
    });
    document.getElementById('close-price-view-modal-btn').addEventListener('click', () => {
        document.getElementById('price-view-modal').style.display = 'none';
    });


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
    
    const populateCategoryDropdown = () => {
        const select = document.getElementById('prod-category');
        select.innerHTML = '';
        appData.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    };

    const fontSelect = document.getElementById('shop-font');
    const globalFontSelect = document.getElementById('shop-global-font');
    const fontPreview = document.getElementById('font-preview');
    const globalFontPreview = document.getElementById('global-font-preview');

    const populateFontSelectors = () => {
        FONT_OPTIONS.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            fontSelect.appendChild(option.cloneNode(true));
            globalFontSelect.appendChild(option.cloneNode(true));
        });
    };
    populateFontSelectors();

    fontSelect.addEventListener('change', (e) => fontPreview.style.fontFamily = e.target.value);
    globalFontSelect.addEventListener('change', (e) => globalFontPreview.style.fontFamily = e.target.value);

    document.querySelectorAll('.color-btn').forEach(btn => btn.addEventListener('click', (e) => {
        appData.shopSettings.themeColor = e.target.dataset.color;
        applyTheme();
    }));

    document.getElementById('logo-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            logoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('logo-preview').src = e.target.result;
                document.getElementById('logo-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else logoFile = null;
    });

    document.getElementById('bg-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            bgFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('bg-preview').style.backgroundImage = `url(${e.target.result})`;
                document.getElementById('bg-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else bgFile = null;
    });
    
    document.getElementById('loading-bg-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadingBgFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('loading-bg-preview').style.backgroundImage = `url(${e.target.result})`;
                document.getElementById('loading-bg-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else loadingBgFile = null;
    });

    document.getElementById('remove-bg-btn').addEventListener('click', () => {
        bgFile = null;
        appData.shopSettings.backgroundImage = null;
        document.getElementById('bg-preview').style.display = 'none';
        document.getElementById('bg-upload').value = '';
        applyBackground();
    });
    
    document.getElementById('remove-loading-bg-btn').addEventListener('click', () => {
        loadingBgFile = null;
        appData.shopSettings.loadingBackgroundImage = null;
        document.getElementById('loading-bg-preview').style.display = 'none';
        document.getElementById('loading-bg-upload').value = '';
        applyLoadingBackground();
    });

    document.getElementById('preview-bg-btn').addEventListener('click', async () => {
        if (bgFile) appData.shopSettings.backgroundImage = await readFileAsBase64(bgFile);
        appData.shopSettings.backgroundOpacity = document.getElementById('bg-opacity').value;
        appData.shopSettings.backgroundBlur = document.getElementById('bg-blur').value;
        switchView('customer');
        renderCustomerView();
    });

    const updateFontPreviewEffect = () => {
        const effect = {
            enabled: document.getElementById('effect-toggle').checked,
            offsetX: document.getElementById('effect-offset-x').value,
            offsetY: document.getElementById('effect-offset-y').value,
            blur: document.getElementById('effect-blur').value,
            color: document.getElementById('effect-color').value
        };
        fontPreview.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : 'none';
    };

    document.getElementById('effect-controls-container').addEventListener('input', updateFontPreviewEffect);
    document.getElementById('effect-toggle').addEventListener('change', (e) => {
        document.getElementById('effect-controls-container').style.display = e.target.checked ? 'grid' : 'none';
        updateFontPreviewEffect();
    });

    document.getElementById('save-shop-info-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.shopName = document.getElementById('shop-name').value;
        appData.shopSettings.slogan = document.getElementById('shop-slogan').value;
        appData.shopSettings.managerName = document.getElementById('manager-name').value;
        appData.shopSettings.shareholderName = document.getElementById('shareholder-name').value;
        appData.shopSettings.orderNumberFormat = document.getElementById('order-format-select').value;
        await saveState();
        applyTheme();
    });

    document.getElementById('save-system-fonts-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.fontFamily = document.getElementById('shop-font').value;
        appData.shopSettings.globalFontFamily = document.getElementById('shop-global-font').value;
        appData.shopSettings.globalFontSize = parseFloat(document.getElementById('global-font-size').value);
        appData.shopSettings.shopNameFontSize = parseFloat(document.getElementById('shop-name-font-size').value);
        appData.shopSettings.sloganFontSize = parseFloat(document.getElementById('slogan-font-size').value);
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
    
    document.getElementById('save-background-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.backgroundOpacity = document.getElementById('bg-opacity').value;
        appData.shopSettings.backgroundBlur = document.getElementById('bg-blur').value;
        if (bgFile) appData.shopSettings.backgroundImage = await readFileAsBase64(bgFile);
        await saveState();
        applyTheme();
    });
    
    document.getElementById('save-loading-bg-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.loadingBackgroundOpacity = document.getElementById('loading-bg-opacity').value;
        appData.shopSettings.loadingBarStyle = document.getElementById('loading-bar-style').value;
        if (loadingBgFile) appData.shopSettings.loadingBackgroundImage = await readFileAsBase64(loadingBgFile);
        await saveState();
        applyTheme();
    });
    
    document.getElementById('save-festival-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.shopClosedMessage = document.getElementById('shop-closed-message').value;
        appData.shopSettings.festival.rain.enabled = document.getElementById('rain-effect-toggle').checked;
        appData.shopSettings.festival.rain.intensity = document.getElementById('rain-intensity').value;
        appData.shopSettings.festival.rain.opacity = document.getElementById('rain-opacity').value;
        appData.shopSettings.festival.snow.enabled = document.getElementById('snow-effect-toggle').checked;
        appData.shopSettings.festival.snow.intensity = document.getElementById('snow-intensity').value;
        appData.shopSettings.festival.snow.opacity = document.getElementById('snow-opacity').value;
        appData.shopSettings.festival.fireworks.enabled = document.getElementById('fireworks-effect-toggle').checked;
        appData.shopSettings.festival.fireworks.intensity = document.getElementById('fireworks-intensity').value;
        appData.shopSettings.festival.fireworks.opacity = document.getElementById('fireworks-opacity').value;
        await saveState();
        applyTheme();
    });

    document.getElementById('shop-enabled-toggle').addEventListener('change', async (e) => {
        appData.shopSettings.shopEnabled = e.target.checked;
        updateShopStatusView();
        await saveState();
    });

    document.getElementById('change-pin-btn').addEventListener('click', async (e) => {
        const newPin = document.getElementById('new-pin').value;
        if (newPin && newPin.length >= 4) {
            if (confirm(`คุณต้องการเปลี่ยน PIN เป็น "${newPin}" ใช่หรือไม่?`)) {
                showSaveFeedback(e.currentTarget);
                appData.adminPin = newPin;
                await saveState();
                document.getElementById('new-pin').value = '';
            }
        } else alert('PIN ต้องมีอย่างน้อย 4 ตัวอักษร');
    });
    
    document.getElementById('cat-icon-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            catIconFile = file;
            const reader = new FileReader();
            reader.onload = (e) => document.getElementById('cat-icon-preview').style.backgroundImage = `url(${e.target.result})`;
            reader.readAsDataURL(file);
        } else catIconFile = null;
    });

    document.getElementById('category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        showSaveFeedback(e.target.querySelector('button[type="submit"]'));
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
        } else appData.categories.push({ id: generateId(), name, icon: iconData, perPiecePrices: [], bulkPrices: [], minOrderQuantity: minOrder });
        await saveState();
        resetCategoryForm();
        renderAdminPanel();
    });
    
    const deleteCategory = async (id) => {
        if (confirm('การลบหมวดหมู่จะลบสินค้าทั้งหมดในหมวดหมู่นั้นด้วย ยืนยันหรือไม่?')) {
            appData.categories = appData.categories.filter(c => c.id !== id);
            appData.products = appData.products.filter(p => p.categoryId !== id);
            if (appData.categories.length > 0) {
                if (!appData.categories.find(c => c.id === activeCategoryId)) activeCategoryId = appData.categories[0].id;
                if (!appData.categories.find(c => c.id === adminActiveCategoryId)) adminActiveCategoryId = appData.categories[0].id;
            } else { activeCategoryId = null; adminActiveCategoryId = null; }
            await saveState();
            renderAdminPanel();
        }
    };

    const resetCategoryForm = () => {
        editingCategoryId = null;
        document.getElementById('category-form').reset();
        document.getElementById('cat-min-order').value = 30;
        document.getElementById('submit-cat-btn').textContent = translations[appData.shopSettings.language].saveCategoryBtn;
        document.getElementById('cancel-cat-edit-btn').style.display = 'none';
        document.getElementById('cat-icon-preview').style.backgroundImage = 'none';
        catIconFile = null;
    }

    document.getElementById('cancel-cat-edit-btn').addEventListener('click', resetCategoryForm);
    
    document.getElementById('admin-cat-list').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-cat-edit');
        const deleteBtn = e.target.closest('.btn-cat-delete');
        if (editBtn) {
            const id = parseInt(editBtn.dataset.id);
            const category = appData.categories.find(c => c.id === id);
            if (category) {
                editingCategoryId = id;
                document.getElementById('cat-name').value = category.name;
                document.getElementById('cat-min-order').value = category.minOrderQuantity;
                document.getElementById('cat-icon-preview').style.backgroundImage = category.icon ? `url(${category.icon})` : 'none';
                document.getElementById('submit-cat-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                document.getElementById('cancel-cat-edit-btn').style.display = 'inline-block';
                document.getElementById('category-form').scrollIntoView();
            }
        }
        if (deleteBtn) deleteCategory(parseInt(deleteBtn.dataset.id));
    });
    
    document.getElementById('prod-icon-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            prodIconFile = file;
            const reader = new FileReader();
            reader.onload = (e) => document.getElementById('prod-icon-preview').style.backgroundImage = `url(${e.target.result})`;
            reader.readAsDataURL(file);
        } else prodIconFile = null;
    });

    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        showSaveFeedback(e.target.querySelector('button[type="submit"]'));
        const product = { id: editingProductId || generateId(), name: document.getElementById('prod-name').value, level: parseInt(document.getElementById('prod-level').value), categoryId: parseInt(document.getElementById('prod-category').value), stock: parseInt(document.getElementById('prod-stock').value), isAvailable: document.getElementById('prod-available').checked, icon: null };
        if (prodIconFile) product.icon = await readFileAsBase64(prodIconFile);
        if (editingProductId) {
            const index = appData.products.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                const existingIcon = appData.products[index].icon;
                appData.products[index] = { ...appData.products[index], ...product, icon: product.icon || existingIcon };
            }
        } else appData.products.push(product);
        await saveState();
        resetProductForm();
        renderAdminProducts();
    });
    
    document.getElementById('cancel-edit-btn').addEventListener('click', resetProductForm);

    document.getElementById('admin-prod-list').addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        if (editBtn) {
            const id = parseInt(editBtn.dataset.id);
            const product = appData.products.find(p => p.id === id);
            if (product) {
                editingProductId = id;
                document.getElementById('product-id').value = product.id;
                document.getElementById('prod-name').value = product.name;
                document.getElementById('prod-level').value = product.level;
                document.getElementById('prod-stock').value = product.stock;
                document.getElementById('prod-available').checked = product.isAvailable;
                document.getElementById('prod-category').value = product.categoryId;
                document.getElementById('prod-icon-preview').style.backgroundImage = product.icon ? `url(${product.icon})` : 'none';
                document.getElementById('cancel-edit-btn').style.display = 'inline-block';
                document.getElementById('product-form').scrollIntoView();
            }
        }
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
                appData.products = appData.products.filter(p => p.id !== id);
                await saveState();
                renderAdminProducts();
            }
        }
    });

    function resetProductForm() {
        editingProductId = null;
        document.getElementById('product-form').reset();
        document.getElementById('prod-stock').value = -1;
        document.getElementById('prod-available').checked = true;
        document.getElementById('cancel-edit-btn').style.display = 'none';
        document.getElementById('prod-icon-preview').style.backgroundImage = 'none';
        prodIconFile = null;
    }

    const resetConfirmModal = document.getElementById('reset-confirm-modal');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    let currentResetContext = null;

    const openResetModal = (context) => {
        currentResetContext = context;
        resetConfirmModal.style.display = 'flex';
    };

    document.getElementById('reset-analytics-btn').addEventListener('click', () => openResetModal('analytics'));
    document.getElementById('reset-orders-btn').addEventListener('click', () => openResetModal('orders'));
    cancelResetBtn.addEventListener('click', () => resetConfirmModal.style.display = 'none');

    confirmResetBtn.addEventListener('click', async () => {
        const period = document.getElementById('reset-period-select').value;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartStr = weekStart.toISOString().slice(0, 10);
        const monthStartStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูล (${period})? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
            if (currentResetContext === 'analytics') {
                if (period === 'all') appData.analytics = { dailyTraffic: Array(7).fill(0), hourlyTraffic: Array(24).fill(0), productSales: {}, orders: [], totalSales: 0, monthlyProfit: 0 };
                else {
                    alert('การรีเซ็ตสถิติตามช่วงเวลาจะรีเซ็ตเฉพาะกราฟและตัวเลขสรุป แต่ข้อมูลออเดอร์จะยังคงอยู่');
                    appData.analytics.dailyTraffic = Array(7).fill(0);
                    appData.analytics.hourlyTraffic = Array(24).fill(0);
                    appData.analytics.productSales = {};
                }
                renderDashboard();
            } else if (currentResetContext === 'orders') {
                if (period === 'all') appData.analytics.orders = [];
                else {
                    appData.analytics.orders = appData.analytics.orders.filter(order => {
                        const orderDate = order.timestamp.slice(0, 10);
                        if (period === 'day') return orderDate !== today;
                        if (period === 'week') return orderDate < weekStartStr;
                        if (period === 'month') return orderDate < monthStartStr;
                        return true;
                    });
                }
                renderOrderNumberView();
            }
            await saveState();
            alert('ข้อมูลถูกรีเซ็ตเรียบร้อยแล้ว');
        }
        resetConfirmModal.style.display = 'none';
    });

    const perPiecePriceModal = document.getElementById('per-piece-price-modal');
    const perPiecePriceForm = document.getElementById('per-piece-price-form');
    document.getElementById('set-per-piece-price-btn').addEventListener('click', () => {
        if (!editingCategoryId) { alert('กรุณาเลือกหมวดหมู่ที่ต้องการแก้ไขก่อน'); return; }
        perPiecePriceForm.innerHTML = '';
        const category = appData.categories.find(c => c.id === editingCategoryId);
        const prices = category.perPiecePrices || [];
        for (let i = 10; i <= 1000; i += 10) {
            const priceItem = prices.find(p => p.quantity === i);
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `<label>${i} ชิ้น: <input type="number" data-quantity="${i}" value="${priceItem ? priceItem.price : ''}" placeholder="ราคา (บาท)"></label>`;
            perPiecePriceForm.appendChild(div);
        }
        perPiecePriceModal.style.display = 'flex';
    });
    document.getElementById('close-per-piece-price-modal-btn').addEventListener('click', () => perPiecePriceModal.style.display = 'none');
    document.getElementById('save-per-piece-price-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        const category = appData.categories.find(c => c.id === editingCategoryId);
        const newPrices = [];
        perPiecePriceForm.querySelectorAll('input').forEach(input => {
            const quantity = parseInt(input.dataset.quantity);
            const price = parseInt(input.value);
            if (price > 0) newPrices.push({ quantity, price });
        });
        category.perPiecePrices = newPrices;
        await saveState();
        renderAdminCategories();
        perPiecePriceModal.style.display = 'none';
    });

    const renderSubAdmins = () => {
        const list = document.getElementById('sub-admin-list');
        list.innerHTML = '';
        if (appData.subAdmins.length === 0) list.innerHTML = '<tr><td colspan="3">ยังไม่มีผู้ใช้ย่อย</td></tr>';
        else {
            appData.subAdmins.forEach(sa => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${sa.name}</td><td>${sa.pin}</td><td><button class="btn btn-secondary btn-small btn-sub-admin-edit" data-id="${sa.id}">แก้ไข</button><button class="btn btn-danger btn-small btn-sub-admin-delete" data-id="${sa.id}">ลบ</button></td>`;
                list.appendChild(row);
            });
        }
    };

    const subAdminForm = document.getElementById('sub-admin-form');
    subAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showSaveFeedback(e.target.querySelector('button[type="submit"]'));
        const name = document.getElementById('sub-admin-name').value.trim();
        const pin = document.getElementById('sub-admin-pin').value;
        if (pin.length < 4) { alert('PIN ต้องมีอย่างน้อย 4 ตัวอักษร'); return; }
        if (editingSubAdminId) {
            const subAdmin = appData.subAdmins.find(sa => sa.id === editingSubAdminId);
            if (subAdmin) {
                 if (appData.subAdmins.find(sa => sa.pin === pin && sa.id !== editingSubAdminId)) { alert('PIN นี้มีผู้ใช้งานอื่นแล้ว'); return; }
                subAdmin.name = name;
                subAdmin.pin = pin;
            }
        } else {
            if (appData.subAdmins.length >= 20) { alert('ไม่สามารถเพิ่มผู้ใช้ย่อยได้เกิน 20 คน'); return; }
            if (appData.subAdmins.find(sa => sa.pin === pin)) { alert('PIN นี้มีผู้ใช้งานแล้ว'); return; }
            const newSubAdmin = { id: generateId(), name, pin, permissions: {'admin': true, 'festival': true, 'stock': true, 'order-number': true, 'dashboard': true, 'manage-account': true} };
            appData.subAdmins.push(newSubAdmin);
        }
        await saveState();
        resetSubAdminForm();
        renderSubAdmins();
    });

    const resetSubAdminForm = () => {
        editingSubAdminId = null;
        subAdminForm.reset();
        document.getElementById('add-sub-admin-btn').textContent = translations[appData.shopSettings.language].addUserBtn;
        document.getElementById('cancel-sub-admin-edit').style.display = 'none';
    };

    document.getElementById('cancel-sub-admin-edit').addEventListener('click', resetSubAdminForm);

    document.getElementById('sub-admin-list').addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('btn-sub-admin-edit')) {
            const subAdmin = appData.subAdmins.find(sa => sa.id === id);
            if (subAdmin) {
                editingSubAdminId = id;
                document.getElementById('sub-admin-name').value = subAdmin.name;
                document.getElementById('sub-admin-pin').value = subAdmin.pin;
                document.getElementById('add-sub-admin-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                document.getElementById('cancel-sub-admin-edit').style.display = 'inline-block';
            }
        }
        if (e.target.classList.contains('btn-sub-admin-delete')) {
            if (confirm('ยืนยันการลบผู้ใช้ย่อยนี้หรือไม่?')) {
                appData.subAdmins = appData.subAdmins.filter(sa => sa.id !== id);
                await saveState();
                renderSubAdmins();
            }
        }
    });

    const permissionModal = document.getElementById('permission-modal');
    document.getElementById('view-permissions-btn').addEventListener('click', () => {
        if (appData.subAdmins.length === 0) { alert('ยังไม่มีผู้ใช้ย่อย'); return; }
        const permissionList = document.getElementById('permission-list');
        permissionList.innerHTML = '';
        const subAdmin = appData.subAdmins[0];
        if (!subAdmin) return;
        currentSubAdminPermissionsId = subAdmin.id;
        document.getElementById('permission-user-name').textContent = `ตั้งค่าสิทธิ์สำหรับ: ${subAdmin.name}`;
        const lang = appData.shopSettings.language;
        appData.menuOrder.forEach(key => {
            const translationKey = MENU_NAMES[key];
            const li = document.createElement('li');
            li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;';
            li.innerHTML = `<span>${translations[lang][translationKey]}</span><label class="toggle-switch"><input type="checkbox" data-menu-key="${key}" ${subAdmin.permissions[key] ? 'checked' : ''}><span class="slider"></span></label>`;
            permissionList.appendChild(li);
        });
        permissionModal.style.display = 'flex';
    });
    
    document.getElementById('save-permissions-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        const subAdmin = appData.subAdmins.find(sa => sa.id === currentSubAdminPermissionsId);
        if (subAdmin) {
            const newPermissions = {};
            document.getElementById('permission-list').querySelectorAll('input[type="checkbox"]').forEach(input => {
                newPermissions[input.dataset.menuKey] = input.checked;
            });
            subAdmin.permissions = newPermissions;
            await saveState();
            permissionModal.style.display = 'none';
            if (loggedInUser && loggedInUser.id === currentSubAdminPermissionsId) renderAdminPanel();
        }
    });

    document.getElementById('close-permission-modal-btn').addEventListener('click', () => permissionModal.style.display = 'none');

    const reorderMenuModal = document.getElementById('reorder-menu-modal');
    const renderReorderMenuModal = () => {
        const reorderMenuList = document.getElementById('reorder-menu-list');
        reorderMenuList.innerHTML = '';
        const lang = appData.shopSettings.language;
        appData.menuOrder.forEach(key => {
            const translationKey = MENU_NAMES[key];
            const li = document.createElement('li');
            li.textContent = translations[lang][translationKey];
            li.dataset.menu = key;
            li.draggable = true;
            li.classList.add('sortable');
            reorderMenuList.appendChild(li);
        });
        reorderMenuModal.style.display = 'flex';
        addDragDropListeners();
    };

    const addDragDropListeners = () => {
        const container = document.getElementById('reorder-menu-list');
        let draggedItem = null;
        container.querySelectorAll('.sortable').forEach(item => {
            item.addEventListener('dragstart', () => { draggedItem = item; setTimeout(() => item.classList.add('dragging'), 0); });
            item.addEventListener('dragend', () => { if(draggedItem) draggedItem.classList.remove('dragging'); draggedItem = null; });
        });
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = [...container.querySelectorAll('.sortable:not(.dragging)')].reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - box.top - box.height / 2;
                return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
            if (afterElement == null) container.appendChild(draggedItem);
            else container.insertBefore(draggedItem, afterElement);
        });
    };

    document.getElementById('save-menu-order-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.menuOrder = [...document.getElementById('reorder-menu-list').children].map(li => li.dataset.menu);
        await saveState();
        reorderMenuModal.style.display = 'none';
        renderAdminPanel();
    });

    document.getElementById('close-reorder-menu-modal-btn').addEventListener('click', () => reorderMenuModal.style.display = 'none');

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

    const renderOrderNumberView = (dateRange = []) => {
        const confirmList = document.getElementById('confirm-orders-list');
        const activeList = document.getElementById('active-orders-list');
        const cancelledList = document.getElementById('cancelled-orders-list');
        confirmList.innerHTML = '';
        activeList.innerHTML = '';
        cancelledList.innerHTML = '';
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
            if (order.status === 'new') {
                row.innerHTML = `<td>${order.id}</td><td>${formattedDate}</td><td>${order.total.toLocaleString()} บาท</td><td><button class="btn btn-success btn-small confirm-order-action" data-id="${order.id}">${translations[lang].confirmBtn}</button><button class="btn btn-danger btn-small cancel-order-action" data-id="${order.id}">${translations[lang].cancelBtn}</button></td>`;
                confirmList.appendChild(row);
            } else if (order.status === 'active') {
                row.innerHTML = `<td>${order.id}</td><td>${formattedDate}</td><td>${order.total.toLocaleString()} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${order.id}">${translations[lang].viewDetailsBtn}</button><button class="btn btn-danger btn-small cancel-order-action" data-id="${order.id}">${translations[lang].cancelOrderBtn}</button></td>`;
                activeList.appendChild(row);
            } else if (order.status === 'cancelled') {
                row.innerHTML = `<td>${order.id}</td><td>${formattedDate}</td><td>${order.total.toLocaleString()} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${order.id}">${translations[lang].viewDetailsBtn}</button></td>`;
                cancelledList.appendChild(row);
            }
        });
        document.querySelectorAll('.view-order-details').forEach(btn => btn.addEventListener('click', (e) => viewOrderDetails(e.target.dataset.id)));
        document.querySelectorAll('.confirm-order-action').forEach(btn => btn.addEventListener('click', (e) => confirmOrderAction(e.target.dataset.id)));
        document.querySelectorAll('.cancel-order-action').forEach(btn => btn.addEventListener('click', (e) => cancelOrderAction(e.target.dataset.id)));
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

    const confirmOrderAction = async (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'active';
            await saveState();
            renderOrderNumberView(orderDatePicker.selectedDates);
        }
    };

    const cancelOrderAction = async (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if(!order) return;

        if (order.status === 'new') {
             if (confirm(`คุณต้องการลบออเดอร์ใหม่เลขที่ ${orderId} ทิ้งถาวรใช่หรือไม่?`)) {
                appData.analytics.orders = appData.analytics.orders.filter(o => o.id !== orderId);
                await saveState();
                renderOrderNumberView(orderDatePicker.selectedDates);
            }
        } else if (order.status === 'active') {
            if (confirm(`คุณต้องการยกเลิกออเดอร์เลขที่ ${orderId} ใช่หรือไม่?`)) {
                order.status = 'cancelled';
                await saveState();
                renderOrderNumberView(orderDatePicker.selectedDates);
            }
        }
    };

    // --- Festival Effects ---
    let animationFrameId;
    let rainDrops = [];
    let snowFlakes = [];
    let fireworks = [];
    let lastFireworkTime = 0;

    function resizeCanvas() {
        festivalCanvas.width = window.innerWidth;
        festivalCanvas.height = window.innerHeight;
    }

    function createRainDrop() {
        return {
            x: Math.random() * festivalCanvas.width,
            y: Math.random() * -festivalCanvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 2,
            opacity: appData.shopSettings.festival.rain.opacity,
        };
    }

    function createSnowFlake() {
        return {
            x: Math.random() * festivalCanvas.width,
            y: Math.random() * -50,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            drift: Math.random() * 2 - 1,
            opacity: appData.shopSettings.festival.snow.opacity,
        };
    }
    
    function createFirework(x, y) {
        const particleCount = 100;
        const particles = [];
        const angleStep = (Math.PI * 2) / particleCount;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x, y: y,
                angle: angleStep * i,
                speed: Math.random() * 5 + 2,
                friction: 0.95,
                gravity: 0.1,
                alpha: 1,
                color: color
            });
        }
        return { particles, opacity: appData.shopSettings.festival.fireworks.opacity };
    }

    function animateFestival() {
        festivalCtx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
        let activeEffects = 0;

        // Rain
        if (appData.shopSettings.festival.rain.enabled) {
            activeEffects++;
            while (rainDrops.length < appData.shopSettings.festival.rain.intensity) {
                rainDrops.push(createRainDrop());
            }
            rainDrops.length = appData.shopSettings.festival.rain.intensity;
            festivalCtx.strokeStyle = `rgba(174,194,224,${appData.shopSettings.festival.rain.opacity})`;
            festivalCtx.lineWidth = 1;
            rainDrops.forEach(drop => {
                festivalCtx.beginPath();
                festivalCtx.moveTo(drop.x, drop.y);
                festivalCtx.lineTo(drop.x, drop.y + drop.length);
                festivalCtx.stroke();
                drop.y += drop.speed;
                if (drop.y > festivalCanvas.height) {
                    Object.assign(drop, createRainDrop(), { y: -20 });
                }
            });
        } else {
            rainDrops = [];
        }

        // Snow
        if (appData.shopSettings.festival.snow.enabled) {
            activeEffects++;
            while (snowFlakes.length < appData.shopSettings.festival.snow.intensity) {
                snowFlakes.push(createSnowFlake());
            }
            snowFlakes.length = appData.shopSettings.festival.snow.intensity;
            festivalCtx.fillStyle = `rgba(255, 255, 255, ${appData.shopSettings.festival.snow.opacity})`;
            snowFlakes.forEach(flake => {
                festivalCtx.beginPath();
                festivalCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                festivalCtx.fill();
                flake.y += flake.speed;
                flake.x += flake.drift;
                if (flake.y > festivalCanvas.height) {
                    Object.assign(flake, createSnowFlake(), { y: -10 });
                }
            });
        } else {
            snowFlakes = [];
        }

        // Fireworks
        if (appData.shopSettings.festival.fireworks.enabled) {
            activeEffects++;
            const now = Date.now();
            const fireworkInterval = appData.shopSettings.festival.fireworks.intensity * 60 * 1000;
            if (now - lastFireworkTime > fireworkInterval / 10) { // simplified for more frequent bursts
                if (Math.random() < 0.05) {
                    fireworks.push(createFirework(Math.random() * festivalCanvas.width, Math.random() * (festivalCanvas.height / 2)));
                    lastFireworkTime = now;
                }
            }
            fireworks.forEach((fw, index) => {
                if (fw.particles.length === 0) {
                    fireworks.splice(index, 1);
                } else {
                    fw.particles.forEach((p, pIndex) => {
                        p.speed *= p.friction;
                        p.x += Math.cos(p.angle) * p.speed;
                        p.y += Math.sin(p.angle) * p.speed + p.gravity;
                        p.alpha -= 0.02;
                        if (p.alpha <= 0) {
                            fw.particles.splice(pIndex, 1);
                        } else {
                            festivalCtx.globalAlpha = p.alpha * fw.opacity;
                            festivalCtx.fillStyle = p.color;
                            festivalCtx.fillRect(p.x, p.y, 2, 2);
                        }
                    });
                    festivalCtx.globalAlpha = 1;
                }
            });
        } else {
            fireworks = [];
        }


        if (activeEffects > 0) {
            animationFrameId = requestAnimationFrame(animateFestival);
        } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function initFestivalEffects() {
        cancelAnimationFrame(animationFrameId);
        const settings = appData.shopSettings.festival;
        if (settings.rain.enabled || settings.snow.enabled || settings.fireworks.enabled) {
            festivalCanvas.style.display = 'block';
            resizeCanvas();
            animateFestival();
        } else {
            festivalCanvas.style.display = 'none';
        }
    }
    
    const init = async () => {
        applyLoadingBackground();
        await loadState();
        if (appData.categories.length > 0) {
            if (!appData.categories.find(c => c.id === activeCategoryId)) activeCategoryId = appData.categories[0].id;
            adminActiveCategoryId = activeCategoryId;
        } else { activeCategoryId = null; adminActiveCategoryId = null; }
        renderCustomerView();
        document.getElementById('loader-overlay').style.display = 'none';
    };

    window.addEventListener('resize', resizeCanvas);
    init();
});
