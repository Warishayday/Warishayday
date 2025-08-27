document.addEventListener('DOMContentLoaded', () => {
    const API_ENDPOINT = '/.netlify/functions/data';

    // Default application state structure
    let appData = {
        categories: [],
        products: [],
        cart: {},
        adminPin: '210406', // WARNING: In a real-world app, this should be handled server-side.
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
            // NEW: Font size settings
            globalFontSize: 16,
            shopNameFontSize: 2.5,
            sloganFontSize: 1.2,
            // NEW: Festival effect settings
            festivalEffects: {
                rain: { enabled: false, intensity: 20, opacity: 0.5 },
                snow: { enabled: false, intensity: 20, opacity: 1 },
                fireworks: { enabled: false, timing: 5, opacity: 1 }
            },
            // NEW: Loading bar style
            loadingBarStyle: 'style-1',
        },
        analytics: {
            dailyTraffic: Array(7).fill(0),
            hourlyTraffic: Array(24).fill(0),
            productSales: {},
            orders: [], // Orders now have status: 'pending', 'active', 'cancelled'
            totalSales: 0,
            monthlyProfit: 0
        },
        menuOrder: [
            'admin', 'stock', 'order-number', 'dashboard', 'tax', 'manage-account' // NEW: tax menu
        ]
    };

    // Translations and constants
    const translations = {
        th: {
            // ... existing translations ...
            // NEW Translations
            loadingMessage: "กำลังดาวน์โหลดข้อมูลล่าสุด...",
            saveSuccessMessage: "บันทึกสำเร็จ!",
            menuTax: "ตรวจสอบภาษี",
            taxCalculationTitle: "คำนวณภาษี (ภ.ง.ด. 90/94)",
            taxInfo: "ระบบจะดึงยอดขายทั้งหมดจากออเดอร์ที่ยืนยันแล้วมาคำนวณภาษีเบื้องต้น (เป็นการประมาณการเท่านั้น)",
            selectYearLabel: "เลือกปีภาษี",
            totalSalesLabel: "ยอดขายรวม",
            assessableIncomeLabel: "เงินได้พึงประเมิน (40(8))",
            deductionsLabel: "การหักค่าใช้จ่าย",
            actualDeductionLabel: "หักตามจริง (ต้องมีเอกสาร)",
            percentageDeductionLabel: "หักเหมา 60%",
            otherDeductionsLabel: "ค่าลดหย่อนอื่นๆ",
            taxSummaryTitle: "สรุปการคำนวณภาษี",
            netIncomeLabel: "เงินได้สุทธิ:",
            estimatedTaxLabel: "ภาษีที่ต้องชำระ (ประมาณ):",
            shopNameFontSizeLabel: "ขนาดฟอนต์ชื่อร้าน",
            sloganFontSizeLabel: "ขนาดฟอนต์สโลแกน",
            globalFontSizeLabel: "ขนาดฟอนต์ทั้งระบบ",
            festivalTitle: "Festival Effects",
            rainEffectLabel: "เอฟเฟกต์ฝนตก",
            snowEffectLabel: "เอฟเฟกต์หิมะตก",
            fireworksEffectLabel: "เอฟเฟกต์พลุ",
            intensityLabel: "ความแรง (หนัก/เบา)",
            opacityLabel: "ความชัด (ชัด/จาง)",
            timingLabel: "ความถี่ (นาที)",
            viewPriceBtn: "ดูราคา",
            menuOrderConfirm: "คอนเฟิร์มออเดอร์",
            confirmOrdersTitle: "ออเดอร์รอคอนเฟิร์ม",
            confirmOrderAction: "ยืนยันออเดอร์",
            permanentlyDelete: "ลบถาวร",
        },
        en: {
            // ... existing translations ...
        }
    };
    
    // Add new menu keys for translation
    const MENU_NAMES = {
        'admin': 'menuAdmin', 'stock': 'menuStock', 'order-number': 'menuOrderNumber',
        'dashboard': 'menuDashboard', 'tax': 'menuTax', 'manage-account': 'menuManageAccount'
    };
    const SUB_MENUS = {
        'admin': { 'shop-info': 'shopInfoTitle', 'system-fonts': 'systemFontsTitle', 'background': 'backgroundSettingsTitle', 'loading-bg': 'loadingBackgroundTitle', 'festival': 'festivalTitle', 'pin': 'changePinTitle' },
        'stock': { 'categories': 'manageCategoriesTitle', 'products': 'manageProductsTitle' },
        'order-number': { 'confirm-orders': 'menuOrderConfirm', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' }
    };

    // State, DOM elements, and variables
    let activeAdminSubMenus = { admin: 'shop-info', stock: 'categories', 'order-number': 'confirm-orders' };
    // ... other variables ...

    // NEW: Festival Canvas elements
    const festivalCanvas = document.getElementById('festival-canvas');
    const festivalCtx = festivalCanvas.getContext('2d');
    let animationFrameId;
    let rainDrops = [], snowFlakes = [], fireworks = [];


    // ===================================================================
    // ===== CORE FUNCTIONS (SAVE, LOAD, UTILITIES)                  =====
    // ===================================================================

    const showToast = (messageKey) => {
        const toast = document.getElementById('toast-notification');
        toast.textContent = translations[appData.shopSettings.language][messageKey] || messageKey;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    };
    
    const saveState = async (showFeedback = false) => {
        if (showFeedback) {
            showToast('saveSuccessMessage');
        }
        try {
            // The actual save operation runs in the background
            await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData),
            });
        } catch (error) {
            console.error('Failed to save state:', error);
            // Optionally show an error toast
        }
    };
    
    // ... loadState function remains largely the same, just ensure new properties in appData have defaults ...

    // ===================================================================
    // ===== THEME & APPEARANCE FUNCTIONS                            =====
    // ===================================================================

    const applyTheme = () => {
        const settings = appData.shopSettings;
        document.documentElement.style.setProperty('--primary-color', settings.themeColor);
        document.documentElement.style.setProperty('--global-font', settings.globalFontFamily);
        // NEW: Apply font sizes
        document.documentElement.style.setProperty('--global-font-size', `${settings.globalFontSize}px`);
        document.documentElement.style.setProperty('--shop-name-font-size', `${settings.shopNameFontSize}rem`);
        document.documentElement.style.setProperty('--slogan-font-size', `${settings.sloganFontSize}rem`);
        
        // ... rest of applyTheme function ...
        
        // NEW: Apply loading bar style
        const progressBar = document.querySelector('#progress-bar-container .progress-bar');
        if (progressBar) {
            progressBar.className = `progress-bar ${settings.loadingBarStyle}`;
        }

        // NEW: Start/Stop festival effects
        updateFestivalEffects();
    };

    // ===================================================================
    // ===== FESTIVAL EFFECTS                                        =====
    // ===================================================================

    function setupCanvas() {
        festivalCanvas.width = window.innerWidth;
        festivalCanvas.height = window.innerHeight;
    }

    function createRainDrop() { /* ... logic to create a rain drop object ... */ }
    function createSnowFlake() { /* ... logic to create a snow flake object ... */ }
    function createFirework() { /* ... logic to create a firework object ... */ }
    
    function drawEffects() {
        festivalCtx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
        // ... logic to draw rain, snow, fireworks ...
    }

    function animateEffects() {
        drawEffects();
        animationFrameId = requestAnimationFrame(animateEffects);
    }

    function updateFestivalEffects() {
        cancelAnimationFrame(animationFrameId);
        const effects = appData.shopSettings.festivalEffects;
        if (effects.rain.enabled || effects.snow.enabled || effects.fireworks.enabled) {
            setupCanvas();
            // Initialize effect arrays (rainDrops, snowFlakes, etc.) based on settings
            animateEffects();
        } else {
            festivalCtx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
        }
    }
    
    window.addEventListener('resize', () => {
        if (appData.shopSettings.festivalEffects.rain.enabled || appData.shopSettings.festivalEffects.snow.enabled) {
            setupCanvas();
        }
    });

    // ===================================================================
    // ===== CUSTOMER VIEW & ORDERING LOGIC                          =====
    // ===================================================================

    document.getElementById('copy-order-btn').addEventListener('click', async () => {
        // UPDATE: Close modal first, then show success
        orderModal.style.display = 'none';
        const orderText = orderDetails.textContent;
        try {
            await navigator.clipboard.writeText(orderText);
            
            // ... logic to calculate total price ...
            
            // UPDATE: Save order with 'pending' status
            const newOrder = { 
                id: orderDetails.dataset.orderNumber, 
                timestamp: new Date().toISOString(), 
                total: totalOrderPrice, 
                items: { ...appData.cart }, 
                status: 'pending' // NEW
            };
            appData.analytics.orders.push(newOrder);

            appData.cart = {};
            await saveState(); // Save silently in the background

            // Show success animation
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

    // ===================================================================
    // ===== ADMIN PANEL LOGIC                                       =====
    // ===================================================================

    const renderAdminPanel = () => {
        // ... existing logic ...
        if (activeAdminMenu === 'tax' && canAccess('tax')) {
            document.getElementById('admin-menu-tax').style.display = 'block';
            renderTaxView();
        }
        // ... existing logic ...
    };

    // --- Admin Settings ---
    const setupAdminSettingsListeners = () => {
        // ... existing listeners ...
        document.getElementById('save-font-sizes-btn').addEventListener('click', () => {
            appData.shopSettings.shopNameFontSize = document.getElementById('shop-name-font-size').value;
            appData.shopSettings.sloganFontSize = document.getElementById('slogan-font-size').value;
            appData.shopSettings.globalFontSize = document.getElementById('global-font-size').value;
            saveState(true);
            applyTheme();
        });
        document.getElementById('save-festival-settings-btn').addEventListener('click', () => {
            const effects = appData.shopSettings.festivalEffects;
            effects.rain.enabled = document.getElementById('rain-effect-toggle').checked;
            effects.rain.intensity = document.getElementById('rain-intensity').value;
            effects.rain.opacity = document.getElementById('rain-opacity').value;
            // ... save snow and fireworks settings ...
            saveState(true);
            updateFestivalEffects();
        });
    };

    // --- Stock Management UI Updates ---
    const renderAdminCategories = () => {
        const list = document.getElementById('admin-cat-list');
        list.innerHTML = '';
        appData.categories.forEach(cat => {
            const row = document.createElement('tr');
            // UPDATE: Price column now has a button
            row.innerHTML = `
                <td>${cat.icon ? `<img src="${cat.icon}" alt="icon">` : 'ไม่มี'}</td>
                <td>${cat.name}</td>
                <td>${cat.minOrderQuantity}</td>
                <td><button class="btn btn-info btn-small btn-view-price" data-id="${cat.id}">${translations[appData.shopSettings.language].viewPriceBtn}</button></td>
                <td>... buttons ...</td>`;
            list.appendChild(row);
        });
    };
    
    document.getElementById('admin-cat-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-view-price')) {
            // Logic to open price details modal
        }
        // ... other click handlers ...
    });

    const renderAdminProductTabs = () => {
        // UPDATE: Render horizontal tabs instead of dropdown
        const tabsContainer = document.getElementById('admin-product-tabs');
        // ... logic to create and render horizontal tabs ...
    };

    // --- Order Number Management Update ---
    const renderOrderNumberView = (dateRange = []) => {
        const confirmList = document.getElementById('confirm-orders-list');
        // ... other lists ...
        confirmList.innerHTML = '';

        // ... filtering logic ...
        orders.forEach(order => {
            // ...
            if (order.status === 'pending') {
                row.innerHTML = `... <td><button class="btn btn-success btn-small confirm-order" data-id="${order.id}">Confirm</button><button class="btn btn-danger btn-small cancel-order-perm" data-id="${order.id}">Cancel</button></td>`;
                confirmList.appendChild(row);
            } else if (order.status === 'active') {
                // ...
            } // ...
        });

        // Add event listeners for new buttons
        document.querySelectorAll('.confirm-order').forEach(btn => btn.addEventListener('click', (e) => confirmOrder(e.target.dataset.id)));
        document.querySelectorAll('.cancel-order-perm').forEach(btn => btn.addEventListener('click', (e) => permanentlyCancelOrder(e.target.dataset.id)));
    };
    
    const confirmOrder = async (orderId) => {
        const order = appData.analytics.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'active';
            // Logic to update stock based on this confirmed order
            await saveState();
            renderOrderNumberView();
        }
    };
    
    const permanentlyCancelOrder = async (orderId) => {
        if (confirm('ยืนยันการลบออเดอร์นี้ถาวร?')) {
            appData.analytics.orders = appData.analytics.orders.filter(o => o.id !== orderId);
            await saveState();
            renderOrderNumberView();
        }
    };

    // --- NEW: Tax Calculation View ---
    const renderTaxView = () => {
        // ... logic to populate year dropdown ...
        calculateTaxes(); // Initial calculation
    };

    const calculateTaxes = () => {
        const selectedYear = document.getElementById('tax-year-select').value;
        const ordersInYear = appData.analytics.orders.filter(o => o.status === 'active' && new Date(o.timestamp).getFullYear() == selectedYear);
        const totalSales = ordersInYear.reduce((sum, order) => sum + order.total, 0);
        
        // Simplified tax logic
        const assessableIncome = totalSales; // Assuming 40(8)
        // ... more complex tax calculation logic for deductions, brackets, etc. ...
        
        document.getElementById('tax-total-sales').textContent = `${totalSales.toLocaleString()} บาท`;
        // ... update other tax UI elements ...
    };

    // ===================================================================
    // ===== INITIALIZATION                                          =====
    // ===================================================================
    const init = async () => {
        await loadState();
        applyLoadingBackground(); // Show loading BG immediately
        // ... rest of init ...
        setupAdminSettingsListeners(); // Call new listener setup
        init();
    };

    init();
});
