document.addEventListener('DOMContentLoaded', () => {
    const API_ENDPOINT = '/.netlify/functions/data';

    let appData = {
        categories: [],
        products: [],
        cart: {},
        adminPin: '210406',
        subAdmins: [],
        stockDatabase: {
            categories: [],
            products: []
        },
        shopSettings: {
            shopName: "WARISHAYDAY",
            slogan: "ร้านค้าไอเท็ม Hay Day",
            managerName: "",
            shareholderName: "",
            themeName: 'default',
            fontFamily: "'Kanit', sans-serif",
            globalFontFamily: "'Kanit', sans-serif",
            globalFontSize: 50,
            mainMenuFontSize: 50,
            subMenuFontSize: 50,
            shopNameFontSize: 2.5,
            sloganFontSize: 1.2,
            orderNumberFormat: 'format1',
            orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
            logo: null,
            useLogo: false,
            darkMode: false,
            shopNameEffect: { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: '#000000' },
            sloganEffect: { enabled: false, offsetX: 1, offsetY: 1, blur: 2, color: '#000000' },
            sloganFontFamily: "'Kanit', sans-serif",
            backgroundImage: null,
            backgroundOpacity: 1,
            backgroundBlur: 0,
            loadingBackgroundImage: null,
            loadingBackgroundOpacity: 0.7,
            loadingBarStyle: '1',
            loadingMessageText: "กำลังดาวน์โหลดข้อมูลล่าสุด...",
            loadingAnimation: 'door-open-v',
            language: 'th',
            lowStockThreshold: 50, 
            dbCategoryLowStockThresholds: {},
            copyrightText: "Copyright © 2025 Warishayday",
            copyrightOpacity: 1,
            shopEnabled: true,
            shopClosedMessage: {
                text: "ร้านปิดปรับปรุงชั่วคราว",
                color: "#FFFFFF",
                size: 20,
                speed: 20,
                effect: { enabled: false, offsetX: 1, offsetY: 1, blur: 2, color: '#000000' }
            },
            festival: {
                rain: { enabled: false, intensity: 20, opacity: 0.5 },
                snow: { enabled: false, intensity: 20, opacity: 0.5 },
                fireworks: { enabled: false, intensity: 1, opacity: 0.8 },
                autumn: { enabled: false, intensity: 20, opacity: 0.8 }
            },
            promotions: [] 
        },
        analytics: {
            dailyTraffic: Array(7).fill(0),
            hourlyTraffic: Array(24).fill(0),
            productSales: {},
            orders: [],
            totalSales: 0,
            monthlyProfit: 0,
            loginAttempts: { admin: 0, isLocked: false, lastAttempt: null },
            subAdminAttempts: {},
            logs: []
        },
        taxData: {
            year: new Date().getFullYear(),
            otherIncome: 0,
            expenseType: 'flat', 
            actualExpenses: { cost: 0, transport: 0, advertising: 0, other: 0 },
            deductions: {
                personal: 60000,
                spouse: 0,
                children: 0,
                socialSecurity: 0,
                insurance: 0,
                rmf: 0,
                ssf: 0,
                donations: 0,
                homeInterest: 0
            }
        },
        menuOrder: ['dashboard', 'order-number', 'stock', 'admin', 'tax', 'festival', 'manage-account']
    };

    const LOADING_ANIMATIONS = {
        'none': { name: 'ไม่มีอนิเมชั่น', duration: 500, html: '' },
        'door-open-v': { name: 'เปิดประตู (แนวตั้ง)', duration: 1000, html: '<div class="left-door"></div><div class="right-door"></div>' },
        'door-open-h': { name: 'เปิดประตู (แนวนอน)', duration: 1000, html: '<div class="top-door"></div><div class="bottom-door"></div>' },
        'curtain-open': { name: 'เปิดม่าน', duration: 1200, html: '<div class="left-curtain"></div><div class="right-curtain"></div>' },
        'fade-out': { name: 'จางหายไป', duration: 1000, html: '<div class="overlay"></div>' },
        'zoom-out': { name: 'ซูมออก', duration: 1000, html: '<div class="overlay"></div>' },
        'slide-up': { name: 'เลื่อนขึ้น', duration: 1000, html: '<div class="overlay"></div>' },
        'slide-down': { name: 'เลื่อนลง', duration: 1000, html: '<div class="overlay"></div>' },
        'slide-left': { name: 'เลื่อนไปทางซ้าย', duration: 1000, html: '<div class="overlay"></div>' },
        'slide-right': { name: 'เลื่อนไปทางขวา', duration: 1000, html: '<div class="overlay"></div>' },
        'circle-wipe': { name: 'วงกลม', duration: 1000, html: '<div class="overlay"></div>' },
        'diag-wipe': { name: 'กวาดแนวทแยง', duration: 1000, html: '<div class="overlay"></div>' },
        'blinds-v': { name: 'มู่ลี่ (แนวตั้ง)', duration: 1000, html: '<div class="blind"></div>'.repeat(5) },
        'blinds-h': { name: 'มู่ลี่ (แนวนอน)', duration: 1000, html: '<div class="blind"></div>'.repeat(5) },
        'pixelate': { name: 'แตกเป็นพิกเซล', duration: 1000, html: '<div class="overlay"></div>' },
        'shrink-center': { name: 'หดตรงกลาง', duration: 1000, html: '<div class="overlay"></div>' },
        'split-slide': { name: 'แยกและเลื่อน', duration: 1000, html: '<div class="top-half"></div><div class="bottom-half"></div>' },
        'iris-out': { name: 'ม่านตา', duration: 1000, html: '<div class="overlay"></div>' },
        'matrix': { name: 'เมทริกซ์', duration: 1500, html: '' }, // Special handling in JS
        'unfold': { name: 'คลี่ออก', duration: 1000, html: '<div class="left-half"></div><div class="right-half"></div>' },
        'glitch': { name: 'กลิตช์', duration: 1000, html: '<div class="overlay"></div><div class="overlay-2"></div>' }
    };

    const FONT_OPTIONS = [
        { name: "Kanit", value: "'Kanit', sans-serif" }, { name: "Chakra Petch", value: "'Chakra Petch', sans-serif" },
        { name: "IBM Plex Sans Thai", value: "'IBM Plex Sans Thai', sans-serif" }, { name: "Sarabun", value: "'Sarabun', sans-serif" },
        { name: "Prompt", value: "'Prompt', sans-serif" }, { name: "Mali", value: "'Mali', sans-serif" },
        { name: "Anuphan", value: "'Anuphan', sans-serif" }, { name: "Taviraj", value: "'Taviraj', serif" },
        { name: "Trirong", value: "'Trirong', serif" },
    ];
    
    const THEME_PRESETS = {
        default: { name: "Default Green", colors: { primary: "#28a745", secondary: "#ffc107", info: "#17a2b8" }},
        ocean: { name: "Ocean Blue", colors: { primary: "#007bff", secondary: "#66d9e8", info: "#17a2b8" }},
        sunset: { name: "Sunset Orange", colors: { primary: "#fd7e14", secondary: "#ffc107", info: "#e83e8c" }},
        royal: { name: "Royal Purple", colors: { primary: "#6f42c1", secondary: "#e83e8c", info: "#007bff" }},
        forest: { name: "Forest Vibe", colors: { primary: "#20c997", secondary: "#495057", info: "#28a745" }},
        candy: { name: "Candy Pink", colors: { primary: "#e83e8c", secondary: "#f8f9fa", info: "#6f42c1" }},
        fire: { name: "Fire Red", colors: { primary: "#dc3545", secondary: "#fd7e14", info: "#ffc107" }},
        earth: { name: "Earthy Brown", colors: { primary: "#8B4513", secondary: "#D2B48C", info: "#A0522D" }},
        mono: { name: "Monochrome", colors: { primary: "#343a40", secondary: "#6c757d", info: "#f8f9fa" }},
        tech: { name: "Tech Cyan", colors: { primary: "#17a2b8", secondary: "#20c997", info: "#66d9e8" }},
        meadow: { name: "Meadow Green", colors: { primary: "#4CAF50", secondary: "#8BC34A", info: "#CDDC39" }},
        sky: { name: "Sky Blue", colors: { primary: "#03A9F4", secondary: "#81D4FA", info: "#B3E5FC" }},
        lavender: { name: "Lavender Fields", colors: { primary: "#9575CD", secondary: "#B39DDB", info: "#D1C4E9" }},
        rose: { name: "Rose Gold", colors: { primary: "#E57373", secondary: "#FFCDD2", info: "#F8BBD0" }},
        mint: { name: "Mint Chocolate", colors: { primary: "#80CBC4", secondary: "#A7FFEB", info: "#4D4D4D" }},
        coral: { name: "Coral Reef", colors: { primary: "#FF7043", secondary: "#FFAB91", info: "#FF8A65" }},
        sapphire: { name: "Sapphire Gem", colors: { primary: "#3F51B5", secondary: "#7986CB", info: "#C5CAE9" }},
        amber: { name: "Amber Glow", colors: { primary: "#FFC107", secondary: "#FFD54F", info: "#FFECB3" }},
        teal: { name: "Deep Teal", colors: { primary: "#009688", secondary: "#4DB6AC", info: "#B2DFDB" }},
        indigo: { name: "Indigo Night", colors: { primary: "#303F9F", secondary: "#5C6BC0", info: "#9FA8DA" }},
        peach: { name: "Peach Blossom", colors: { primary: "#FF8A80", secondary: "#FFB5A7", info: "#FFDAC1" }},
        steel: { name: "Steel Gray", colors: { primary: "#607D8B", secondary: "#90A4AE", info: "#CFD8DC" }},
        wine: { name: "Red Wine", colors: { primary: "#C2185B", secondary: "#E91E63", info: "#F06292" }},
        emerald: { name: "Emerald City", colors: { primary: "#00695C", secondary: "#00897B", info: "#4DB6AC" }},
        sandstone: { name: "Sandstone", colors: { primary: "#FBC02D", secondary: "#FFF176", info: "#FFF9C4" }},
        denim: { name: "Denim Blue", colors: { primary: "#546E7A", secondary: "#78909C", info: "#B0BEC5" }},
        plum: { name: "Sugar Plum", colors: { primary: "#8E24AA", secondary: "#AB47BC", info: "#CE93D8" }},
        moss: { name: "Mossy Rock", colors: { primary: "#558B2F", secondary: "#7CB342", info: "#AED581" }},
        clay: { name: "Clay Pot", colors: { primary: "#A1887F", secondary: "#BCAAA4", info: "#D7CCC8" }},
        ocean_deep: { name: "Ocean Deep", colors: { primary: "#0D47A1", secondary: "#1976D2", info: "#64B5F6" }},
        cherry: { name: "Cherry Blossom", colors: { primary: "#F48FB1", secondary: "#F8BBD0", info: "#FFEBEE" }},
        olive: { name: "Olive Grove", colors: { primary: "#9E9D24", secondary: "#CDDC39", info: "#F0F4C3" }},
        raspberry: { name: "Raspberry Sorbet", colors: { primary: "#D81B60", secondary: "#EC407A", info: "#F48FB1" }},
        coffee: { name: "Coffee Bean", colors: { primary: "#5D4037", secondary: "#795548", info: "#A1887F" }},
        lilac: { name: "Lilac Breeze", colors: { primary: "#7E57C2", secondary: "#9575CD", info: "#B39DDB" }},
        tangerine: { name: "Tangerine Dream", colors: { primary: "#F57C00", secondary: "#FB8C00", info: "#FFB74D" }},
        slate: { name: "Slate Gray", colors: { primary: "#455A64", secondary: "#607D8B", info: "#90A4AE" }},
        periwinkle: { name: "Periwinkle", colors: { primary: "#8C9EFF", secondary: "#B3E5FC", info: "#A7C7E7" }},
        mustard: { name: "Mustard Yellow", colors: { primary: "#FFD600", secondary: "#FFEA00", info: "#FFFF00" }},
        seafoam: { name: "Seafoam Green", colors: { primary: "#388E3C", secondary: "#66BB6A", info: "#A5D6A7" }},
        watermelon: { name: "Watermelon Slice", colors: { primary: "#F44336", secondary: "#4CAF50", info: "#FFEB3B" }},
        grape: { name: "Grape Soda", colors: { primary: "#512DA8", secondary: "#673AB7", info: "#9575CD" }},
        chocolate: { name: "Dark Chocolate", colors: { primary: "#4E342E", secondary: "#6D4C41", info: "#8D6E63" }},
        bubblegum: { name: "Bubblegum Pop", colors: { primary: "#F06292", secondary: "#F48FB1", info: "#F8BBD0" }},
        lagoon: { name: "Blue Lagoon", colors: { primary: "#00ACC1", secondary: "#26C6DA", info: "#80DEEA" }},
        honey: { name: "Honey Pot", colors: { primary: "#FFA000", secondary: "#FFB300", info: "#FFD54F" }},
        stormy: { name: "Stormy Sky", colors: { primary: "#757575", secondary: "#9E9E9E", info: "#E0E0E0" }},
        kiwi: { name: "Kiwi Splash", colors: { primary: "#8BC34A", secondary: "#AED581", info: "#DCE775" }},
        cinnamon: { name: "Cinnamon Spice", colors: { primary: "#BF360C", secondary: "#D84315", info: "#FF7043" }}
    };

    const translations = {
        th: {
            loadingAnimationLabel: "รูปแบบอนิเมชั่น",
            loadingMessage: "ข้อความตอนโหลด",
            closeBtn: "ปิด", cancelBtn: "ยกเลิก", confirmBtn: "ยืนยัน", saveBtn: "บันทึก", editBtn: "แก้ไข", deleteBtn: "ลบ",
            searchPlaceholder: "ค้นหาสินค้า...", itemsListTitle: "รายการสินค้า", tableHeaderItem: "สินค้า", tableHeaderLevel: "เลเวล", tableHeaderQuantity: "จำนวน", tableHeaderManage: "จัดการ",
            viewOrderBtn: "รายการสั่งซื้อ", confirmOrderBtn: "ยืนยันสั่งซื้อ", totalAmount: "ยอดรวม",
            adminLoginTitle: "เข้าสู่ระบบหลังบ้าน", pinLabel: "PIN", loginBtn: "เข้าสู่ระบบ", backToShopBtn: "กลับหน้าหลักสั่งสินค้า", invalidPinError: "PIN ไม่ถูกต้อง!",
            pinAttemptsLeft: "เหลือ {attemptsLeft} ครั้ง", pinLocked: "ล็อกอินล้มเหลวเกิน 5 ครั้ง ระบบล็อกแล้ว", pinUnlockCode: "ปลดล็อกด้วยรหัส 1340900210406",
            adminPanelTitle: "Admin Panel", viewShopBtn: "มุมมองหน้าร้าน", logoutBtn: "ออกจากระบบ",
            menuAdmin: "ตั้งค่าร้าน", menuFestival: "Festival", menuStock: "สต๊อกสินค้า", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage account", editMenuOrderBtn: "EDIT",
            menuTax: "ตรวจสอบภาษี",
            shopInfoTitle: "ข้อมูลร้าน", shopLinkTitle: "ลิงก์สำหรับลูกค้า", shopLinkInfo: "แชร์ลิงก์นี้ให้ลูกค้าเพื่อเข้าถึงร้านค้าโดยตรง (ไม่มีปุ่ม Admin)", copyLinkBtn: "คัดลอก",
            systemFontsTitle: "System Fonts", fontPreviewText: "ตัวอย่างฟอนต์ระบบ",
            shopNameLabel: "ชื่อร้านค้า", shopSloganLabel: "สโลแกนร้าน", managerNameLabel: "ชื่อผู้จัดการระบบ", shareholderNameLabel: "ชื่อผู้ถือหุ้นใหญ่",
            globalFontLabel: "ฟอนต์ระบบทั้งหมด", shopNameFontLabel: "ฟอนต์ชื่อร้าน", sloganFontLabel: "ฟอนต์สโลแกน",
            globalFontSizeLabel: "ขนาดฟอนต์ทั้งระบบ (%)", shopNameFontSizeLabel: "ขนาดฟอนต์ชื่อร้าน", sloganFontSizeLabel: "ขนาดฟอนต์สโลแกน",
            mainMenuFontSizeLabel: "ขนาดฟอนต์เมนูหลัก (%)", subMenuFontSizeLabel: "ขนาดฟอนต์เมนูย่อย (%)",
            enableEffectLabel: "เปิดใช้เอฟเฟกต์ชื่อร้าน", enableSloganEffectLabel: "เปิดใช้เอฟเฟกต์สโลแกน",
            effectOffsetX: "เงาแนวนอน (X)", effectOffsetY: "เงาแนวตั้ง (Y)", effectBlur: "ความเบลอ", effectColor: "สีเงา",
            orderFormatLabel: "รูปแบบเลขที่ออเดอร์", useLogoLabel: "ใช้โลโก้", uploadLogoLabel: "อัปโหลดโลโก้ (PNG)",
            backgroundSettingsTitle: "ตั้งค่าพื้นหลัง", uploadBgLabel: "อัปโหลดภาพพื้นหลัง", bgOpacityLabel: "ความโปร่งใส (จาง-ชัด)", bgBlurLabel: "ความเบลอ (น้อย-มาก)",
            removeBgBtn: "ลบพื้นหลัง", previewBgBtn: "ดูตัวอย่าง", saveSettingsBtn: "บันทึกการตั้งค่า",
            copyrightTextLabel: "ข้อความ Copyright", copyrightOpacityLabel: "ความคมชัด",
            changePinTitle: "เปลี่ยนรหัสผ่าน", newPinLabel: "PIN ใหม่", saveNewPinBtn: "บันทึก PIN ใหม่",
            manageCategoriesTitle: "จัดการหมวดหมู่", categoryNameLabel: "ชื่อหมวดหมู่", categoryIconLabel: "ไอค่อนหมวดหมู่ (ไฟล์ PNG)", minOrderLabel: "จำนวนสั่งซื้อขั้นต่ำ",
            setPriceLabel: "ตั้งค่าราคา", setPerPiecePriceBtn: "ตั้งราคาต่อชิ้น", saveCategoryBtn: "เพิ่ม/บันทึกหมวดหมู่", categoryListTitle: "รายการหมวดหมู่",
            tableHeaderIcon: "ไอค่อน", tableHeaderName: "ชื่อ", tableHeaderMinOrder: "ขั้นต่ำ", tableHeaderPrice: "ราคา",
            manageProductsTitle: "จัดการสินค้า", productNameLabel: "ชื่อสินค้า", levelLabel: "เลเวล", stockQuantityLabel: "จำนวนคงเหลือ", categoryLabel: "หมวดหมู่",
            productIconLabel: "ไอค่อนสินค้า (ไฟล์ PNG)", productAvailableLabel: "เปิดขายสินค้านี้", saveProductBtn: "บันทึกสินค้า", cancelEditBtn: "ยกเลิกแก้ไข",
            tableHeaderStock: "คงเหลือ", tableHeaderStatus: "สถานะ", statusAvailable: "เปิดขาย", statusUnavailable: "ปิดขาย",
            stockDatabaseTitle: "ฐานข้อมูลสต็อก", searchCategoryLabel: "ค้นหาหมวดหมู่", searchProductLabel: "ค้นหาสินค้า", pullBtn: "ดึงข้อมูล",
            selectDateLabel: "เลือกวันที่:", resetDataBtn: "รีเซ็ทข้อมูล", 
            confirmOrdersTitle: "ออเดอร์ใหม่", activeOrdersTitle: "รายการออเดอร์ปัจจุบัน", cancelledOrdersTitle: "รายการออเดอร์ที่ถูกยกเลิก",
            tableHeaderOrderNo: "เลขออเดอร์", tableHeaderDateTime: "วันที่/เวลา", tableHeaderTotal: "ยอดรวม", viewDetailsBtn: "ดูรายละเอียด", cancelOrderBtn: "ยกเลิก",
            dashboardTitle: "ภาพรวมร้านค้า", monthlyProfitTitle: "กำไรเดือนนี้", dailyOrdersTitle: "ยอดออเดอร์วันนี้", monthlyOrdersTitle: "ยอดออเดอร์เดือนนี้", yearlySalesTitle: "ยอดขายรวม (ปีนี้)",
            lowStockAlertTitle: "การแจ้งเตือนสินค้าคงเหลือ",
            menuStockSettings: "ตั้งค่าคงเหลือ",
            lowStockSettingsTitle: "ตั้งค่าคงเหลือ",
            lowStockSettingsInfo: "กำหนดจำนวนสินค้าขั้นต่ำสำหรับแต่ละหมวดหมู่ (จากฐานข้อมูล) เพื่อรับการแจ้งเตือนในหน้า Dashboard",
            noLowStockItems: "ไม่มีสินค้าใกล้หมด", categorySalesTitle: "ยอดขายตามหมวดหมู่", topSellingTitle: "สินค้าขายดี (Top 5)",
            periodDay: "วันนี้", periodMonth: "เดือนนี้", periodYear: "ปีนี้", trafficStatsTitle: "สถิติการเข้าใช้งาน", productStatsTitle: "สถิติสินค้า (ตามจำนวนที่สั่ง)",
            manageAccountTitle: "จัดการบัญชี", subAdminLimitInfo: "จำกัดจำนวนผู้ใช้ย่อยได้สูงสุด 20 คน", usernameLabel: "ชื่อผู้ใช้", addUserBtn: "เพิ่มผู้ใช้", subAdminListTitle: "รายการผู้ใช้ย่อย",
            anomalyCheckTitle: "ตรวจสอบความผิดปกติ", anomalyCheckInfo: "ระบบจะบันทึกการพยายามเข้าสู่ระบบที่ล้มเหลว", tableHeaderUser: "ผู้ใช้", tableHeaderAttempts: "จำนวนครั้งที่ล้มเหลว", tableHeaderLockout: "สถานะล็อก",
            orderSummaryTitle: "สรุปออเดอร์", copyOrderPrompt: "กรุณาคัดลอกข้อความด้านล่างเพื่อส่งให้ทางร้าน", copyOrderBtn: "คัดลอกออเดอร์", copySuccessMessage: "คัดลอกออเดอร์สำเร็จ",
            yourOrderListTitle: "รายการสั่งซื้อของคุณ", confirmPinTitle: "ยืนยันรหัส PIN", enterPinPrompt: "กรอกรหัส PIN เพื่อยืนยัน",
            confirmResetTitle: "ยืนยันการรีเซ็ทข้อมูล", selectResetPeriodPrompt: "กรุณาเลือกช่วงเวลาที่ต้องการรีเซ็ทข้อมูล", periodWeek: "สัปดาห์นี้", periodAll: "ข้อมูลทั้งหมด",
            setPerPiecePriceTitle: "ตั้งราคาต่อชิ้น", setPerPiecePriceInfo: "กำหนดราคาสำหรับทุกๆ 10 ชิ้น", savePriceBtn: "บันทึกราคา",
            reorderMenuTitle: "จัดเรียงเมนู", reorderMenuInfo: "ลากและวางเพื่อจัดลำดับเมนูตามต้องการ", saveOrderBtn: "บันทึกการจัดเรียง",
            setPermissionsTitle: "ตั้งค่าสิทธิ์การเข้าถึง", savePermissionsBtn: "บันทึกสิทธิ์",
            loadingBackgroundTitle: "พื้นหลัง Loading", uploadLoadingBgLabel: "อัปโหลดภาพพื้นหลัง Loading", loadingBarStyleLabel: "รูปแบบแถบดาวน์โหลด",
            priceDetailsTitle: "รายละเอียดราคา", viewPriceBtn: "ดูราคา",
            festivalTitle: "Festival Effects", shopStatusLabel: "เปิดร้าน", shopClosedMessageLabel: "ข้อความเมื่อปิดร้าน",
            messageFontColorLabel: "สีตัวอักษร", messageFontSizeLabel: "ขนาดตัวอักษร",
            rainEffectLabel: "เอฟเฟกต์ฝนตก", rainIntensityLabel: "ความหนัก", effectOpacityLabel: "ความชัด",
            snowEffectLabel: "เอฟเฟกต์หิมะตก", snowIntensityLabel: "ความหนัก",
            fireworksEffectLabel: "เอฟเฟกต์พลุ", fireworksIntensityLabel: "ความถี่ (นาที)",
            autumnEffectLabel: "เอฟเฟกต์ฤดูใบไม้ร่วง", autumnIntensityLabel: "ความหนัก",
            saveSuccessMessage: "บันทึกสำเร็จ!",
            systemThemeLabel: "ธีมระบบ", selectThemeBtn: "เลือกธีม", systemThemeTitle: "เลือกธีมระบบ",
            previewLabel: "ตัวอย่าง", marqueeSpeedLabel: "ความเร็วตัวอักษรวิ่ง",
            stockDatabaseManageCats: "จัดการหมวดหมู่ (ฐานข้อมูล)", stockDatabaseManageProds: "จัดการสินค้า (ฐานข้อมูล)",
            addCategoryBtn: "เพิ่มหมวดหมู่", addProductBtn: "เพิ่มสินค้า",
            searchFromDb: "ค้นหาจากฐานข้อมูล", searchModalTitle: "ค้นหาจากฐานข้อมูล",
            enableMessageEffectLabel: "เปิดใช้เอฟเฟกต์ตัวอักษร",
            stockDbInfo: "ที่นี่คือฐานข้อมูลหลักสำหรับจัดเก็บรายการสินค้าและหมวดหมู่ทั้งหมด คุณสามารถเพิ่ม/แก้ไข/ลบข้อมูลได้จากที่นี่ และนำไปใช้ในหน้าจัดการสต็อกสินค้าของร้านค้า",
            menuPromotions: "โปรโมชั่น",
            promotionsTitle: "จัดการโค้ดส่วนลด",
            promoCodeLabel: "โค้ดส่วนลด",
            promoDiscountLabel: "ส่วนลด (%)",
            addPromoBtn: "เพิ่มโค้ด",
            generatePromoBtn: "สร้างโค้ดสุ่ม",
            promoListTitle: "รายการโค้ดส่วนลด",
            tableHeaderCode: "โค้ด",
            tableHeaderDiscount: "ส่วนลด",
            promoCodeInputLabel: "กรอกโค้ดส่วนลด",
            applyPromoBtn: "ใช้โค้ด",
            discountLabel: "ส่วนลด",
            grandTotalLabel: "ยอดรวมสุทธิ",
            invalidPromoCode: "โค้ดส่วนลดไม่ถูกต้อง",
            menuLogs: "Log การเปลี่ยนแปลง",
            logsTitle: "ประวัติการเปลี่ยนแปลง",
            tableHeaderTimestamp: "เวลา",
            tableHeaderAction: "การกระทำ",
            tableHeaderDetails: "รายละเอียด",
            menuTax: "ตรวจสอบภาษี",
            taxTitle: "ประมาณการภาษีเงินได้บุคคลธรรมดา",
            taxYearLabel: "สำหรับปีภาษี:",
            taxIncomeTitle: "1. รายได้ (เงินได้พึงประเมิน)",
            taxShopIncomeLabel: "รายได้จากร้านค้า (ระบบดึงอัตโนมัติ)",
            taxOtherIncomeLabel: "รายได้อื่นๆ",
            taxExpenseTitle: "2. ค่าใช้จ่าย",
            taxExpenseTypeLabel: "เลือกประเภทการหักค่าใช้จ่าย",
            taxExpenseFlatRate: "หักแบบเหมา 60%",
            taxExpenseActual: "หักตามจริง",
            taxActualCostLabel: "ต้นทุนสินค้า",
            taxActualTransportLabel: "ค่าขนส่ง",
            taxActualAdLabel: "ค่าโฆษณา",
            taxActualOtherLabel: "ค่าใช้จ่ายอื่นๆ",
            taxDeductionTitle: "3. ค่าลดหย่อน",
            taxDeductionPersonalLabel: "ส่วนตัว",
            taxDeductionSpouseLabel: "คู่สมรส (ไม่มีเงินได้)",
            taxDeductionChildrenLabel: "บุตร (คนละ 30,000)",
            taxDeductionSocialSecurityLabel: "ประกันสังคม (สูงสุด 9,000)",
            taxDeductionInsuranceLabel: "เบี้ยประกันชีวิต/สุขภาพ",
            taxDeductionRmfLabel: "RMF",
            taxDeductionSsfLabel: "SSF",
            taxDeductionDonationsLabel: "เงินบริจาค",
            taxDeductionHomeInterestLabel: "ดอกเบี้ยบ้าน",
            calculateTaxBtn: "คำนวณภาษี",
            taxSummaryTitle: "4. สรุปประมาณการภาษี",
            taxTotalIncome: "รายได้ทั้งหมด",
            taxTotalExpense: "ค่าใช้จ่ายทั้งหมด",
            taxTotalDeduction: "ค่าลดหย่อนทั้งหมด",
            taxNetIncome: "เงินได้สุทธิ",
            taxPayable: "ภาษีที่ต้องชำระ",
            taxPnd94Label: "ภ.ง.ด. 94 (ภาษีครึ่งปีที่ต้องชำระภายใน ก.ย.)",
            taxPnd90Label: "ภ.ง.ด. 90 (ภาษีทั้งปีที่ต้องชำระภายใน มี.ค. ปีถัดไป)",
            taxPaidPnd94: "ภาษีครึ่งปีที่ชำระแล้ว (ภ.ง.ด.94)",
            taxFinalPayable: "ภาษีที่ต้องชำระเพิ่มเติมปลายปี",
            taxInfoText: "*เป็นการคำนวณเบื้องต้นเพื่อการวางแผนเท่านั้น กรุณาตรวจสอบกับกรมสรรพากรอีกครั้ง",
            themeLabel: "ธีม",
            themeLight: "Light",
            themeDark: "Dark"
        },
        en: {
            loadingAnimationLabel: "Animation Style",
            loadingMessage: "Loading Message",
            closeBtn: "Close", cancelBtn: "Cancel", confirmBtn: "Confirm", saveBtn: "Save", editBtn: "Edit", deleteBtn: "Delete",
            searchPlaceholder: "Search for products...", itemsListTitle: "Product List", tableHeaderItem: "Item", tableHeaderLevel: "Level", tableHeaderQuantity: "Quantity", tableHeaderManage: "Manage",
            viewOrderBtn: "View Order", confirmOrderBtn: "Confirm Order", totalAmount: "Total",
            adminLoginTitle: "Admin Login", pinLabel: "PIN", loginBtn: "Login", backToShopBtn: "Back to Shop", invalidPinError: "Invalid PIN!",
            pinAttemptsLeft: "{attemptsLeft} attempts left", pinLocked: "Login failed more than 5 times. System is locked.", pinUnlockCode: "Unlock with code 1340900210406",
            adminPanelTitle: "Admin Panel", viewShopBtn: "View Shop", logoutBtn: "Logout",
            menuAdmin: "Shop Settings", menuFestival: "Festival", menuStock: "Stock", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage Account", editMenuOrderBtn: "EDIT",
            menuTax: "Tax Check",
            shopInfoTitle: "Shop Info", shopLinkTitle: "Link for Customers", shopLinkInfo: "Share this link with customers for direct access to the shop (no Admin button).", copyLinkBtn: "Copy",
            systemFontsTitle: "System Fonts", fontPreviewText: "System Font Preview",
            shopNameLabel: "Shop Name", shopSloganLabel: "Slogan", managerNameLabel: "System Manager Name", shareholderNameLabel: "Major Shareholder Name",
            globalFontLabel: "Global Font", shopNameFontLabel: "Shop Name Font", sloganFontLabel: "Slogan Font",
            globalFontSizeLabel: "Global Font Size (%)", shopNameFontSizeLabel: "Shop Name Font Size", sloganFontSizeLabel: "Slogan Font Size",
            mainMenuFontSizeLabel: "Main Menu Font Size (%)", subMenuFontSizeLabel: "Sub Menu Font Size (%)",
            enableEffectLabel: "Enable Shop Name Effect", enableSloganEffectLabel: "Enable Slogan Effect",
            effectOffsetX: "Shadow Offset X", effectOffsetY: "Shadow Offset Y", effectBlur: "Blur", effectColor: "Shadow Color",
            orderFormatLabel: "Order Number Format", useLogoLabel: "Use Logo", uploadLogoLabel: "Upload Logo (PNG)",
            backgroundSettingsTitle: "Background Settings", uploadBgLabel: "Upload Background Image", bgOpacityLabel: "Opacity (Transparent-Opaque)", bgBlurLabel: "Blur (Low-High)",
            removeBgBtn: "Remove Background", previewBgBtn: "Preview", saveSettingsBtn: "Save Settings",
            copyrightTextLabel: "Copyright Text", copyrightOpacityLabel: "Opacity",
            changePinTitle: "Change Password", newPinLabel: "New PIN", saveNewPinBtn: "Save New PIN",
            manageCategoriesTitle: "Manage Categories", categoryNameLabel: "Category Name", categoryIconLabel: "Category Icon (PNG file)", minOrderLabel: "Minimum Order Quantity",
            setPriceLabel: "Set Price", setPerPiecePriceBtn: "Set Per-Piece Price", saveCategoryBtn: "Add/Save Category", categoryListTitle: "Category List",
            tableHeaderIcon: "Icon", tableHeaderName: "Name", tableHeaderMinOrder: "Min. Order", tableHeaderPrice: "Price",
            manageProductsTitle: "Manage Products", productNameLabel: "Product Name", levelLabel: "Level", stockQuantityLabel: "Stock Quantity", categoryLabel: "Category",
            productIconLabel: "Product Icon (PNG file)", productAvailableLabel: "Enable this product for sale", saveProductBtn: "Save Product", cancelEditBtn: "Cancel Edit",
            tableHeaderStock: "Stock", tableHeaderStatus: "Status", statusAvailable: "Available", statusUnavailable: "Unavailable",
            stockDatabaseTitle: "Stock Database", searchCategoryLabel: "Search Category", searchProductLabel: "Search Product", pullBtn: "Pull Data",
            selectDateLabel: "Select Date:", resetDataBtn: "Reset Data",
            confirmOrdersTitle: "New Orders", activeOrdersTitle: "Active Orders", cancelledOrdersTitle: "Cancelled Orders",
            tableHeaderOrderNo: "Order No.", tableHeaderDateTime: "Date/Time", tableHeaderTotal: "Total", viewDetailsBtn: "View Details", cancelOrderBtn: "Cancel",
            dashboardTitle: "Shop Overview", monthlyProfitTitle: "This Month's Profit", dailyOrdersTitle: "Today's Orders", monthlyOrdersTitle: "This Month's Orders", yearlySalesTitle: "Total Sales (This Year)",
            lowStockAlertTitle: "Low Stock Alert",
            menuStockSettings: "Stock Settings",
            lowStockSettingsTitle: "Stock Settings",
            lowStockSettingsInfo: "Set minimum stock quantities for each category (from the database) to receive alerts on the Dashboard.",
            noLowStockItems: "No items are running low on stock", categorySalesTitle: "Sales by Category", topSellingTitle: "Top 5 Selling Items",
            periodDay: "Today", periodMonth: "This Month", periodYear: "This Year", trafficStatsTitle: "Traffic Statistics", productStatsTitle: "Product Statistics (by quantity ordered)",
            manageAccountTitle: "Manage Accounts", subAdminLimitInfo: "Maximum of 20 sub-users allowed.", usernameLabel: "Username", addUserBtn: "Add User", subAdminListTitle: "Sub-User List",
            anomalyCheckTitle: "Anomaly Check", anomalyCheckInfo: "The system will log failed login attempts.", tableHeaderUser: "User", tableHeaderAttempts: "Failed Attempts", tableHeaderLockout: "Lockout Status",
            orderSummaryTitle: "Order Summary", copyOrderPrompt: "Please copy the text below to send to the shop.", copyOrderBtn: "Copy Order", copySuccessMessage: "Order copied successfully",
            yourOrderListTitle: "Your Order List", confirmPinTitle: "Confirm PIN", enterPinPrompt: "Enter PIN to confirm",
            confirmResetTitle: "Confirm Data Reset", selectResetPeriodPrompt: "Please select the period for which you want to reset data.", periodWeek: "This Week", periodAll: "All Data",
            setPerPiecePriceTitle: "Set Per-Piece Price", setPerPiecePriceInfo: "Define the price for every 10 pieces.", savePriceBtn: "Save Prices",
            reorderMenuTitle: "Reorder Menu", reorderMenuInfo: "Drag and drop to reorder the menu as desired.", saveOrderBtn: "Save Order",
            setPermissionsTitle: "Set Access Permissions", savePermissionsBtn: "Save Permissions",
            loadingBackgroundTitle: "Loading Background", uploadLoadingBgLabel: "Upload Loading Background Image", loadingBarStyleLabel: "Loading Bar Style",
            priceDetailsTitle: "Price Details", viewPriceBtn: "View Price",
            festivalTitle: "Festival Effects", shopStatusLabel: "Shop Open", shopClosedMessageLabel: "Message When Shop is Closed",
            messageFontColorLabel: "Font Color", messageFontSizeLabel: "Font Size",
            rainEffectLabel: "Rain Effect", rainIntensityLabel: "Intensity", effectOpacityLabel: "Opacity",
            snowEffectLabel: "Snow Effect", snowIntensityLabel: "Intensity",
            fireworksEffectLabel: "Fireworks Effect", fireworksIntensityLabel: "Frequency (minutes)",
            autumnEffectLabel: "Autumn Effect", autumnIntensityLabel: "Intensity",
            saveSuccessMessage: "Saved successfully!",
            systemThemeLabel: "System Theme", selectThemeBtn: "Select Theme", systemThemeTitle: "Select System Theme",
            previewLabel: "Preview", marqueeSpeedLabel: "Marquee Speed",
            stockDatabaseManageCats: "Manage Categories (Database)", stockDatabaseManageProds: "Manage Products (Database)",
            addCategoryBtn: "Add Category", addProductBtn: "Add Product",
            searchFromDb: "Search from Database", searchModalTitle: "Search from Database",
            enableMessageEffectLabel: "Enable Text Effect",
            stockDbInfo: "This is the main database for storing all product and category items. You can add/edit/delete data here and then use it on the shop's stock management page.",
            menuPromotions: "Promotions",
            promotionsTitle: "Manage Discount Codes",
            promoCodeLabel: "Discount Code",
            promoDiscountLabel: "Discount (%)",
            addPromoBtn: "Add Code",
            generatePromoBtn: "Generate Random Code",
            promoListTitle: "Discount Code List",
            tableHeaderCode: "Code",
            tableHeaderDiscount: "Discount",
            promoCodeInputLabel: "Enter discount code",
            applyPromoBtn: "Apply",
            discountLabel: "Discount",
            grandTotalLabel: "Grand Total",
            invalidPromoCode: "Invalid discount code",
            menuLogs: "Change Log",
            logsTitle: "Change History",
            tableHeaderTimestamp: "Timestamp",
            tableHeaderAction: "Action",
            tableHeaderDetails: "Details",
            menuTax: "Tax Check",
            taxTitle: "Personal Income Tax Estimation",
            taxYearLabel: "For tax year:",
            taxIncomeTitle: "1. Income (Assessable Income)",
            taxShopIncomeLabel: "Income from shop (auto-fetched)",
            taxOtherIncomeLabel: "Other Income",
            taxExpenseTitle: "2. Expenses",
            taxExpenseTypeLabel: "Select expense deduction type",
            taxExpenseFlatRate: "60% flat rate deduction",
            taxExpenseActual: "Deduct actual expenses",
            taxActualCostLabel: "Cost of goods",
            taxActualTransportLabel: "Transportation costs",
            taxActualAdLabel: "Advertising costs",
            taxActualOtherLabel: "Other expenses",
            taxDeductionTitle: "3. Allowances",
            taxDeductionPersonalLabel: "Personal",
            taxDeductionSpouseLabel: "Spouse (no income)",
            taxDeductionChildrenLabel: "Children (30,000 each)",
            taxDeductionSocialSecurityLabel: "Social Security (max 9,000)",
            taxDeductionInsuranceLabel: "Life/Health Insurance Premium",
            taxDeductionRmfLabel: "RMF",
            taxDeductionSsfLabel: "SSF",
            taxDeductionDonationsLabel: "Donations",
            taxDeductionHomeInterestLabel: "Home Loan Interest",
            calculateTaxBtn: "Calculate Tax",
            taxSummaryTitle: "4. Tax Estimation Summary",
            taxTotalIncome: "Total Income",
            taxTotalExpense: "Total Expenses",
            taxTotalDeduction: "Total Allowances",
            taxNetIncome: "Net Income",
            taxPayable: "Tax Payable",
            taxPnd94Label: "P.N.D. 94 (Mid-year tax due by Sept.)",
            taxPnd90Label: "P.N.D. 90 (Full-year tax due by Mar. of next year)",
            taxPaidPnd94: "Mid-year tax paid (P.N.D. 94)",
            taxFinalPayable: "Additional year-end tax payable",
            taxInfoText: "*This is a preliminary calculation for planning purposes only. Please verify with the Revenue Department.",
            themeLabel: "Theme",
            themeLight: "Light",
            themeDark: "Dark"
        }
    };

    const MENU_NAMES = {
        'dashboard': 'menuDashboard', 'order-number': 'menuOrderNumber', 'stock': 'menuStock',
        'admin': 'menuAdmin', 'tax': 'menuTax', 'festival': 'menuFestival', 'manage-account': 'menuManageAccount'
    };
    
    const SUB_MENUS = {
        'admin': { 
            'shop-info': 'shopInfoTitle', 'system-fonts': 'systemFontsTitle',
            'background': 'backgroundSettingsTitle', 'loading-bg': 'loadingBackgroundTitle', 
            'promotions': 'menuPromotions', 'pin': 'changePinTitle' 
        },
        'stock': { 
            'categories': 'manageCategoriesTitle', 
            'products': 'manageProductsTitle', 
            'stock-database': 'stockDatabaseTitle',
            'stock-settings': 'menuStockSettings' 
        },
        'order-number': { 'confirm-orders': 'confirmOrdersTitle', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' },
        'festival': { 'festival-effects': 'festivalTitle' },
        'manage-account': { 'accounts': 'manageAccountTitle', 'anomaly-check': 'anomalyCheckTitle', 'logs': 'menuLogs' }
    };

    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const addLog = (action, details) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: loggedInUser ? loggedInUser.name : 'System',
            action: action,
            details: details
        };
        appData.analytics.logs.unshift(logEntry);
        if (appData.analytics.logs.length > 200) {
            appData.analytics.logs.pop();
        }
    };

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
            
            const defaultSettings = appData.shopSettings;
            const defaultAnalytics = appData.analytics;
            const defaultTaxData = appData.taxData;

            appData = { ...appData, ...serverData };
            
            appData.shopSettings = {...defaultSettings, ...appData.shopSettings};
            appData.shopSettings.festival = {...defaultSettings.festival, ...appData.shopSettings.festival};
            appData.shopSettings.shopClosedMessage = {...defaultSettings.shopClosedMessage, ...appData.shopSettings.shopClosedMessage};
            if (!appData.shopSettings.shopClosedMessage.effect) {
                appData.shopSettings.shopClosedMessage.effect = defaultSettings.shopClosedMessage.effect;
            }
            appData.shopSettings.sloganEffect = {...defaultSettings.sloganEffect, ...appData.shopSettings.sloganEffect};
            if (!appData.shopSettings.dbCategoryLowStockThresholds) {
                appData.shopSettings.dbCategoryLowStockThresholds = {};
            }
            if (!appData.shopSettings.promotions) {
                appData.shopSettings.promotions = [];
            }
            
            appData.analytics = {...defaultAnalytics, ...serverData.analytics};
            appData.analytics.orders = appData.analytics.orders || [];
            appData.analytics.logs = appData.analytics.logs || [];

            appData.taxData = {...defaultTaxData, ...serverData.taxData};

            appData.stockDatabase = appData.stockDatabase || { categories: [], products: [] };

            appData.categories.forEach(cat => { if (cat.minOrderQuantity === undefined) cat.minOrderQuantity = 30; });
            appData.products.forEach(prod => {
                if (prod.isAvailable === undefined) prod.isAvailable = true;
                if (prod.stock === undefined) prod.stock = -1;
            });
            
            const expectedMenus = ['dashboard', 'order-number', 'stock', 'admin', 'tax', 'festival', 'manage-account'];
            const currentMenuSet = new Set(appData.menuOrder);
            expectedMenus.forEach(menu => { if (!currentMenuSet.has(menu)) appData.menuOrder.push(menu); });

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
    
    let activeAdminMenu = 'dashboard';
    let activeAdminSubMenus = { admin: 'shop-info', stock: 'categories', 'order-number': 'confirm-orders', 'manage-account': 'accounts', festival: 'festival-effects' };
    let activeCategoryId = null;
    let adminActiveCategoryId = null;
    let editingProductId = null;
    let editingCategoryId = null;
    let editingSubAdminId = null;
    let editingDbCategoryId = null;
    let editingDbProductId = null;
    let editingPromoId = null;
    let catIconFile = null;
    let prodIconFile = null;
    let logoFile = null;
    let bgFile = null;
    let loadingBgFile = null;
    let isAdminLoggedIn = false;
    let loggedInUser = null; 
    let currentAppliedPromo = null;
    
    let dailyTrafficChart, productSalesChart, categorySalesChart, taxChart;
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
        document.getElementById('loading-text').textContent = appData.shopSettings.loadingMessageText;
        langToggleBtn.textContent = '🌎';
    };

    langToggleBtn.addEventListener('click', async () => {
        const newLang = appData.shopSettings.language === 'th' ? 'en' : 'th';
        setLanguage(newLang);
        // We re-render to update any dynamic text that doesn't use data-translate-key
        if(views.customer.classList.contains('active')) {
            renderCustomerView();
        } else if (views.adminPanel.classList.contains('active')) {
            renderAdminPanel();
        }
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
        const progressBar = document.getElementById('progress-bar-container');
        document.getElementById('loading-text').textContent = appData.shopSettings.loadingMessageText;

        if (appData.shopSettings.loadingBackgroundImage) {
            loaderBg.style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
            loaderBg.style.opacity = appData.shopSettings.loadingBackgroundOpacity;
        } else {
            loaderBg.style.backgroundImage = 'none';
            loaderBg.style.opacity = 1;
        }
        progressBar.className = `progress-bar style-${appData.shopSettings.loadingBarStyle}`;
    };

    const applySystemTheme = (themeName) => {
        const theme = THEME_PRESETS[themeName];
        if (!theme) return;
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--info-color', theme.colors.info);
    };
    
    const applyTheme = (isPreview = false) => {
        const root = document.documentElement;
        
        applySystemTheme(appData.shopSettings.themeName);
        if (appData.shopSettings.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }
        
        const calculateFontSize = (base, percentage) => base * (percentage / 50);

        root.style.setProperty('--global-font-size', `${calculateFontSize(16, appData.shopSettings.globalFontSize)}px`);
        root.style.setProperty('--main-menu-font-size', `${calculateFontSize(0.9, appData.shopSettings.mainMenuFontSize)}rem`);
        root.style.setProperty('--sub-menu-font-size', `${calculateFontSize(1, appData.shopSettings.subMenuFontSize)}rem`);

        root.style.setProperty('--global-font', appData.shopSettings.globalFontFamily);
        root.style.setProperty('--shop-name-font-size', `${appData.shopSettings.shopNameFontSize}rem`);
        root.style.setProperty('--slogan-font-size', `${appData.shopSettings.sloganFontSize}rem`);
        
        shopNameDisplay.style.fontFamily = appData.shopSettings.fontFamily;
        shopNameDisplay.textContent = appData.shopSettings.shopName;
        sloganElement.textContent = appData.shopSettings.slogan;
        
        const nameEffect = appData.shopSettings.shopNameEffect;
        shopNameDisplay.style.textShadow = nameEffect.enabled ? `${nameEffect.offsetX}px ${nameEffect.offsetY}px ${nameEffect.blur}px ${nameEffect.color}` : '1px 1px 2px rgba(0,0,0,0.1)';

        const sloganEffect = appData.shopSettings.sloganEffect;
        sloganElement.style.textShadow = sloganEffect.enabled ? `${sloganEffect.offsetX}px ${sloganEffect.offsetY}px ${sloganEffect.blur}px ${sloganEffect.color}` : 'none';
        sloganElement.style.fontFamily = appData.shopSettings.sloganFontFamily;
        
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

        copyrightFooter.textContent = appData.shopSettings.copyrightText;
        copyrightFooter.style.opacity = appData.shopSettings.copyrightOpacity;

        if (!isPreview) {
            applyBackground();
            applyLoadingBackground();
        }
        setLanguage(appData.shopSettings.language);
        updateShopStatusView();
        initFestivalEffects();
    };
    
    themeToggleBtn.addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        appData.shopSettings.darkMode = !appData.shopSettings.darkMode;
        addLog('Toggled Dark Mode', `Set to ${appData.shopSettings.darkMode}`);
        applyTheme();
        await saveState();
    });
    
    const updateShopStatusView = () => {
        const marqueeContainer = document.getElementById('shop-closed-marquee');
        const marqueeText = document.getElementById('marquee-text');

        if (!appData.shopSettings.shopEnabled) {
            const msgSettings = appData.shopSettings.shopClosedMessage;
            marqueeText.textContent = msgSettings.text;
            marqueeText.style.color = msgSettings.color;
            marqueeText.style.fontSize = `${msgSettings.size}px`;
            
            const effect = msgSettings.effect;
            marqueeText.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : 'none';

            document.documentElement.style.setProperty('--marquee-duration', `${msgSettings.speed}s`);
            marqueeContainer.style.display = 'block';
        } else {
            marqueeContainer.style.display = 'none';
        }
    };

    const isCustomerViewOnly = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('customer') === 'true';
    };

    const renderCustomerView = () => {
        applyTheme();
        renderCategoryTabs();
        renderProducts();
        checkOrderValidation();
        adminGearIcon.style.display = isAdminLoggedIn || isCustomerViewOnly() ? 'none' : 'flex';
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
        const lang = appData.shopSettings.language;
        
        if (searchTerm) {
            productsToDisplay = appData.products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
            currentCategoryName.textContent = (lang === 'th' ? `ผลการค้นหาสำหรับ: "${searchTerm}"` : `Search results for: "${searchTerm}"`);
        } else {
            const activeCategory = appData.categories.find(c => c.id === activeCategoryId);
            if (!activeCategory) {
                productTableBody.innerHTML = `<tr><td colspan="4">${lang === 'th' ? 'กรุณาเลือกหมวดหมู่' : 'Please select a category'}</td></tr>`;
                currentCategoryName.textContent = '';
                return;
            }
            currentCategoryName.textContent = `${activeCategory.name}`;
            productsToDisplay = appData.products.filter(p => p.categoryId === activeCategoryId);
        }
        
        if (productsToDisplay.length === 0) {
             productTableBody.innerHTML = `<tr><td colspan="4">${lang === 'th' ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไข' : 'No products found'}</td></tr>`;
        } else {
            productsToDisplay.forEach(prod => {
                const quantity = appData.cart[prod.id] || 0;
                const isPhysicallyOutOfStock = prod.stock !== -1 && prod.stock <= 0;
                const isUnavailableByAdmin = !prod.isAvailable;
                const row = document.createElement('tr');
                if (isUnavailableByAdmin || isPhysicallyOutOfStock) row.classList.add('product-unavailable');
                let quantityAndManageCells = isUnavailableByAdmin ? `<td colspan="2" class="status-cell">${lang === 'th' ? 'สินค้าหมดชั่วคราว' : 'Temporarily Out of Stock'}</td>` : `
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
        const lang = appData.shopSettings.language;

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
                const message = lang === 'th' 
                    ? `➡️ หมวด "${category.name}" ขั้นต่ำ ${category.minOrderQuantity} ชิ้น (ขาด ${category.minOrderQuantity - total} ชิ้น)`
                    : `➡️ Category "${category.name}" requires a minimum of ${category.minOrderQuantity} items (short by ${category.minOrderQuantity - total})`;
                minOrderMessages.push(`<div class="validation-link" data-cat-id="${categoryId}">${message}</div>`);
            }
            const priceResult = calculatePrice(parseInt(categoryId), total);
            totalOrderPrice += priceResult.price;
        }
        
        let discountAmount = 0;
        let grandTotal = totalOrderPrice;
        if (currentAppliedPromo) {
            discountAmount = totalOrderPrice * (currentAppliedPromo.discount / 100);
            grandTotal = totalOrderPrice - discountAmount;
        }

        const currencySuffix = lang === 'th' ? 'บาท' : 'THB';

        if (minOrderMessages.length > 0) {
            orderValidationMsg.innerHTML = minOrderMessages.join('');
            confirmOrderBtn.disabled = true;
            viewOrderBtn.disabled = true;
        } else {
            if (totalOrderPrice > 0) {
                let summaryHTML = `<span style="font-weight: bold;">${translations[lang].totalAmount}: ${totalOrderPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}</span>`;
                if (discountAmount > 0) {
                    summaryHTML += `<br><span style="color: var(--danger-color);">${translations[lang].discountLabel} (${currentAppliedPromo.code}): -${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}</span>`;
                    summaryHTML += `<br><span style="font-weight: bold; font-size: 1.1em; color: var(--primary-color);">${translations[lang].grandTotalLabel}: ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}</span>`;
                }
                orderValidationMsg.innerHTML = summaryHTML;
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
        const lang = appData.shopSettings.language;
        let summaryText = `${appData.shopSettings.shopName}\n`;
        if (orderNumber) summaryText += `${lang === 'th' ? 'เลขที่ออเดอร์' : 'Order No.'}: ${orderNumber}\n\n`;
        
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
        
        const currencySuffix = lang === 'th' ? 'บาท' : 'THB';

        for (const categoryId in itemsByCategory) {
            const categoryData = itemsByCategory[categoryId];
            if (categoryData.items.length > 0) {
                summaryText += `--- ${lang === 'th' ? 'หมวดหมู่' : 'Category'}: ${categoryData.name} ---\n${categoryData.items.join('\n')}\n`;
                const priceResult = calculatePrice(parseInt(categoryId), categoryData.totalQuantity);
                if (priceResult.price > 0) {
                    summaryText += `${lang === 'th' ? 'ราคาหมวดหมู่' : 'Category Price'}: ${priceResult.price} ${currencySuffix}\n`;
                    totalOrderPrice += priceResult.price;
                }
                summaryText += '\n';
            }
        }
        
        summaryText += `${translations[lang].totalAmount}: ${totalOrderPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}\n`;
        
        if (currentAppliedPromo) {
            const discountAmount = totalOrderPrice * (currentAppliedPromo.discount / 100);
            const grandTotal = totalOrderPrice - discountAmount;
            summaryText += `${translations[lang].discountLabel} (${currentAppliedPromo.code} -${currentAppliedPromo.discount}%): -${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}\n`;
            summaryText += `${translations[lang].grandTotalLabel}: ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}`;
        } else {
            summaryText += `${lang === 'th' ? 'ยอดรวมทั้งหมด' : 'Total Amount'}: ${totalOrderPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}`;
        }

        return (totalOrderPrice === 0 && Object.values(appData.cart).every(q => q === 0)) ? (lang === 'th' ? 'ไม่มีสินค้าในรายการสั่งซื้อ' : 'No items in the order') : summaryText;
    };
    
    const handleOrderAction = (isConfirm) => {
        if (isConfirm) {
            checkOrderValidation(); 
            if (orderValidationMsg.innerHTML.includes('ขั้นต่ำ') || orderValidationMsg.innerHTML.includes('minimum') || confirmOrderBtn.disabled) return;
        }

        const promoContainer = document.getElementById('promo-code-container');
        if (appData.shopSettings.promotions && appData.shopSettings.promotions.length > 0) {
            promoContainer.style.display = 'block';
        } else {
            promoContainer.style.display = 'none';
        }

        if (isConfirm) {
            document.getElementById('order-modal-title').dataset.translateKey = "orderSummaryTitle";
            document.getElementById('order-modal-prompt').style.display = 'block';
            document.getElementById('copy-order-btn').style.display = 'inline-block';
            const orderNumber = generateOrderNumber();
            orderDetails.textContent = createOrderSummaryText(orderNumber);
            orderDetails.dataset.orderNumber = orderNumber;
            orderModal.style.display = 'flex';
        } else {
            document.getElementById('cart-details').textContent = createOrderSummaryText();
            cartModal.style.display = 'flex';
        }
        setLanguage(appData.shopSettings.language);
    };

    confirmOrderBtn.addEventListener('click', () => handleOrderAction(true));
    viewOrderBtn.addEventListener('click', () => handleOrderAction(false));

    document.getElementById('apply-promo-btn').addEventListener('click', () => {
        const codeInput = document.getElementById('promo-code-input');
        const code = codeInput.value.trim().toUpperCase();
        const promo = appData.shopSettings.promotions.find(p => p.code.toUpperCase() === code);
        const lang = appData.shopSettings.language;

        if (promo) {
            currentAppliedPromo = promo;
            alert((lang === 'th' ? `ใช้โค้ด ${promo.code} สำเร็จ! ได้รับส่วนลด ${promo.discount}%` : `Code ${promo.code} applied! You get a ${promo.discount}% discount.`));
        } else {
            currentAppliedPromo = null;
            alert(translations[lang].invalidPromoCode);
        }
        orderDetails.textContent = createOrderSummaryText(orderDetails.dataset.orderNumber);
    });

    document.getElementById('copy-order-btn').addEventListener('click', async () => {
        orderModal.style.display = 'none';
        const successModal = document.getElementById('copy-success-modal');
        successModal.style.display = 'flex';
        
        const orderText = orderDetails.textContent;
        try {
            await navigator.clipboard.writeText(orderText);
            const totalMatch = orderText.match(/ยอดรวมสุทธิ: ([\d,.]+) /) || orderText.match(/Grand Total: ([\d,.]+) /) || orderText.match(/ยอดรวมทั้งหมด: ([\d,.]+) /) || orderText.match(/Total Amount: ([\d,.]+) /);
            const totalOrderPrice = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;
            
            if (!isNaN(totalOrderPrice) && totalOrderPrice >= 0) {
                const newOrder = { 
                    id: orderDetails.dataset.orderNumber, 
                    timestamp: new Date().toISOString(), 
                    total: totalOrderPrice, 
                    items: { ...appData.cart }, 
                    status: 'new',
                    promoApplied: currentAppliedPromo 
                };
                appData.analytics.orders.push(newOrder);
                addLog('Order Created', `Order #${newOrder.id}, Total: ${newOrder.total}`);

                for (const prodId in appData.cart) {
                    if (appData.cart[prodId] > 0) {
                        const product = appData.products.find(p => p.id == prodId);
                        if (product) {
                            if (!appData.analytics.productSales[product.name]) appData.analytics.productSales[product.name] = 0;
                            appData.analytics.productSales[product.name] += appData.cart[prodId];
                            if (product.stock !== -1) {
                                const oldStock = product.stock;
                                product.stock = Math.max(0, product.stock - appData.cart[prodId]);
                                addLog('Stock Updated (Sale)', `Product: ${product.name}, Old: ${oldStock}, New: ${product.stock}`);
                            }
                        }
                    }
                }
            }
            appData.cart = {};
            currentAppliedPromo = null;
            document.getElementById('promo-code-input').value = '';
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
        const lang = appData.shopSettings.language;
         if (confirm(lang === 'th' ? 'คุณต้องการรีเซ็ทรายการสั่งซื้อทั้งหมดหรือไม่?' : 'Are you sure you want to reset your entire order?')) {
            appData.cart = {};
            currentAppliedPromo = null;
            document.getElementById('promo-code-input').value = '';
            renderCustomerView();
            alert(lang === 'th' ? 'รีเซ็ทรายการสั่งซื้อเรียบร้อยแล้ว!' : 'Order has been reset!');
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
        const lockoutMessage = document.getElementById('lockout-message');
        const pin = pinInput.value;
        let loggedIn = false;
        
        const unlockCode = '1340900210406';
        if (pin === unlockCode && appData.analytics.loginAttempts.isLocked) {
             appData.analytics.loginAttempts.isLocked = false;
             appData.analytics.loginAttempts.admin = 0;
             addLog('System Unlocked', 'Super Admin lockout was reset.');
             await saveState();
             lockoutMessage.textContent = 'ระบบปลดล็อกแล้ว! กรุณาลองล็อกอินอีกครั้ง';
             pinInput.value = '';
             return;
        }

        if (appData.analytics.loginAttempts.isLocked) {
            lockoutMessage.style.display = 'block';
            lockoutMessage.textContent = translations[appData.shopSettings.language].pinLocked;
            return;
        }

        let userType = null;
        let userId = null;

        if (pin === appData.adminPin) {
            userType = 'admin';
        } else {
            const subAdmin = appData.subAdmins.find(sa => sa.pin === pin);
            if (subAdmin) {
                userType = 'subAdmin';
                userId = subAdmin.id;
            }
        }
        
        if (userType) {
            if (userType === 'admin') {
                appData.analytics.loginAttempts.admin = 0;
                loggedInUser = { name: 'Super Admin', isSuper: true, permissions: {} };
                appData.menuOrder.forEach(key => loggedInUser.permissions[key] = true);
            } else {
                appData.analytics.subAdminAttempts[userId] = 0;
                loggedInUser = appData.subAdmins.find(sa => sa.id === userId);
            }
            isAdminLoggedIn = true;
            loggedIn = true;
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            addLog('Login Success', `User: ${loggedInUser.name}`);
        } else {
            const now = new Date().getTime();
            const lastAttempt = appData.analytics.loginAttempts.lastAttempt;
            if (lastAttempt && (now - lastAttempt) > 300000) { // 5 minutes reset
                appData.analytics.loginAttempts.admin = 0;
                appData.analytics.subAdminAttempts = {};
            }
            appData.analytics.loginAttempts.admin++;
            appData.analytics.loginAttempts.lastAttempt = now;
            addLog('Login Failed', `Attempt with PIN: ${pin}`);

            if (appData.analytics.loginAttempts.admin >= 5) {
                appData.analytics.loginAttempts.isLocked = true;
                lockoutMessage.style.display = 'block';
                lockoutMessage.textContent = translations[appData.shopSettings.language].pinLocked;
                loginError.textContent = '';
                pinInput.value = '';
                addLog('System Locked', 'Too many failed login attempts for Super Admin.');
            } else {
                loginError.textContent = `${translations[appData.shopSettings.language].invalidPinError} ${translations[appData.shopSettings.language].pinAttemptsLeft.replace('{attemptsLeft}', 5 - appData.analytics.loginAttempts.admin)}`;
            }
        }
        
        await saveState();

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
        }
    });
    
    document.getElementById('logout-btn').addEventListener('click', () => {
        addLog('Logout', `User: ${loggedInUser.name}`);
        isAdminLoggedIn = false;
        loggedInUser = null;
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('loggedInUser');
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
            reorderBtn.className = 'btn btn-small reorder-btn';
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
                const customerLink = `${window.location.origin}${window.location.pathname}?customer=true`;
                document.getElementById('customer-link-display').value = customerLink;
            } else if (activeSub === 'system-fonts') {
                document.getElementById('global-font-size-perc').value = appData.shopSettings.globalFontSize;
                document.getElementById('main-menu-font-size-perc').value = appData.shopSettings.mainMenuFontSize;
                document.getElementById('sub-menu-font-size-perc').value = appData.shopSettings.subMenuFontSize;
                document.getElementById('shop-name-font-size').value = appData.shopSettings.shopNameFontSize;
                document.getElementById('slogan-font-size').value = appData.shopSettings.sloganFontSize;
                document.getElementById('shop-global-font').value = appData.shopSettings.globalFontFamily;
                document.getElementById('shop-font').value = appData.shopSettings.fontFamily;
                document.getElementById('slogan-font').value = appData.shopSettings.sloganFontFamily;
                document.getElementById('font-preview').style.fontFamily = appData.shopSettings.fontFamily;
                document.getElementById('slogan-font-preview').style.fontFamily = appData.shopSettings.sloganFontFamily;
                document.getElementById('global-font-preview').style.fontFamily = appData.shopSettings.globalFontFamily;
                document.getElementById('logo-toggle').checked = appData.shopSettings.useLogo;
                document.getElementById('logo-preview').style.display = appData.shopSettings.logo ? 'block' : 'none';
                if(appData.shopSettings.logo) document.getElementById('logo-preview').src = appData.shopSettings.logo;
                const nameEffect = appData.shopSettings.shopNameEffect;
                document.getElementById('effect-toggle').checked = nameEffect.enabled;
                document.getElementById('effect-offset-x').value = nameEffect.offsetX;
                document.getElementById('effect-offset-y').value = nameEffect.offsetY;
                document.getElementById('effect-blur').value = nameEffect.blur;
                document.getElementById('effect-color').value = nameEffect.color;
                document.getElementById('effect-controls-container').style.display = nameEffect.enabled ? 'grid' : 'none';

                const sloganEffect = appData.shopSettings.sloganEffect;
                document.getElementById('slogan-effect-toggle').checked = sloganEffect.enabled;
                document.getElementById('slogan-effect-offset-x').value = sloganEffect.offsetX;
                document.getElementById('slogan-effect-offset-y').value = sloganEffect.offsetY;
                document.getElementById('slogan-effect-blur').value = sloganEffect.blur;
                document.getElementById('slogan-effect-color').value = sloganEffect.color;
                document.getElementById('slogan-effect-controls-container').style.display = sloganEffect.enabled ? 'grid' : 'none';

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
                document.getElementById('loading-message-text').value = appData.shopSettings.loadingMessageText;
                document.getElementById('loading-bg-opacity').value = appData.shopSettings.loadingBackgroundOpacity;
                document.getElementById('loading-bar-style').value = appData.shopSettings.loadingBarStyle;
                document.getElementById('loading-animation-style').value = appData.shopSettings.loadingAnimation;
                const loadingBgPreview = document.getElementById('loading-bg-preview');
                loadingBgPreview.style.display = appData.shopSettings.loadingBackgroundImage ? 'block' : 'none';
                if(appData.shopSettings.loadingBackgroundImage) loadingBgPreview.style.backgroundImage = `url(${appData.shopSettings.loadingBackgroundImage})`;
                renderLoadingBarPreviews();
                renderLoadingAnimationPreviews();
            } else if (activeSub === 'promotions') {
                renderPromotions();
            }
        } else if (activeAdminMenu === 'festival' && canAccess('festival')) {
            const container = document.getElementById('admin-menu-festival');
            container.style.display = 'block';
            document.getElementById('festival-tabs').style.display = 'none';
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            document.getElementById('admin-sub-festival-effects').classList.add('active');

            const msgSettings = appData.shopSettings.shopClosedMessage;
            document.getElementById('shop-closed-message-text').value = msgSettings.text;
            document.getElementById('shop-closed-message-color').value = msgSettings.color;
            document.getElementById('shop-closed-message-size').value = msgSettings.size;
            document.getElementById('marquee-speed').value = msgSettings.speed;
            document.getElementById('message-effect-toggle').checked = msgSettings.effect.enabled;
            document.getElementById('message-effect-offset-x').value = msgSettings.effect.offsetX;
            document.getElementById('message-effect-offset-y').value = msgSettings.effect.offsetY;
            document.getElementById('message-effect-blur').value = msgSettings.effect.blur;
            document.getElementById('message-effect-color').value = msgSettings.effect.color;
            updateMessagePreview();

            document.getElementById('rain-effect-toggle').checked = appData.shopSettings.festival.rain.enabled;
            document.getElementById('rain-intensity').value = appData.shopSettings.festival.rain.intensity;
            document.getElementById('rain-opacity').value = appData.shopSettings.festival.rain.opacity;
            document.getElementById('snow-effect-toggle').checked = appData.shopSettings.festival.snow.enabled;
            document.getElementById('snow-intensity').value = appData.shopSettings.festival.snow.intensity;
            document.getElementById('snow-opacity').value = appData.shopSettings.festival.snow.opacity;
            document.getElementById('fireworks-effect-toggle').checked = appData.shopSettings.festival.fireworks.enabled;
            document.getElementById('fireworks-intensity').value = appData.shopSettings.festival.fireworks.intensity;
            document.getElementById('fireworks-opacity').value = appData.shopSettings.festival.fireworks.opacity;
            document.getElementById('autumn-effect-toggle').checked = appData.shopSettings.festival.autumn.enabled;
            document.getElementById('autumn-intensity').value = appData.shopSettings.festival.autumn.intensity;
            document.getElementById('autumn-opacity').value = appData.shopSettings.festival.autumn.opacity;

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
            } else if (activeSub === 'stock-database') {
                renderStockDatabase();
            } else if (activeSub === 'stock-settings') {
                renderStockSettingsPage();
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
            if (!fp) fp = flatpickr(datePicker, { defaultDate: selectedDate, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => { selectedDate = dateStr; renderDashboard(); } });
            renderDashboard();
        } else if (activeAdminMenu === 'tax' && canAccess('tax')) {
            document.getElementById('admin-menu-tax').style.display = 'block';
            renderTaxView();
        } else if (activeAdminMenu === 'manage-account' && canAccess('manage-account')) {
            const container = document.getElementById('admin-menu-manage-account');
            container.style.display = 'block';
            renderSubMenu('manage-account', 'admin-account-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus['manage-account'];
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            if (activeSub === 'accounts') {
                renderSubAdmins();
            } else if (activeSub === 'anomaly-check') {
                renderAnomalyCheck();
            } else if (activeSub === 'logs') {
                renderLogs();
            }
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
        renderLowStockAlertWidget();
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

    const renderLowStockAlertWidget = () => {
        const widgetEl = document.getElementById('low-stock-alert-widget');
        widgetEl.innerHTML = '';
        const lowStockAlerts = [];

        const productToDbCategoryMap = {};
        appData.products.forEach(p => {
            const storeCategory = appData.categories.find(c => c.id === p.categoryId);
            if (storeCategory) {
                const dbCategory = appData.stockDatabase.categories.find(dbc => dbc.name === storeCategory.name);
                if (dbCategory) {
                    productToDbCategoryMap[p.id] = dbCategory.id;
                }
            }
        });

        appData.stockDatabase.categories.forEach(dbCat => {
            const productsInDbCat = appData.products.filter(p => productToDbCategoryMap[p.id] === dbCat.id && p.stock !== -1);
            if (productsInDbCat.length === 0) return;

            const totalStock = productsInDbCat.reduce((sum, p) => sum + p.stock, 0);
            const threshold = appData.shopSettings.dbCategoryLowStockThresholds[dbCat.id] ?? appData.shopSettings.lowStockThreshold;
            
            if (totalStock < threshold) {
                lowStockAlerts.push({
                    name: dbCat.name,
                    stock: totalStock,
                    threshold: threshold,
                    isCriticallyLow: totalStock < (threshold / 2)
                });
            }
        });

        if (lowStockAlerts.length === 0) {
            widgetEl.innerHTML = `<p>${translations[appData.shopSettings.language].noLowStockItems}</p>`;
            return;
        }

        const alertList = document.createElement('ol');
        alertList.className = 'low-stock-list';
        lowStockAlerts.sort((a,b) => a.stock - b.stock).forEach(alert => {
            const li = document.createElement('li');
            if (alert.isCriticallyLow) li.className = 'blinking-warning';
            li.innerHTML = `<span>${alert.name}</span><strong>${alert.stock.toLocaleString()} / ${alert.threshold.toLocaleString()} ชิ้น</strong>`;
            alertList.appendChild(li);
        });
        widgetEl.appendChild(alertList);
    };

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
    const sloganFontSelect = document.getElementById('slogan-font');
    const fontPreview = document.getElementById('font-preview');
    const sloganFontPreview = document.getElementById('slogan-font-preview');
    const globalFontPreview = document.getElementById('global-font-preview');

    const populateFontSelectors = () => {
        FONT_OPTIONS.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            fontSelect.appendChild(option.cloneNode(true));
            globalFontSelect.appendChild(option.cloneNode(true));
            sloganFontSelect.appendChild(option.cloneNode(true));
        });
    };
    populateFontSelectors();

    fontSelect.addEventListener('change', (e) => fontPreview.style.fontFamily = e.target.value);
    globalFontSelect.addEventListener('change', (e) => globalFontPreview.style.fontFamily = e.target.value);
    sloganFontSelect.addEventListener('change', (e) => sloganFontPreview.style.fontFamily = e.target.value);

    document.getElementById('copy-customer-link-btn').addEventListener('click', () => {
        const linkInput = document.getElementById('customer-link-display');
        linkInput.select();
        document.execCommand('copy');
        alert('คัดลอกลิงก์สำเร็จ!');
    });

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
        const nameEffect = {
            enabled: document.getElementById('effect-toggle').checked,
            offsetX: document.getElementById('effect-offset-x').value,
            offsetY: document.getElementById('effect-offset-y').value,
            blur: document.getElementById('effect-blur').value,
            color: document.getElementById('effect-color').value
        };
        fontPreview.style.textShadow = nameEffect.enabled ? `${nameEffect.offsetX}px ${nameEffect.offsetY}px ${nameEffect.blur}px ${nameEffect.color}` : 'none';

        const sloganEffect = {
            enabled: document.getElementById('slogan-effect-toggle').checked,
            offsetX: document.getElementById('slogan-effect-offset-x').value,
            offsetY: document.getElementById('slogan-effect-offset-y').value,
            blur: document.getElementById('slogan-effect-blur').value,
            color: document.getElementById('slogan-effect-color').value
        };
        sloganFontPreview.style.textShadow = sloganEffect.enabled ? `${sloganEffect.offsetX}px ${sloganEffect.offsetY}px ${sloganEffect.blur}px ${sloganEffect.color}` : 'none';
    };

    document.getElementById('effect-controls-container').addEventListener('input', updateFontPreviewEffect);
    document.getElementById('effect-toggle').addEventListener('change', (e) => {
        document.getElementById('effect-controls-container').style.display = e.target.checked ? 'grid' : 'none';
        updateFontPreviewEffect();
    });

    document.getElementById('slogan-effect-controls-container').addEventListener('input', updateFontPreviewEffect);
    document.getElementById('slogan-effect-toggle').addEventListener('change', (e) => {
        document.getElementById('slogan-effect-controls-container').style.display = e.target.checked ? 'grid' : 'none';
        updateFontPreviewEffect();
    });

    document.getElementById('save-shop-info-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        const oldSettings = { ...appData.shopSettings };
        appData.shopSettings.shopName = document.getElementById('shop-name').value;
        appData.shopSettings.slogan = document.getElementById('shop-slogan').value;
        appData.shopSettings.managerName = document.getElementById('manager-name').value;
        appData.shopSettings.shareholderName = document.getElementById('shareholder-name').value;
        appData.shopSettings.orderNumberFormat = document.getElementById('order-format-select').value;
        addLog('Shop Info Updated', `Name: ${oldSettings.shopName} -> ${appData.shopSettings.shopName}`);
        await saveState();
        applyTheme();
    });

    document.getElementById('save-system-fonts-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('System Fonts Updated', 'Font and style settings were changed.');
        appData.shopSettings.fontFamily = document.getElementById('shop-font').value;
        appData.shopSettings.globalFontFamily = document.getElementById('shop-global-font').value;
        appData.shopSettings.sloganFontFamily = document.getElementById('slogan-font').value;
        appData.shopSettings.globalFontSize = parseFloat(document.getElementById('global-font-size-perc').value);
        appData.shopSettings.mainMenuFontSize = parseFloat(document.getElementById('main-menu-font-size-perc').value);
        appData.shopSettings.subMenuFontSize = parseFloat(document.getElementById('sub-menu-font-size-perc').value);
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
        appData.shopSettings.sloganEffect = {
            enabled: document.getElementById('slogan-effect-toggle').checked,
            offsetX: document.getElementById('slogan-effect-offset-x').value,
            offsetY: document.getElementById('slogan-effect-offset-y').value,
            blur: document.getElementById('slogan-effect-blur').value,
            color: document.getElementById('slogan-effect-color').value
        };
        if (logoFile) appData.shopSettings.logo = await readFileAsBase64(logoFile);
        appData.shopSettings.copyrightText = document.getElementById('copyright-text').value;
        appData.shopSettings.copyrightOpacity = document.getElementById('copyright-opacity').value;

        await saveState();
        applyTheme();
    });
    
    document.getElementById('save-background-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('Background Updated', 'Main background settings changed.');
        appData.shopSettings.backgroundOpacity = document.getElementById('bg-opacity').value;
        appData.shopSettings.backgroundBlur = document.getElementById('bg-blur').value;
        if (bgFile) appData.shopSettings.backgroundImage = await readFileAsBase64(bgFile);
        await saveState();
        applyTheme();
    });
    
    document.getElementById('save-loading-bg-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('Loading BG Updated', 'Loading screen settings changed.');
        appData.shopSettings.loadingMessageText = document.getElementById('loading-message-text').value;
        appData.shopSettings.loadingBackgroundOpacity = document.getElementById('loading-bg-opacity').value;
        appData.shopSettings.loadingBarStyle = document.getElementById('loading-bar-style').value;
        appData.shopSettings.loadingAnimation = document.getElementById('loading-animation-style').value;
        if (loadingBgFile) appData.shopSettings.loadingBackgroundImage = await readFileAsBase64(loadingBgFile);
        
        await saveState();
        
        applyLoadingBackground();
        applyLoadingAnimation();
    });
    
    document.getElementById('save-festival-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('Festival Settings Updated', 'Festival effects and shop closed message changed.');
        appData.shopSettings.shopClosedMessage.text = document.getElementById('shop-closed-message-text').value;
        appData.shopSettings.shopClosedMessage.color = document.getElementById('shop-closed-message-color').value;
        appData.shopSettings.shopClosedMessage.size = parseInt(document.getElementById('shop-closed-message-size').value);
        appData.shopSettings.shopClosedMessage.speed = parseInt(document.getElementById('marquee-speed').value);
        appData.shopSettings.shopClosedMessage.effect = {
            enabled: document.getElementById('message-effect-toggle').checked,
            offsetX: document.getElementById('message-effect-offset-x').value,
            offsetY: document.getElementById('message-effect-offset-y').value,
            blur: document.getElementById('message-effect-blur').value,
            color: document.getElementById('message-effect-color').value
        };

        appData.shopSettings.festival.rain.enabled = document.getElementById('rain-effect-toggle').checked;
        appData.shopSettings.festival.rain.intensity = document.getElementById('rain-intensity').value;
        appData.shopSettings.festival.rain.opacity = document.getElementById('rain-opacity').value;
        appData.shopSettings.festival.snow.enabled = document.getElementById('snow-effect-toggle').checked;
        appData.shopSettings.festival.snow.intensity = document.getElementById('snow-intensity').value;
        appData.shopSettings.festival.snow.opacity = document.getElementById('snow-opacity').value;
        appData.shopSettings.festival.fireworks.enabled = document.getElementById('fireworks-effect-toggle').checked;
        appData.shopSettings.festival.fireworks.intensity = document.getElementById('fireworks-intensity').value;
        appData.shopSettings.festival.fireworks.opacity = document.getElementById('fireworks-opacity').value;
        appData.shopSettings.festival.autumn.enabled = document.getElementById('autumn-effect-toggle').checked;
        appData.shopSettings.festival.autumn.intensity = document.getElementById('autumn-intensity').value;
        appData.shopSettings.festival.autumn.opacity = document.getElementById('autumn-opacity').value;

        await saveState();
        applyTheme();
    });

    const updateMessagePreview = () => {
        const previewContainer = document.getElementById('message-preview-container');
        const previewBox = document.getElementById('message-preview-box');
        const isEffectEnabled = document.getElementById('message-effect-toggle').checked;

        if (isEffectEnabled) {
            const text = document.getElementById('shop-closed-message-text').value;
            const color = document.getElementById('shop-closed-message-color').value;
            const size = document.getElementById('shop-closed-message-size').value;
            const offsetX = document.getElementById('message-effect-offset-x').value;
            const offsetY = document.getElementById('message-effect-offset-y').value;
            const blur = document.getElementById('message-effect-blur').value;
            const shadowColor = document.getElementById('message-effect-color').value;

            previewBox.textContent = text || "ตัวอย่างข้อความ";
            previewBox.style.color = color;
            previewBox.style.fontSize = `${size}px`;
            previewBox.style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`;
            
            previewContainer.style.display = 'block';
        } else {
            previewContainer.style.display = 'none';
        }
    };

    document.getElementById('admin-menu-festival').addEventListener('input', updateMessagePreview);
    document.getElementById('message-effect-toggle').addEventListener('change', updateMessagePreview);


    document.getElementById('shop-enabled-toggle').addEventListener('change', async (e) => {
        appData.shopSettings.shopEnabled = e.target.checked;
        addLog('Shop Status Changed', `Shop set to ${e.target.checked ? 'Open' : 'Closed'}`);
        updateShopStatusView();
        await saveState();
    });

    document.getElementById('change-pin-btn').addEventListener('click', async (e) => {
        const newPin = document.getElementById('new-pin').value;
        if (newPin && newPin.length >= 4) {
            if (confirm(`คุณต้องการเปลี่ยน PIN เป็น "${newPin}" ใช่หรือไม่?`)) {
                showSaveFeedback(e.currentTarget);
                addLog('Super Admin PIN Changed', `PIN was changed.`);
                appData.adminPin = newPin;
                appData.analytics.loginAttempts.admin = 0;
                appData.analytics.loginAttempts.isLocked = false;
                await saveState();
                document.getElementById('new-pin').value = '';
                alert('เปลี่ยน PIN สำเร็จ!');
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
                const oldName = appData.categories[index].name;
                appData.categories[index].name = name;
                appData.categories[index].minOrderQuantity = minOrder;
                if (iconData) appData.categories[index].icon = iconData;
                addLog('Category Updated', `'${oldName}' -> '${name}'`);
            }
        } else {
            appData.categories.push({ id: generateId(), name, icon: iconData, perPiecePrices: [], bulkPrices: [], minOrderQuantity: minOrder });
            addLog('Category Created', `Name: '${name}'`);
        }
        
        await saveState();
        resetCategoryForm();
        renderAdminPanel();
    });
    
    const deleteCategory = async (id) => {
        const categoryToDelete = appData.categories.find(c => c.id === id);
        if (!categoryToDelete) return;
        if (confirm(`การลบหมวดหมู่ "${categoryToDelete.name}" จะลบสินค้าทั้งหมดในหมวดหมู่นั้นด้วย ยืนยันหรือไม่?`)) {
            addLog('Category Deleted', `Name: '${categoryToDelete.name}' and all its products.`);
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
                const oldProduct = { ...appData.products[index] };
                const existingIcon = appData.products[index].icon;
                appData.products[index] = { ...appData.products[index], ...product, icon: product.icon || existingIcon };
                let logDetails = `'${oldProduct.name}' -> '${product.name}'`;
                if (oldProduct.stock !== product.stock) {
                    logDetails += `, Stock: ${oldProduct.stock} -> ${product.stock}`;
                }
                addLog('Product Updated', logDetails);
            }
        } else {
            appData.products.push(product);
            addLog('Product Created', `Name: '${product.name}', Stock: ${product.stock}`);
        }
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
            const productToDelete = appData.products.find(p => p.id === id);
            if (productToDelete && confirm(`คุณต้องการลบสินค้า "${productToDelete.name}" ใช่หรือไม่?`)) {
                addLog('Product Deleted', `Name: '${productToDelete.name}'`);
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
    
    const populateDbProductCategoryDropdown = () => {
        const select = document.getElementById('db-prod-category');
        select.innerHTML = '';
        if (appData.stockDatabase.categories.length === 0) {
            select.innerHTML = '<option>กรุณาสร้างหมวดหมู่ในฐานข้อมูลก่อน</option>';
            select.disabled = true;
        } else {
            select.disabled = false;
            appData.stockDatabase.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        }
    };

    const renderStockDatabase = () => {
        renderStockDatabaseCategories();
        renderStockDatabaseProducts();
        populateDbProductCategoryDropdown();
    };

    const renderStockDatabaseCategories = () => {
        const list = document.getElementById('stock-db-cat-list');
        list.innerHTML = '';
        appData.stockDatabase.categories.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cat.icon ? `<img src="${cat.icon}" alt="icon" style="width:24px; height:24px;">` : 'ไม่มี'}</td>
                <td>${cat.name}</td>
                <td>
                    <button class="btn btn-secondary btn-small btn-db-cat-edit" data-id="${cat.id}">แก้ไข</button>
                    <button class="btn btn-danger btn-small btn-db-cat-delete" data-id="${cat.id}">ลบ</button>
                </td>`;
            list.appendChild(row);
        });
    };

    const renderStockDatabaseProducts = () => {
        const list = document.getElementById('stock-db-prod-list');
        list.innerHTML = '';
        const lang = appData.shopSettings.language;
        appData.stockDatabase.products.forEach(prod => {
            const cat = appData.stockDatabase.categories.find(c => c.id === prod.categoryId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prod.icon ? `<img src="${prod.icon}" alt="${prod.name}">` : 'ไม่มี'}</td>
                <td>${prod.name}</td>
                <td>${prod.level}</td>
                <td>${cat ? cat.name : 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary btn-small btn-db-prod-edit" data-id="${prod.id}">แก้ไข</button>
                    <button class="btn btn-danger btn-small btn-db-prod-delete" data-id="${prod.id}">ลบ</button>
                </td>`;
            list.appendChild(row);
        });
    };

    const resetDbCategoryForm = () => {
        editingDbCategoryId = null;
        document.getElementById('stock-db-cat-form').reset();
        document.getElementById('submit-db-cat-btn').textContent = translations[appData.shopSettings.language].addCategoryBtn;
        document.getElementById('cancel-db-cat-edit-btn').style.display = 'none';
        document.getElementById('db-cat-icon-preview').style.backgroundImage = 'none';
        catIconFile = null;
    };

    const resetDbProductForm = () => {
        editingDbProductId = null;
        document.getElementById('stock-db-prod-form').reset();
        document.getElementById('submit-db-prod-btn').textContent = translations[appData.shopSettings.language].addProductBtn;
        document.getElementById('cancel-db-prod-edit-btn').style.display = 'none';
        document.getElementById('db-prod-icon-preview').style.backgroundImage = 'none';
        prodIconFile = null;
    };

    const setupStockDatabaseListeners = () => {
        document.getElementById('stock-db-cat-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            showSaveFeedback(e.target.querySelector('button[type="submit"]'));
            const name = document.getElementById('db-cat-name').value.trim();
            if (!name) { alert('กรุณากรอกชื่อหมวดหมู่'); return; }
            let iconData = null;
            if (catIconFile) iconData = await readFileAsBase64(catIconFile);
            
            if (editingDbCategoryId) {
                const index = appData.stockDatabase.categories.findIndex(c => c.id === editingDbCategoryId);
                if (index !== -1) {
                    const existingIcon = appData.stockDatabase.categories[index].icon;
                    appData.stockDatabase.categories[index].name = name;
                    appData.stockDatabase.categories[index].icon = iconData || existingIcon;
                }
            } else {
                appData.stockDatabase.categories.push({ id: generateId(), name, icon: iconData });
            }
            await saveState();
            resetDbCategoryForm();
            renderStockDatabaseCategories();
            populateDbProductCategoryDropdown();
        });
        document.getElementById('db-cat-icon-upload').addEventListener('change', (e) => {
            catIconFile = e.target.files[0];
            if (catIconFile) {
                const reader = new FileReader();
                reader.onload = (re) => document.getElementById('db-cat-icon-preview').style.backgroundImage = `url(${re.target.result})`;
                reader.readAsDataURL(catIconFile);
            }
        });
        document.getElementById('cancel-db-cat-edit-btn').addEventListener('click', resetDbCategoryForm);

        document.getElementById('stock-db-cat-list').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-db-cat-edit');
            const deleteBtn = e.target.closest('.btn-db-cat-delete');
            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                const category = appData.stockDatabase.categories.find(c => c.id === id);
                if (category) {
                    editingDbCategoryId = id;
                    document.getElementById('db-cat-name').value = category.name;
                    document.getElementById('db-cat-icon-preview').style.backgroundImage = category.icon ? `url(${category.icon})` : 'none';
                    document.getElementById('submit-db-cat-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                    document.getElementById('cancel-db-cat-edit-btn').style.display = 'inline-block';
                    document.getElementById('stock-db-cat-form').scrollIntoView();
                }
            }
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                if (confirm('ยืนยันการลบหมวดหมู่นี้ออกจากฐานข้อมูล?')) {
                    appData.stockDatabase.categories = appData.stockDatabase.categories.filter(c => c.id !== id);
                    saveState().then(() => {
                        renderStockDatabaseCategories();
                        populateDbProductCategoryDropdown();
                    });
                }
            }
        });

        document.getElementById('stock-db-prod-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            showSaveFeedback(e.target.querySelector('button[type="submit"]'));
            const product = {
                id: editingDbProductId || generateId(),
                name: document.getElementById('db-prod-name').value,
                level: parseInt(document.getElementById('db-prod-level').value),
                categoryId: parseInt(document.getElementById('db-prod-category').value),
                icon: null
            };
            if (prodIconFile) product.icon = await readFileAsBase64(prodIconFile);

            if (editingDbProductId) {
                const index = appData.stockDatabase.products.findIndex(p => p.id === editingDbProductId);
                if (index !== -1) {
                    const existingIcon = appData.stockDatabase.products[index].icon;
                    appData.stockDatabase.products[index] = { ...product, icon: product.icon || existingIcon };
                }
            } else {
                appData.stockDatabase.products.push(product);
            }
            await saveState();
            resetDbProductForm();
            renderStockDatabaseProducts();
        });
        document.getElementById('db-prod-icon-upload').addEventListener('change', (e) => {
            prodIconFile = e.target.files[0];
            if (prodIconFile) {
                const reader = new FileReader();
                reader.onload = (re) => document.getElementById('db-prod-icon-preview').style.backgroundImage = `url(${re.target.result})`;
                reader.readAsDataURL(prodIconFile);
            }
        });
        document.getElementById('cancel-db-prod-edit-btn').addEventListener('click', resetDbProductForm);
        
        document.getElementById('stock-db-prod-list').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-db-prod-edit');
            const deleteBtn = e.target.closest('.btn-db-prod-delete');
            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                const product = appData.stockDatabase.products.find(p => p.id === id);
                if (product) {
                    editingDbProductId = id;
                    document.getElementById('db-prod-name').value = product.name;
                    document.getElementById('db-prod-level').value = product.level;
                    document.getElementById('db-prod-category').value = product.categoryId;
                    document.getElementById('db-prod-icon-preview').style.backgroundImage = product.icon ? `url(${product.icon})` : 'none';
                    document.getElementById('submit-db-prod-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                    document.getElementById('cancel-db-prod-edit-btn').style.display = 'inline-block';
                    document.getElementById('stock-db-prod-form').scrollIntoView();
                }
            }
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                if (confirm('ยืนยันการลบสินค้านี้ออกจากฐานข้อมูล?')) {
                    appData.stockDatabase.products = appData.stockDatabase.products.filter(p => p.id !== id);
                    saveState().then(renderStockDatabaseProducts);
                }
            }
        });
    };

    const openStockSearchModal = (type) => {
        const modal = document.getElementById('stock-search-modal');
        const listContainer = document.getElementById('stock-search-list');
        const searchInput = document.getElementById('stock-search-input');
        listContainer.innerHTML = '';
        searchInput.value = '';

        const populateList = (searchTerm = '') => {
            listContainer.innerHTML = '';
            const source = (type === 'category') ? appData.stockDatabase.categories : appData.stockDatabase.products;
            const filtered = source.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

            if (filtered.length === 0) {
                listContainer.innerHTML = '<li>ไม่พบข้อมูล</li>';
                return;
            }

            filtered.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `${item.icon ? `<img src="${item.icon}" alt="icon">` : ''}<span>${item.name}</span>`;
                li.addEventListener('click', () => {
                    if (type === 'category') {
                        document.getElementById('cat-name').value = item.name;
                        if (item.icon) {
                            document.getElementById('cat-icon-preview').style.backgroundImage = `url(${item.icon})`;
                        }
                    } else { // product
                        document.getElementById('prod-name').value = item.name;
                        document.getElementById('prod-level').value = item.level;
                        if (item.icon) {
                            document.getElementById('prod-icon-preview').style.backgroundImage = `url(${item.icon})`;
                        }
                    }
                    modal.style.display = 'none';
                });
                listContainer.appendChild(li);
            });
        };

        searchInput.oninput = () => populateList(searchInput.value);
        populateList();
        modal.style.display = 'flex';
    };

    const setupSearchListeners = () => {
        document.getElementById('search-cat-from-db-btn').addEventListener('click', () => openStockSearchModal('category'));
        document.getElementById('search-prod-from-db-btn').addEventListener('click', () => openStockSearchModal('product'));
        document.getElementById('close-stock-search-modal-btn').addEventListener('click', () => {
            document.getElementById('stock-search-modal').style.display = 'none';
        });
    };
    
    const renderStockSettingsPage = () => {
        const listContainer = document.getElementById('stock-settings-category-list');
        listContainer.innerHTML = '';

        appData.stockDatabase.categories.forEach(dbCat => {
            const threshold = appData.shopSettings.dbCategoryLowStockThresholds[dbCat.id] ?? appData.shopSettings.lowStockThreshold;
            const item = document.createElement('div');
            item.className = 'low-stock-category-item';
            item.innerHTML = `
                <span>${dbCat.name}</span>
                <input type="number" class="low-stock-threshold-input" data-cat-id="${dbCat.id}" value="${threshold}" min="0">
            `;
            listContainer.appendChild(item);
        });
    };

    const setupStockSettingsListeners = () => {
        document.getElementById('save-stock-settings-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.currentTarget);
            addLog('Stock Thresholds Updated', 'Low stock alert thresholds were changed.');
            const inputs = document.querySelectorAll('#stock-settings-category-list .low-stock-threshold-input');
            inputs.forEach(input => {
                const catId = input.dataset.catId;
                const threshold = parseInt(input.value);
                if (!isNaN(threshold) && threshold >= 0) {
                    appData.shopSettings.dbCategoryLowStockThresholds[catId] = threshold;
                }
            });
            await saveState();
            renderLowStockAlertWidget();
        });
    };

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
            addLog('Data Reset', `Context: ${currentResetContext}, Period: ${period}`);
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
        addLog('Pricing Updated', `Per-piece prices for category '${category.name}' were changed.`);
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
                addLog('Sub-Admin Updated', `Name: '${subAdmin.name}' -> '${name}'`);
                subAdmin.name = name;
                subAdmin.pin = pin;
            }
        } else {
            if (appData.subAdmins.length >= 20) { alert('ไม่สามารถเพิ่มผู้ใช้ย่อยได้เกิน 20 คน'); return; }
            if (appData.subAdmins.find(sa => sa.pin === pin)) { alert('PIN นี้มีผู้ใช้งานแล้ว'); return; }
            const newSubAdmin = { id: generateId(), name, pin, permissions: {'admin': true, 'festival': true, 'stock': true, 'order-number': true, 'dashboard': true, 'manage-account': true} };
            appData.subAdmins.push(newSubAdmin);
            addLog('Sub-Admin Created', `Name: '${name}'`);
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
            const subAdminToDelete = appData.subAdmins.find(sa => sa.id === id);
            if (subAdminToDelete && confirm(`ยืนยันการลบผู้ใช้ย่อย "${subAdminToDelete.name}" หรือไม่?`)) {
                addLog('Sub-Admin Deleted', `Name: '${subAdminToDelete.name}'`);
                appData.subAdmins = appData.subAdmins.filter(sa => sa.id !== id);
                await saveState();
                renderSubAdmins();
            }
        }
    });
    
    const renderAnomalyCheck = () => {
        const tableBody = document.getElementById('anomaly-list');
        tableBody.innerHTML = '';
        const lang = appData.shopSettings.language;
        const adminRow = document.createElement('tr');
        adminRow.innerHTML = `<td>Super Admin</td><td>${appData.analytics.loginAttempts.admin}</td><td>${appData.analytics.loginAttempts.isLocked ? 'ล็อก' : 'ปกติ'}</td>`;
        tableBody.appendChild(adminRow);

        for (const subAdminId in appData.analytics.subAdminAttempts) {
            const subAdmin = appData.subAdmins.find(sa => sa.id == subAdminId);
            if (subAdmin) {
                const isLocked = appData.analytics.subAdminAttempts[subAdminId] >= 5;
                const subAdminRow = document.createElement('tr');
                subAdminRow.innerHTML = `<td>${subAdmin.name}</td><td>${appData.analytics.subAdminAttempts[subAdminId]}</td><td>${isLocked ? 'ล็อก' : 'ปกติ'}</td>`;
                tableBody.appendChild(subAdminRow);
            }
        }
    };

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
            addLog('Permissions Updated', `Permissions changed for user '${subAdmin.name}'.`);
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
        addLog('Menu Reordered', 'Admin menu order was changed.');
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
        const originalPromo = currentAppliedPromo;
        appData.cart = order.items;
        currentAppliedPromo = order.promoApplied;
        orderDetails.textContent = createOrderSummaryText(order.id);
        appData.cart = originalCart;
        currentAppliedPromo = originalPromo;
        document.getElementById('order-modal-title').textContent = 'รายละเอียดออเดอร์';
        document.getElementById('order-modal-prompt').style.display = 'none';
        document.getElementById('copy-order-btn').style.display = 'none';
        document.getElementById('promo-code-container').style.display = 'none';
        orderModal.style.display = 'flex';
    };

    const confirmOrderAction = async (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'active';
            addLog('Order Confirmed', `Order #${orderId} status changed to Active.`);
            await saveState();
            renderOrderNumberView(orderDatePicker.selectedDates);
        }
    };

    const cancelOrderAction = async (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if(!order) return;

        if (order.status === 'new') {
             if (confirm(`คุณต้องการลบออเดอร์ใหม่เลขที่ ${orderId} ทิ้งถาวรใช่หรือไม่?`)) {
                addLog('Order Deleted', `New order #${orderId} was deleted permanently.`);
                appData.analytics.orders = appData.analytics.orders.filter(o => o.id !== orderId);
                await saveState();
                renderOrderNumberView(orderDatePicker.selectedDates);
            }
        } else if (order.status === 'active') {
            if (confirm(`คุณต้องการยกเลิกออเดอร์เลขที่ ${orderId} ใช่หรือไม่?`)) {
                order.status = 'cancelled';
                addLog('Order Cancelled', `Order #${orderId} status changed to Cancelled.`);
                await saveState();
                renderOrderNumberView(orderDatePicker.selectedDates);
            }
        }
    };

    let animationFrameId;
    let rainDrops = [], snowFlakes = [], fireworks = [], autumnLeaves = [];
    let lastFireworkTime = 0;

    function resizeCanvas() {
        festivalCanvas.width = window.innerWidth;
        festivalCanvas.height = window.innerHeight;
    }
    function createRainDrop() { return { x: Math.random() * festivalCanvas.width, y: Math.random() * -festivalCanvas.height, length: Math.random() * 20 + 10, speed: Math.random() * 5 + 2, opacity: appData.shopSettings.festival.rain.opacity }; }
    function createSnowFlake() { return { x: Math.random() * festivalCanvas.width, y: Math.random() * -50, radius: Math.random() * 3 + 1, speed: Math.random() * 1 + 0.5, drift: Math.random() * 2 - 1, opacity: appData.shopSettings.festival.snow.opacity }; }
    function createAutumnLeaf() {
        const colors = ['#f4a460', '#a0522d', '#8b4513', '#dc143c', '#ff8c00'];
        return {
            x: Math.random() * festivalCanvas.width,
            y: Math.random() * -50,
            size: Math.random() * 10 + 8,
            speed: Math.random() * 1.5 + 0.5,
            drift: Math.random() * 1.5 - 0.75,
            opacity: appData.shopSettings.festival.autumn.opacity,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
    }
    function createFirework(x, y) { const pC = 100, p = [], aS = (Math.PI * 2) / pC, c = `hsl(${Math.random() * 360}, 100%, 50%)`; for (let i = 0; i < pC; i++) { p.push({ x: x, y: y, angle: aS * i, speed: Math.random() * 5 + 2, friction: 0.95, gravity: 0.1, alpha: 1, color: c }); } return { particles: p, opacity: appData.shopSettings.festival.fireworks.opacity }; }

    function animateFestival() {
        festivalCtx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
        let activeEffects = 0;
        if (appData.shopSettings.festival.rain.enabled) { activeEffects++; while (rainDrops.length < appData.shopSettings.festival.rain.intensity) { rainDrops.push(createRainDrop()); } rainDrops.length = appData.shopSettings.festival.rain.intensity; festivalCtx.strokeStyle = `rgba(174,194,224,${appData.shopSettings.festival.rain.opacity})`; festivalCtx.lineWidth = 1; rainDrops.forEach(d => { festivalCtx.beginPath(); festivalCtx.moveTo(d.x, d.y); festivalCtx.lineTo(d.x, d.y + d.length); festivalCtx.stroke(); d.y += d.speed; if (d.y > festivalCanvas.height) { Object.assign(d, createRainDrop(), { y: -20 }); } }); } else { rainDrops = []; }
        if (appData.shopSettings.festival.snow.enabled) { activeEffects++; while (snowFlakes.length < appData.shopSettings.festival.snow.intensity) { snowFlakes.push(createSnowFlake()); } snowFlakes.length = appData.shopSettings.festival.snow.intensity; festivalCtx.fillStyle = `rgba(255, 255, 255, ${appData.shopSettings.festival.snow.opacity})`; snowFlakes.forEach(f => { festivalCtx.beginPath(); festivalCtx.arc(f.x, f.y, f.radius, 0, Math.PI * 2); festivalCtx.fill(); f.y += f.speed; f.x += f.drift; if (f.y > festivalCanvas.height) { Object.assign(f, createSnowFlake(), { y: -10 }); } }); } else { snowFlakes = []; }
        if (appData.shopSettings.festival.autumn.enabled) {
            activeEffects++;
            while (autumnLeaves.length < appData.shopSettings.festival.autumn.intensity) {
                autumnLeaves.push(createAutumnLeaf());
            }
            autumnLeaves.length = appData.shopSettings.festival.autumn.intensity;
            autumnLeaves.forEach(l => {
                festivalCtx.save();
                festivalCtx.translate(l.x + l.size / 2, l.y + l.size / 2);
                festivalCtx.rotate(l.rotation);
                festivalCtx.globalAlpha = l.opacity;
                festivalCtx.fillStyle = l.color;
                
                festivalCtx.beginPath();
                festivalCtx.moveTo(0, -l.size / 2);
                festivalCtx.quadraticCurveTo(l.size / 2, -l.size / 4, l.size / 2, 0);
                festivalCtx.quadraticCurveTo(l.size / 2, l.size / 4, 0, l.size / 2);
                festivalCtx.quadraticCurveTo(-l.size / 2, l.size / 4, -l.size / 2, 0);
                festivalCtx.quadraticCurveTo(-l.size / 2, -l.size / 4, 0, -l.size / 2);
                festivalCtx.fill();
                
                festivalCtx.restore();

                l.y += l.speed;
                l.x += l.drift;
                l.rotation += l.rotationSpeed;

                if (l.y > festivalCanvas.height || l.x < -l.size || l.x > festivalCanvas.width + l.size) {
                    Object.assign(l, createAutumnLeaf(), { y: -10 });
                }
            });
            festivalCtx.globalAlpha = 1;
        } else {
            autumnLeaves = [];
        }
        if (appData.shopSettings.festival.fireworks.enabled) { activeEffects++; const n = Date.now(), fI = appData.shopSettings.festival.fireworks.intensity * 60000; if (n - lastFireworkTime > fI / 10) { if (Math.random() < 0.05) { fireworks.push(createFirework(Math.random() * festivalCanvas.width, Math.random() * (festivalCanvas.height / 2))); lastFireworkTime = n; } } fireworks.forEach((fw, i) => { if (fw.particles.length === 0) { fireworks.splice(i, 1); } else { fw.particles.forEach((p, pI) => { p.speed *= p.friction; p.x += Math.cos(p.angle) * p.speed; p.y += Math.sin(p.angle) * p.speed + p.gravity; p.alpha -= 0.02; if (p.alpha <= 0) { fw.particles.splice(pI, 1); } else { festivalCtx.globalAlpha = p.alpha * fw.opacity; festivalCtx.fillStyle = p.color; festivalCtx.fillRect(p.x, p.y, 2, 2); } }); festivalCtx.globalAlpha = 1; } }); } else { fireworks = []; }
        if (activeEffects > 0) { animationFrameId = requestAnimationFrame(animateFestival); } else { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    }

    function initFestivalEffects() {
        cancelAnimationFrame(animationFrameId);
        const settings = appData.shopSettings.festival;
        if (settings.rain.enabled || settings.snow.enabled || settings.fireworks.enabled || settings.autumn.enabled) {
            festivalCanvas.style.display = 'block';
            resizeCanvas();
            animateFestival();
        } else {
            festivalCanvas.style.display = 'none';
        }
    }
    
    const renderLoadingBarPreviews = () => {
        const container = document.getElementById('loading-bar-previews');
        container.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const item = document.createElement('div');
            item.className = 'progress-bar-preview-item';
            item.innerHTML = `
                <p>Style ${i}</p>
                <div class="progress-bar style-${i}"></div>
            `;
            container.appendChild(item);
        }
    };

    const renderThemeModal = () => {
        const grid = document.getElementById('theme-selection-grid');
        grid.innerHTML = '';
        for (const key in THEME_PRESETS) {
            const theme = THEME_PRESETS[key];
            const item = document.createElement('div');
            item.className = 'theme-preview-item';
            if (key === appData.shopSettings.themeName) {
                item.classList.add('active');
            }
            item.dataset.theme = key;
            item.innerHTML = `
                <div class="color-swatches">
                    <div class="swatch" style="background-color: ${theme.colors.primary};"></div>
                    <div class="swatch" style="background-color: ${theme.colors.secondary};"></div>
                    <div class="swatch" style="background-color: ${theme.colors.info};"></div>
                </div>
                <p>${theme.name}</p>
            `;
            item.addEventListener('click', async () => {
                addLog('Theme Changed', `Theme set to ${theme.name}`);
                appData.shopSettings.themeName = key;
                applySystemTheme(key);
                document.querySelectorAll('.theme-preview-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                await saveState();
            });
            grid.appendChild(item);
        }
    };

    document.getElementById('open-theme-modal-btn').addEventListener('click', () => {
        renderThemeModal();
        document.getElementById('system-theme-modal').style.display = 'flex';
    });
    document.getElementById('close-theme-modal-btn').addEventListener('click', () => {
        document.getElementById('system-theme-modal').style.display = 'none';
    });

    const renderPromotions = () => {
        const list = document.getElementById('promo-code-list');
        list.innerHTML = '';
        appData.shopSettings.promotions.forEach(promo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${promo.code}</td>
                <td>${promo.discount}%</td>
                <td>
                    <button class="btn btn-danger btn-small btn-delete-promo" data-id="${promo.id}">ลบ</button>
                </td>
            `;
            list.appendChild(row);
        });
    };

    const setupPromotionListeners = () => {
        document.getElementById('promo-code-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('promo-code');
            const discountInput = document.getElementById('promo-discount');
            const code = codeInput.value.trim().toUpperCase();
            const discount = parseInt(discountInput.value);

            if (!code || !discount || discount <= 0 || discount > 100) {
                alert('กรุณากรอกข้อมูลให้ถูกต้อง (ส่วนลดต้องอยู่ระหว่าง 1-100)');
                return;
            }
            if (appData.shopSettings.promotions.some(p => p.code === code)) {
                alert('โค้ดนี้มีอยู่แล้วในระบบ');
                return;
            }
            
            const newPromo = { id: generateId(), code, discount };
            appData.shopSettings.promotions.push(newPromo);
            addLog('Promotion Created', `Code: ${code}, Discount: ${discount}%`);
            await saveState();
            renderPromotions();
            codeInput.value = '';
            discountInput.value = '';
        });

        document.getElementById('generate-promo-btn').addEventListener('click', () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('promo-code').value = result;
        });

        document.getElementById('promo-code-list').addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-delete-promo')) {
                const promoId = parseInt(e.target.dataset.id);
                const promoToDelete = appData.shopSettings.promotions.find(p => p.id === promoId);
                if (promoToDelete && confirm(`คุณต้องการลบโค้ด ${promoToDelete.code} ใช่หรือไม่?`)) {
                    addLog('Promotion Deleted', `Code: ${promoToDelete.code}`);
                    appData.shopSettings.promotions = appData.shopSettings.promotions.filter(p => p.id !== promoId);
                    await saveState();
                    renderPromotions();
                }
            }
        });
    };

    const renderLogs = () => {
        const list = document.getElementById('log-list');
        list.innerHTML = '';
        appData.analytics.logs.forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.timestamp);
            const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH')}`;
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
            `;
            list.appendChild(row);
        });
    };

    const renderTaxView = () => {
        const year = new Date().getFullYear();
        document.getElementById('tax-year-select').value = appData.taxData.year || year;
        
        const shopIncome = appData.analytics.orders
            .filter(o => new Date(o.timestamp).getFullYear() === appData.taxData.year && o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0);
        document.getElementById('tax-shop-income').value = shopIncome.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('tax-other-income').value = appData.taxData.otherIncome;
        document.getElementById(`expense-type-${appData.taxData.expenseType}`).checked = true;
        
        document.getElementById('tax-actual-cost').value = appData.taxData.actualExpenses.cost;
        document.getElementById('tax-actual-transport').value = appData.taxData.actualExpenses.transport;
        document.getElementById('tax-actual-ad').value = appData.taxData.actualExpenses.advertising;
        document.getElementById('tax-actual-other').value = appData.taxData.actualExpenses.other;
        
        document.getElementById('deduction-spouse').value = appData.taxData.deductions.spouse;
        document.getElementById('deduction-children').value = appData.taxData.deductions.children;
        document.getElementById('deduction-social-security').value = appData.taxData.deductions.socialSecurity;
        document.getElementById('deduction-insurance').value = appData.taxData.deductions.insurance;
        document.getElementById('deduction-rmf').value = appData.taxData.deductions.rmf;
        document.getElementById('deduction-ssf').value = appData.taxData.deductions.ssf;
        document.getElementById('deduction-donations').value = appData.taxData.deductions.donations;
        document.getElementById('deduction-home-interest').value = appData.taxData.deductions.homeInterest;

        toggleActualExpenses();
    };

    const toggleActualExpenses = () => {
        const actualContainer = document.getElementById('actual-expenses-container');
        if (document.getElementById('expense-type-actual').checked) {
            actualContainer.style.display = 'grid';
        } else {
            actualContainer.style.display = 'none';
        }
    };

    const calculateTax = () => {
        // 1. Collect Data
        const taxYear = parseInt(document.getElementById('tax-year-select').value);
        const shopIncome = appData.analytics.orders
            .filter(o => new Date(o.timestamp).getFullYear() === taxYear && o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0);
        const otherIncome = parseFloat(document.getElementById('tax-other-income').value) || 0;
        const totalIncome = shopIncome + otherIncome;

        let totalExpense = 0;
        if (document.getElementById('expense-type-flat').checked) {
            totalExpense = totalIncome * 0.6;
        } else {
            totalExpense += parseFloat(document.getElementById('tax-actual-cost').value) || 0;
            totalExpense += parseFloat(document.getElementById('tax-actual-transport').value) || 0;
            totalExpense += parseFloat(document.getElementById('tax-actual-ad').value) || 0;
            totalExpense += parseFloat(document.getElementById('tax-actual-other').value) || 0;
        }

        let totalDeduction = 60000; // Personal
        totalDeduction += parseFloat(document.getElementById('deduction-spouse').value) || 0;
        totalDeduction += (parseFloat(document.getElementById('deduction-children').value) || 0) * 30000;
        totalDeduction += Math.min(9000, parseFloat(document.getElementById('deduction-social-security').value) || 0);
        totalDeduction += parseFloat(document.getElementById('deduction-insurance').value) || 0;
        totalDeduction += parseFloat(document.getElementById('deduction-rmf').value) || 0;
        totalDeduction += parseFloat(document.getElementById('deduction-ssf').value) || 0;
        totalDeduction += parseFloat(document.getElementById('deduction-donations').value) || 0;
        totalDeduction += parseFloat(document.getElementById('deduction-home-interest').value) || 0;

        const netIncome = Math.max(0, totalIncome - totalExpense - totalDeduction);

        // 2. Calculate Tax based on progressive rates
        let taxPayable = 0;
        if (netIncome > 5000000) taxPayable += (netIncome - 5000000) * 0.35;
        if (netIncome > 2000000) taxPayable += (Math.min(netIncome, 5000000) - 2000000) * 0.30;
        if (netIncome > 1000000) taxPayable += (Math.min(netIncome, 2000000) - 1000000) * 0.25;
        if (netIncome > 750000)  taxPayable += (Math.min(netIncome, 1000000) - 750000) * 0.20;
        if (netIncome > 500000)  taxPayable += (Math.min(netIncome, 750000) - 500000) * 0.15;
        if (netIncome > 300000)  taxPayable += (Math.min(netIncome, 500000) - 300000) * 0.10;
        if (netIncome > 150000)  taxPayable += (Math.min(netIncome, 300000) - 150000) * 0.05;

        // 3. Calculate PND94 (ครึ่งปี)
        const halfYearIncome = (appData.analytics.orders
            .filter(o => new Date(o.timestamp).getFullYear() === taxYear && new Date(o.timestamp).getMonth() < 6 && o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0)) + (otherIncome / 2);
        const halfYearExpense = document.getElementById('expense-type-flat').checked ? halfYearIncome * 0.6 : totalExpense / 2;
        const halfYearDeduction = totalDeduction / 2;
        const halfYearNetIncome = Math.max(0, halfYearIncome - halfYearExpense - halfYearDeduction);
        
        let pnd94Tax = 0;
        if (halfYearNetIncome > 5000000) pnd94Tax += (halfYearNetIncome - 5000000) * 0.35;
        if (halfYearNetIncome > 2000000) pnd94Tax += (Math.min(halfYearNetIncome, 5000000) - 2000000) * 0.30;
        if (halfYearNetIncome > 1000000) pnd94Tax += (Math.min(halfYearNetIncome, 2000000) - 1000000) * 0.25;
        if (halfYearNetIncome > 750000)  pnd94Tax += (Math.min(halfYearNetIncome, 1000000) - 750000) * 0.20;
        if (halfYearNetIncome > 500000)  pnd94Tax += (Math.min(halfYearNetIncome, 750000) - 500000) * 0.15;
        if (halfYearNetIncome > 300000)  pnd94Tax += (Math.min(halfYearNetIncome, 500000) - 300000) * 0.10;
        if (halfYearNetIncome > 150000)  pnd94Tax += (Math.min(halfYearNetIncome, 300000) - 150000) * 0.05;

        const finalTax = taxPayable - pnd94Tax;

        // 4. Display Results
        document.getElementById('summary-total-income').textContent = totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-total-expense').textContent = totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-total-deduction').textContent = totalDeduction.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-net-income').textContent = netIncome.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-tax-payable').textContent = taxPayable.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-pnd94').textContent = pnd94Tax.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('summary-final-tax').textContent = finalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('summary-tax-payable-pnd90').textContent = taxPayable.toLocaleString(undefined, { minimumFractionDigits: 2 });
        document.getElementById('summary-pnd94-paid').textContent = pnd94Tax.toLocaleString(undefined, { minimumFractionDigits: 2 });


        document.getElementById('tax-summary-container').style.display = 'block';
    };

    const setupTaxListeners = () => {
        document.getElementById('tax-form').addEventListener('input', async () => {
            appData.taxData.year = parseInt(document.getElementById('tax-year-select').value);
            appData.taxData.otherIncome = parseFloat(document.getElementById('tax-other-income').value) || 0;
            appData.taxData.expenseType = document.querySelector('input[name="expense-type"]:checked').value;
            appData.taxData.actualExpenses = {
                cost: parseFloat(document.getElementById('tax-actual-cost').value) || 0,
                transport: parseFloat(document.getElementById('tax-actual-transport').value) || 0,
                advertising: parseFloat(document.getElementById('tax-actual-ad').value) || 0,
                other: parseFloat(document.getElementById('tax-actual-other').value) || 0,
            };
            appData.taxData.deductions = {
                personal: 60000,
                spouse: parseFloat(document.getElementById('deduction-spouse').value) || 0,
                children: parseFloat(document.getElementById('deduction-children').value) || 0,
                socialSecurity: parseFloat(document.getElementById('deduction-social-security').value) || 0,
                insurance: parseFloat(document.getElementById('deduction-insurance').value) || 0,
                rmf: parseFloat(document.getElementById('deduction-rmf').value) || 0,
                ssf: parseFloat(document.getElementById('deduction-ssf').value) || 0,
                donations: parseFloat(document.getElementById('deduction-donations').value) || 0,
                homeInterest: parseFloat(document.getElementById('deduction-home-interest').value) || 0,
            };
            await saveState();
        });

        document.querySelectorAll('input[name="expense-type"]').forEach(radio => {
            radio.addEventListener('change', toggleActualExpenses);
        });

        document.getElementById('calculate-tax-btn').addEventListener('click', calculateTax);
    };

    const populateLoadingAnimationSelector = () => {
        const select = document.getElementById('loading-animation-style');
        select.innerHTML = '';
        for (const key in LOADING_ANIMATIONS) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = LOADING_ANIMATIONS[key].name;
            select.appendChild(option);
        }
    };

    const renderLoadingAnimationPreviews = () => {
        const container = document.getElementById('loading-animation-previews');
        container.innerHTML = '';
        for (const key in LOADING_ANIMATIONS) {
            const anim = LOADING_ANIMATIONS[key];
            const item = document.createElement('div');
            item.className = 'loader-animation-preview';
            if (key === appData.shopSettings.loadingAnimation) {
                item.classList.add('active');
            }
            item.dataset.animKey = key;
            item.innerHTML = `<p>${anim.name}</p><div class="animation-viewport"></div>`;
            container.appendChild(item);

            item.addEventListener('click', () => {
                document.querySelectorAll('.loader-animation-preview').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                document.getElementById('loading-animation-style').value = key;

                const viewport = item.querySelector('.animation-viewport');
                viewport.innerHTML = anim.html;
                viewport.className = `animation-viewport anim-${key}`;
                
                if (key === 'matrix') {
                    for (let i = 0; i < 10; i++) {
                        const col = document.createElement('div');
                        col.className = 'matrix-col';
                        col.textContent = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').sort(() => 0.5 - Math.random()).join('');
                        col.style.left = `${Math.random() * 100}%`;
                        col.style.animationDuration = `${Math.random() * 2 + 1}s`;
                        col.style.animationDelay = `${Math.random() * 1}s`;
                        viewport.appendChild(col);
                    }
                }

                setTimeout(() => viewport.classList.add('play'), 100);
                setTimeout(() => {
                    viewport.classList.remove('play');
                    viewport.innerHTML = '';
                }, anim.duration + 500);
            });
        }
    };

    const applyLoadingAnimation = () => {
        const container = document.getElementById('loader-animation-container');
        const animKey = appData.shopSettings.loadingAnimation || 'none';
        const anim = LOADING_ANIMATIONS[animKey];
        if (!anim) return;

        container.innerHTML = anim.html;
        container.className = `anim-${animKey}`;

        if (animKey === 'matrix') {
            for (let i = 0; i < 50; i++) {
                const col = document.createElement('div');
                col.className = 'matrix-col';
                col.textContent = 'WARISHAYDAY0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort(() => 0.5 - Math.random()).join('');
                col.style.left = `${Math.random() * 100}%`;
                col.style.fontSize = `${Math.random() * 15 + 10}px`;
                col.style.animationDuration = `${Math.random() * 5 + 3}s`;
                col.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(col);
            }
        }
    };

    const hideLoader = () => {
        const loader = document.getElementById('loader-overlay');
        loader.style.transition = 'opacity 0.3s ease-out, visibility 0.3s ease-out';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        }, { once: true });
    };

    const init = async () => {
        applyLoadingBackground();

        await loadState();
        
        applyTheme();

        const storedLogin = localStorage.getItem('isAdminLoggedIn');
        if (storedLogin === 'true') {
            try {
                const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
                if (storedUser) {
                    isAdminLoggedIn = true;
                    loggedInUser = storedUser;
                    switchView('adminPanel');
                    renderAdminPanel();
                } else {
                    localStorage.clear();
                    renderCustomerView();
                }
            } catch (e) {
                console.error('Failed to parse stored user data', e);
                localStorage.clear();
                renderCustomerView();
            }
        } else {
            renderCustomerView();
        }

        if (appData.categories.length > 0) {
            if (!appData.categories.find(c => c.id === activeCategoryId)) activeCategoryId = appData.categories[0].id;
            adminActiveCategoryId = activeCategoryId;
        } else { activeCategoryId = null; adminActiveCategoryId = null; }
        
        populateLoadingAnimationSelector();
        setupStockDatabaseListeners();
        setupSearchListeners();
        setupStockSettingsListeners();
        setupPromotionListeners();
        setupTaxListeners();
        
        const mainContainer = document.querySelector('.container');
        mainContainer.classList.add('loaded');
        
        hideLoader(); 
    };

    window.addEventListener('resize', resizeCanvas);
    init();
});
