document.addEventListener('DOMContentLoaded', () => {
    // Immediately apply loading background from localStorage if available
    try {
        const storedSettings = localStorage.getItem('warishayday_settings');
        if (storedSettings) {
            const settings = JSON.parse(storedSettings);
            if (settings.loadingBackgroundImage) {
                document.getElementById('loader-background').style.backgroundImage = `url(${settings.loadingBackgroundImage})`;
                document.getElementById('loader-overlay').style.backgroundColor = `rgba(0, 0, 0, ${settings.loadingBackgroundOpacity || 0.7})`;
            }
        }
    } catch (e) {
        console.error("Could not apply pre-loaded background:", e);
    }
    
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
            orderNumberFormat: 'format1',
            orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
            logo: null,
            useLogo: false,
            darkMode: false,
            shopNameEffect: { enabled: false, offsetX: 2, offsetY: 2, blur: 4, color: '#000000' },
            backgroundImage: null,
            backgroundOpacity: 1,
            backgroundBlur: 0,
            loadingBackgroundImage: null,
            loadingBackgroundOpacity: 0.7,
            language: 'th',
            lowStockThreshold: 50,
            copyrightText: "Copyright © 2025 Warishayday",
            copyrightOpacity: 1,
            festivalEffects: {
                rain: { enabled: false, intensity: 50, opacity: 0.5 },
                snow: { enabled: false, intensity: 50, opacity: 0.7 },
                fireworks: { enabled: false, duration: 5, opacity: 1 }
            }
        },
        analytics: {
            dailyTraffic: Array(7).fill(0),
            hourlyTraffic: Array(24).fill(0),
            productSales: {},
            pendingOrders: [],
            orders: [],
            totalSales: 0,
            monthlyProfit: 0
        },
        menuOrder: [
            'admin', 'stock', 'order-number', 'tax', 'dashboard', 'manage-account'
        ]
    };

    // --- Translations ---
    const translations = {
        th: {
            loadingMessage: "กำลังดาวน์โหลดข้อมูลล่าสุด...",
            saveSuccessMessage: "บันทึกสำเร็จ!",
            menuTax: "ตรวจสอบภาษี",
            taxCheckTitle: "ตรวจสอบภาษีร้านค้าออนไลน์",
            taxIncomeLabel: "รายได้รวมทั้งปี (บาท)",
            taxExpenseTypeLabel: "ประเภทการหักค่าใช้จ่าย",
            taxExpenseActual: "หักตามจริง (ต้องมีเอกสาร)",
            taxExpenseLump: "หักเหมา 60%",
            taxActualExpenseLabel: "ค่าใช้จ่ายตามจริง (บาท)",
            taxDeductionLabel: "ค่าลดหย่อนส่วนตัว (บาท)",
            taxCalculateBtn: "คำนวณภาษี",
            taxResultTitle: "สรุปผลการคำนวณภาษี",
            taxNote: "หมายเหตุ: นี่คือการคำนวณเบื้องต้นเท่านั้น กรุณาปรึกษาผู้เชี่ยวชาญเพื่อข้อมูลที่ถูกต้อง",
            festivalTitle: "เอฟเฟกต์พิเศษ (Festival)",
            rainEffectLabel: "ฤดูฝนตก",
            snowEffectLabel: "ฤดูหิมะ",
            fireworksEffectLabel: "พลุฉลอง",
            intensityLabel: "ความหนัก/เบา",
            opacityLabel: "ความชัด/จาง",
            durationLabel: "นาทีการแสดง",
            confirmOrdersTitle: "คอนเฟิร์มออเดอร์",
            activeOrdersTitle: "รายการออเดอร์ปัจจุบัน",
            cancelledOrdersTitle: "รายการออเดอร์ที่ถูกยกเลิก",
            confirmOrderAction: "คอนเฟิร์ม",
            closeBtn: "ปิด", cancelBtn: "ยกเลิก", confirmBtn: "ยืนยัน", saveBtn: "บันทึก", editBtn: "แก้ไข", deleteBtn: "ลบ",
            searchPlaceholder: "ค้นหาสินค้า...", itemsListTitle: "รายการสินค้า", tableHeaderItem: "สินค้า", tableHeaderLevel: "เลเวล", tableHeaderQuantity: "จำนวน", tableHeaderManage: "จัดการ",
            viewOrderBtn: "รายการสั่งซื้อ", confirmOrderBtn: "ยืนยันสั่งซื้อ", totalAmount: "ยอดรวม",
            adminLoginTitle: "เข้าสู่ระบบหลังบ้าน", pinLabel: "PIN", loginBtn: "เข้าสู่ระบบ", backToShopBtn: "กลับหน้าหลักสั่งสินค้า", invalidPinError: "PIN ไม่ถูกต้อง!",
            adminPanelTitle: "Admin Panel", viewShopBtn: "มุมมองหน้าร้าน", logoutBtn: "ออกจากระบบ",
            menuAdmin: "ตั้งค่าร้าน", menuStock: "สต๊อกสินค้า", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage account", editMenuOrderBtn: "EDIT",
            shopInfoTitle: "ข้อมูลร้าน", systemFontsTitle: "System Fonts", fontPreviewText: "ตัวอย่างฟอนต์ระบบ",
            shopNameLabel: "ชื่อร้านค้า", shopSloganLabel: "สโลแกนร้าน", managerNameLabel: "ชื่อผู้จัดการระบบ", shareholderNameLabel: "ชื่อผู้ถือหุ้นใหญ่",
            globalFontLabel: "ฟอนต์ระบบทั้งหมด", shopNameFontLabel: "ฟอนต์ชื่อร้าน", enableEffectLabel: "เปิดใช้เอฟเฟกต์ชื่อร้าน",
            effectOffsetX: "เงาแนวนอน (X)", effectOffsetY: "เงาแนวตั้ง (Y)", effectBlur: "ความเบลอ", effectColor: "สีเงา",
            orderFormatLabel: "รูปแบบเลขที่ออเดอร์", useLogoLabel: "ใช้โลโก้", uploadLogoLabel: "อัปโหลดโลโก้ (PNG)",
            backgroundSettingsTitle: "ตั้งค่าพื้นหลัง", uploadBgLabel: "อัปโหลดภาพพื้นหลัง", bgOpacityLabel: "ความโปร่งใส (จาง-ชัด)", bgBlurLabel: "ความเบลอ (น้อย-มาก)",
            removeBgBtn: "ลบพื้นหลัง", previewBgBtn: "ดูตัวอย่าง", themeColorLabel: "ธีมสี (Theme)", saveSettingsBtn: "บันทึกการตั้งค่า",
            copyrightTextLabel: "ข้อความ Copyright", copyrightOpacityLabel: "ความคมชัด", changePinTitle: "เปลี่ยนรหัสผ่าน", newPinLabel: "PIN ใหม่",
            saveNewPinBtn: "บันทึก PIN ใหม่", manageCategoriesTitle: "จัดการหมวดหมู่", categoryNameLabel: "ชื่อหมวดหมู่", categoryIconLabel: "ไอค่อนหมวดหมู่ (ไฟล์ PNG)",
            minOrderLabel: "จำนวนสั่งซื้อขั้นต่ำ", setPriceLabel: "ตั้งค่าราคา", setPerPiecePriceBtn: "ตั้งราคาต่อชิ้น", saveCategoryBtn: "เพิ่ม/บันทึกหมวดหมู่",
            categoryListTitle: "รายการหมวดหมู่", tableHeaderIcon: "ไอค่อน", tableHeaderName: "ชื่อ", tableHeaderMinOrder: "ขั้นต่ำ", tableHeaderPrice: "ราคา",
            manageProductsTitle: "จัดการสินค้า", productNameLabel: "ชื่อสินค้า", levelLabel: "เลเวล", stockQuantityLabel: "จำนวนคงเหลือ", categoryLabel: "หมวดหมู่",
            productIconLabel: "ไอค่อนสินค้า (ไฟล์ PNG)", productAvailableLabel: "เปิดขายสินค้านี้", saveProductBtn: "บันทึกสินค้า", cancelEditBtn: "ยกเลิกแก้ไข",
            tableHeaderStock: "คงเหลือ", tableHeaderStatus: "สถานะ", statusAvailable: "เปิดขาย", statusUnavailable: "ปิดขาย",
            selectDateLabel: "เลือกวันที่:", resetDataBtn: "รีเซ็ทข้อมูล", tableHeaderOrderNo: "เลขออเดอร์", tableHeaderDateTime: "วันที่/เวลา",
            tableHeaderTotal: "ยอดรวม", viewDetailsBtn: "ดูรายละเอียด", cancelOrderBtn: "ยกเลิก", dashboardTitle: "ภาพรวมร้านค้า",
            monthlyProfitTitle: "กำไรเดือนนี้", dailyOrdersTitle: "ยอดออเดอร์วันนี้", monthlyOrdersTitle: "ยอดออเดอร์เดือนนี้", yearlySalesTitle: "ยอดขายรวม (ปีนี้)",
            lowStockTitle: "สินค้าที่ต้องเติม (10 อันดับ)", lowStockThresholdLabel: "แจ้งเตือนเมื่อเหลือน้อยกว่า:", lowStockInfo: "รบกวนเติมสินค้าสำหรับรายการที่มีไฟกระพริบ",
            noLowStockItems: "ไม่มีสินค้าใกล้หมด", categorySalesTitle: "ยอดขายตามหมวดหมู่", topSellingTitle: "สินค้าขายดี (Top 5)",
            periodDay: "วันนี้", periodMonth: "เดือนนี้", periodYear: "ปีนี้", trafficStatsTitle: "สถิติการเข้าใช้งาน", productStatsTitle: "สถิติสินค้า (ตามจำนวนที่สั่ง)",
            manageAccountTitle: "จัดการบัญชี", subAdminLimitInfo: "จำกัดจำนวนผู้ใช้ย่อยได้สูงสุด 20 คน", usernameLabel: "ชื่อผู้ใช้", addUserBtn: "เพิ่มผู้ใช้",
            subAdminListTitle: "รายการผู้ใช้ย่อย", orderSummaryTitle: "สรุปออเดอร์", copyOrderPrompt: "กรุณาคัดลอกข้อความด้านล่างเพื่อส่งให้ทางร้าน",
            copyOrderBtn: "คัดลอกออเดอร์", copySuccessMessage: "คัดลอกออเดอร์สำเร็จ", yourOrderListTitle: "รายการสั่งซื้อของคุณ",
            confirmPinTitle: "ยืนยันรหัส PIN", enterPinPrompt: "กรอกรหัส PIN เพื่อยืนยัน", confirmResetTitle: "ยืนยันการรีเซ็ทข้อมูล",
            selectResetPeriodPrompt: "กรุณาเลือกช่วงเวลาที่ต้องการรีเซ็ทข้อมูล", periodWeek: "สัปดาห์นี้", periodAll: "ข้อมูลทั้งหมด",
            setPerPiecePriceTitle: "ตั้งราคาต่อชิ้น", setPerPiecePriceInfo: "กำหนดราคาสำหรับทุกๆ 10 ชิ้น", savePriceBtn: "บันทึกราคา",
            reorderMenuTitle: "จัดเรียงเมนู", reorderMenuInfo: "ลากและวางเพื่อจัดลำดับเมนูตามต้องการ", saveOrderBtn: "บันทึกการจัดเรียง",
            setPermissionsTitle: "ตั้งค่าสิทธิ์การเข้าถึง", savePermissionsBtn: "บันทึกสิทธิ์", loadingBackgroundTitle: "พื้นหลัง Loading",
            uploadLoadingBgLabel: "อัปโหลดภาพพื้นหลัง Loading",
        },
        en: {
            // English translations remain the same
        }
    };

    const MENU_NAMES = {
        'admin': 'menuAdmin',
        'stock': 'menuStock',
        'order-number': 'menuOrderNumber',
        'tax': 'menuTax',
        'dashboard': 'menuDashboard',
        'manage-account': 'menuManageAccount'
    };
    
    const SUB_MENUS = {
        'admin': { 
            'shop-info': 'shopInfoTitle', 
            'system-fonts': 'systemFontsTitle',
            'background': 'backgroundSettingsTitle', 
            'loading-bg': 'loadingBackgroundTitle', 
            'festival': 'festivalTitle',
            'pin': 'changePinTitle' 
        },
        'stock': { 'categories': 'manageCategoriesTitle', 'products': 'manageProductsTitle' },
        'order-number': { 'confirm-orders': 'confirmOrdersTitle', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' }
    };

    // --- Utility Functions ---
    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const showSaveFeedback = (button) => {
        const originalText = button.textContent;
        button.textContent = translations[appData.shopSettings.language].saveSuccessMessage;
        button.classList.add('saved');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('saved');
        }, 1500);
    };

    const saveState = async (button = null) => {
        if (button) showSaveFeedback(button);
        try {
            localStorage.setItem('warishayday_settings', JSON.stringify(appData.shopSettings));
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
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
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
                    festivalEffects: {
                        rain: { enabled: false, intensity: 50, opacity: 0.5 },
                        snow: { enabled: false, intensity: 50, opacity: 0.7 },
                        fireworks: { enabled: false, duration: 5, opacity: 1 }
                    }
                },
                analytics: { dailyTraffic: Array(7).fill(0), hourlyTraffic: Array(24).fill(0), productSales: {}, pendingOrders: [], orders: [], totalSales: 0, monthlyProfit: 0 },
                subAdmins: [],
                menuOrder: ['admin', 'stock', 'order-number', 'tax', 'dashboard', 'manage-account'],
                categories: [], products: [],
            };
            appData = { ...defaultAppData, ...serverData };
            appData.shopSettings = {...defaultAppData.shopSettings, ...(serverData.shopSettings || {})};
            appData.analytics = {...defaultAppData.analytics, ...(serverData.analytics || {})};
            appData.analytics.pendingOrders = appData.analytics.pendingOrders || [];
            appData.analytics.orders = appData.analytics.orders || [];
        } catch (error) {
            console.error('Failed to load state:', error);
            throw new Error('ไม่สามารถโหลดข้อมูลร้านค้าได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองรีเฟรชหน้าเว็บ');
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

    // --- DOM Elements ---
    const canvas = document.getElementById('festival-canvas');
    const ctx = canvas.getContext('2d');
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

    // --- State Variables ---
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
    
    // --- Festival Effects Logic ---
    let particles = [];
    let fireworks = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle(type) {
        if (type === 'rain') {
            particles.push({
                type: 'rain',
                x: Math.random() * canvas.width,
                y: -10,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 5,
                opacity: appData.shopSettings.festivalEffects.rain.opacity,
            });
        } else if (type === 'snow') {
             particles.push({
                type: 'snow',
                x: Math.random() * canvas.width,
                y: -10,
                radius: Math.random() * 3 + 1,
                speedY: Math.random() * 1 + 0.5,
                speedX: Math.random() * 2 - 1,
                opacity: appData.shopSettings.festivalEffects.snow.opacity,
            });
        }
    }
    
    function createFirework() {
        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: Math.random() * (canvas.height / 2) + 50,
            speed: Math.random() * 3 + 4,
            isExploded: false,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            particles: []
        });
    }
    
    function explodeFirework(firework) {
        firework.isExploded = true;
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            firework.particles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                lifespan: Math.random() * 50 + 50,
                opacity: 1
            });
        }
    }

    function festivalAnimationLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const effects = appData.shopSettings.festivalEffects;

        let activeEffect = false;

        // Rain
        if (effects.rain.enabled) {
            activeEffect = true;
            if (particles.filter(p => p.type === 'rain').length < effects.rain.intensity) createParticle('rain');
        }
        
        // Snow
        if (effects.snow.enabled) {
            activeEffect = true;
            if (particles.filter(p => p.type === 'snow').length < effects.snow.intensity) createParticle('snow');
        }

        // Particle animation
        particles = particles.filter(p => {
            if (p.type === 'rain' && effects.rain.enabled) {
                ctx.strokeStyle = `rgba(174,194,224,${p.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y + p.length);
                ctx.stroke();
                p.y += p.speed;
                return p.y < canvas.height;
            }
            if (p.type === 'snow' && effects.snow.enabled) {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                p.y += p.speedY;
                p.x += p.speedX;
                return !(p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height);
            }
            // Keep particle if its effect is still enabled
            return (p.type === 'rain' && effects.rain.enabled) || (p.type === 'snow' && effects.snow.enabled);
        });
        
        // Fireworks
        if (effects.fireworks.enabled) {
            activeEffect = true;
            if (Math.random() < 0.03) createFirework();
            fireworks = fireworks.filter(fw => {
                if (!fw.isExploded) {
                    fw.y -= fw.speed;
                    ctx.fillStyle = fw.color;
                    ctx.beginPath();
                    ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                    if (fw.y <= fw.targetY) explodeFirework(fw);
                } else {
                    fw.particles = fw.particles.filter(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.05; // gravity
                        p.lifespan--;
                        p.opacity = p.lifespan / 100;
                        let colorParts = fw.color.match(/\d+/g);
                        ctx.fillStyle = `rgba(${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${p.opacity})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                        return p.lifespan > 0;
                    });
                     return fw.particles.length > 0;
                }
                return true;
            });
        }
        
        if(activeEffect) {
            animationFrameId = requestAnimationFrame(festivalAnimationLoop);
        } else {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function startStopFestivalAnimation() {
        const effects = appData.shopSettings.festivalEffects;
        const anyEffectEnabled = effects.rain.enabled || effects.snow.enabled || effects.fireworks.enabled;
        cancelAnimationFrame(animationFrameId);
        if (anyEffectEnabled) {
            festivalAnimationLoop();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // --- UI Rendering & Logic ---
    // ... (All other UI functions remain the same)
    
    document.getElementById('copy-order-btn').addEventListener('click', async () => {
        const orderText = orderDetails.textContent;
        const totalOrderPriceText = orderText.match(/ยอดรวมทั้งหมด: ([\d,]+) บาท/);
        const totalOrderPrice = totalOrderPriceText ? parseFloat(totalOrderPriceText[1].replace(/,/g, '')) : 0;
        const newOrder = {
            id: orderDetails.dataset.orderNumber,
            timestamp: new Date().toISOString(),
            total: totalOrderPrice,
            items: { ...appData.cart },
            status: 'pending'
        };

        orderModal.style.display = 'none';
        document.getElementById('copy-success-modal').style.display = 'flex';
        appData.cart = {};
        renderCustomerView();
        
        setTimeout(() => {
            document.getElementById('copy-success-modal').style.display = 'none';
        }, 2000);
        
        try {
            await navigator.clipboard.writeText(orderText);
            if (!isNaN(totalOrderPrice) && totalOrderPrice > 0) {
                appData.analytics.pendingOrders.push(newOrder);
            }
            await saveState();
        } catch (err) {
            console.error('Failed to copy text or save order: ', err);
            alert('ไม่สามารถคัดลอกหรือบันทึกออเดอร์ได้');
        }
    });

    // --- Admin Panel Logic ---
    // ... (Admin panel functions remain the same)
    
    // --- New Order Management Functions ---
    // ... (Order management functions remain the same)

    // --- Tax Calculator Logic ---
    // ... (Tax calculator functions remain the same)
    
    // --- Event Listeners for new features ---
    document.getElementById('save-festival-settings-btn').addEventListener('click', async function() {
        const effects = appData.shopSettings.festivalEffects;
        effects.rain.enabled = document.getElementById('rain-effect-toggle').checked;
        effects.rain.intensity = document.getElementById('rain-intensity').value;
        effects.rain.opacity = document.getElementById('rain-opacity').value;
        
        effects.snow.enabled = document.getElementById('snow-effect-toggle').checked;
        effects.snow.intensity = document.getElementById('snow-intensity').value;
        effects.snow.opacity = document.getElementById('snow-opacity').value;

        effects.fireworks.enabled = document.getElementById('fireworks-effect-toggle').checked;
        effects.fireworks.duration = document.getElementById('fireworks-duration').value;
        effects.fireworks.opacity = document.getElementById('fireworks-opacity').value;
        
        await saveState(this);
        startStopFestivalAnimation();
    });

    document.getElementById('rain-effect-toggle').addEventListener('change', (e) => {
        document.getElementById('rain-controls-container').style.display = e.target.checked ? 'grid' : 'none';
    });
    document.getElementById('snow-effect-toggle').addEventListener('change', (e) => {
        document.getElementById('snow-controls-container').style.display = e.target.checked ? 'grid' : 'none';
    });
     document.getElementById('fireworks-effect-toggle').addEventListener('change', (e) => {
        document.getElementById('fireworks-controls-container').style.display = e.target.checked ? 'grid' : 'none';
    });

    // --- Init Function (FIXED) ---
    const init = async () => {
        try {
            await loadState();
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            startStopFestivalAnimation();

            if (appData.categories.length > 0) {
                if (!appData.categories.find(c => c.id === activeCategoryId)) {
                    activeCategoryId = appData.categories[0].id;
                }
                adminActiveCategoryId = activeCategoryId;
            } else {
                activeCategoryId = null;
                adminActiveCategoryId = null;
            }
            renderCustomerView();
        } catch (error) {
            console.error("Initialization failed:", error);
            const loaderContent = document.querySelector('#loader-overlay .loader-content');
            if (loaderContent) {
                loaderContent.innerHTML = `<p style="color: #ffc107;">เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองรีเฟรชหน้าเว็บ</p><p style="font-size: 0.8em; color: #ccc;">(${error.message})</p>`;
            }
        } finally {
            const loaderContent = document.querySelector('#loader-overlay .loader-content');
            if (!loaderContent.innerHTML.includes('เกิดข้อผิดพลาด')) {
                 setTimeout(() => {
                    document.getElementById('loader-overlay').style.display = 'none';
                }, 250);
            }
        }
    };

    init();
});
