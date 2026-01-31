// script.js - File JavaScript chính cho Travelo

// Khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    console.log('Travio website đã sẵn sàng!');
    
    // Khai báo các biến toàn cục
    const openLoginBtn = document.getElementById('openLoginBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.querySelector('.login-form');
    const searchForm = document.querySelector('.search-form');
    const guestSearchBtn = document.querySelector('.guest-btn');
    
    // Kiểm tra xem các phần tử có tồn tại không
    if (!openLoginBtn || !loginModal || !loginForm) {
        console.warn('Một số phần tử đăng nhập không tìm thấy');
    }
    
    // ========== CHỨC NĂNG MODAL ĐĂNG NHẬP ==========
    
    // Mở modal đăng nhập
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', function() {
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Ngăn scroll
        });
    }
    
    // Đóng modal đăng nhập
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Cho phép scroll lại
        });
    }
    
    // Đóng modal khi click bên ngoài
    if (loginModal) {
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Đóng modal bằng phím ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ========== XỬ LÝ FORM ĐĂNG NHẬP ==========
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Kiểm tra validation
            if (!email || !password) {
                showAlert('Vui lòng điền đầy đủ email và mật khẩu!', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Email không hợp lệ! Vui lòng kiểm tra lại.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
                return;
            }
            
            // Hiệu ứng loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            submitBtn.disabled = true;
            
            // Giả lập gửi dữ liệu đăng nhập
            setTimeout(function() {
                // Đóng modal
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                loginForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hiển thị thông báo thành công
                showAlert('Đăng nhập thành công! Chào mừng bạn đến với Travelo.', 'success');
                
                // Thay đổi nút đăng nhập thành thông tin user (demo)
                openLoginBtn.innerHTML = '<i class="fas fa-user"></i> Tài khoản';
                openLoginBtn.style.backgroundColor = '#4CAF50';
                
                // Lưu trạng thái đăng nhập (demo)
                if (remember) {
                    localStorage.setItem('travelo_logged_in', 'true');
                    localStorage.setItem('travelo_user_email', email);
                }
                
                console.log('Đăng nhập với:', { email, remember });
            }, 1500);
        });
    }
    
    // ========== XỬ LÝ FORM TÌM KIẾM ==========
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('destination').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const guests = document.getElementById('guests').value;
            
            // Kiểm tra validation
            if (!destination) {
                showAlert('Vui lòng nhập điểm đến!', 'error');
                document.getElementById('destination').focus();
                return;
            }
            
            if (!checkin || !checkout) {
                showAlert('Vui lòng chọn ngày nhận và trả phòng!', 'error');
                return;
            }
            
            // Kiểm tra ngày checkout phải sau checkin
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            
            if (checkoutDate <= checkinDate) {
                showAlert('Ngày trả phòng phải sau ngày nhận phòng!', 'error');
                return;
            }
            
            // Hiệu ứng loading
            const searchBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = searchBtn.innerHTML;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tìm kiếm...';
            searchBtn.disabled = true;
            
            // Giả lập tìm kiếm
            setTimeout(function() {
                // Reset button
                searchBtn.innerHTML = originalText;
                searchBtn.disabled = false;
                
                // Hiển thị kết quả tìm kiếm (demo)
                showAlert(`Tìm thấy 25 khách sạn tại ${destination} từ ${formatDate(checkin)} đến ${formatDate(checkout)} cho ${guests.toLowerCase()}`, 'success');
                
                // Cuộn đến phần destinations
                document.getElementById('destinations').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
                console.log('Tìm kiếm:', { destination, checkin, checkout, guests });
            }, 2000);
        });
    }
    
    // ========== CHỨC NĂNG TÌM KIẾM VỚI TƯ CÁCH KHÁCH ==========
    
    if (guestSearchBtn) {
        guestSearchBtn.addEventListener('click', function() {
            showAlert('Bạn đang tìm kiếm với tư cách khách. Đăng ký tài khoản để nhận ưu đãi đặc biệt!', 'info');
            
            // Cuộn đến form tìm kiếm
            document.querySelector('.search-box').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Tự động focus vào ô điểm đến
            document.getElementById('destination').focus();
        });
    }
    
    // ========== THIẾT LẬP NGÀY THÁNG ==========
    
    // Set min date cho check-in là hôm nay
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.min = today;
        checkinInput.value = today;
        
        // Set min date cho checkout khi checkin thay đổi
        checkinInput.addEventListener('change', function() {
            if (checkoutInput) {
                checkoutInput.min = this.value;
                
                // Nếu checkout đã chọn trước đó mà nhỏ hơn checkin mới
                if (checkoutInput.value && checkoutInput.value < this.value) {
                    checkoutInput.value = this.value;
                }
            }
        });
    }
    
    // Set giá trị mặc định cho checkout (3 ngày sau)
    if (checkoutInput) {
        const nextThreeDays = new Date();
        nextThreeDays.setDate(nextThreeDays.getDate() + 3);
        checkoutInput.min = today;
        checkoutInput.value = nextThreeDays.toISOString().split('T')[0];
    }
    
    // ========== XỬ LÝ CARDS DESTINATIONS ==========
    
    // Thêm hiệu ứng click cho destination cards
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('click', function() {
            const destinationName = this.querySelector('.destination-name').textContent;
            showAlert(`Bạn đã chọn điểm đến: ${destinationName}. Đang tải các khách sạn...`, 'info');
            
            // Auto-fill vào form tìm kiếm
            document.getElementById('destination').value = destinationName;
            
            // Cuộn đến form tìm kiếm
            document.querySelector('.search-box').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
        
        // Thêm hiệu ứng cursor pointer
        card.style.cursor = 'pointer';
    });
    
    // ========== XỬ LÝ SOCIAL LOGIN BUTTONS ==========
    
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1].replace('-btn', '');
            showAlert(`Đang kết nối với ${platform}... (Chức năng demo)`, 'info');
            
            // Đóng modal sau 2 giây (demo)
            setTimeout(() => {
                if (loginModal) {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    showAlert(`Đăng nhập với ${platform} thành công!`, 'success');
                }
            }, 2000);
        });
    });
    
    // ========== KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP ĐÃ LƯU ==========
    
    checkLoginStatus();
    
    // ========== HÀM TIỆN ÍCH ==========
    
    // Hàm hiển thị thông báo
    function showAlert(message, type = 'info') {
        // Xóa alert cũ nếu có
        const oldAlert = document.querySelector('.custom-alert');
        if (oldAlert) {
            oldAlert.remove();
        }
        
        // Tạo alert mới
        const alert = document.createElement('div');
        alert.className = `custom-alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        // Thêm style cho alert
        const style = document.createElement('style');
        style.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 500px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease-out;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .alert-success { background-color: #4CAF50; }
            .alert-error { background-color: #f44336; }
            .alert-info { background-color: #2196F3; }
            .close-alert {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(alert);
        
        // Tự động xóa alert sau 5 giây
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
        
        // Thêm nút đóng
        const closeBtn = alert.querySelector('.close-alert');
        closeBtn.addEventListener('click', () => {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        });
        
        // Thêm animation slideOut
        if (!document.querySelector('#alert-animations')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'alert-animations';
            animStyle.textContent = `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animStyle);
        }
    }
    
    // Hàm kiểm tra email hợp lệ
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Hàm định dạng ngày tháng
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Hàm kiểm tra trạng thái đăng nhập
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('travelo_logged_in');
        const userEmail = localStorage.getItem('travelo_user_email');
        
        if (isLoggedIn === 'true' && userEmail) {
            // Cập nhật UI cho trạng thái đã đăng nhập
            if (openLoginBtn) {
                openLoginBtn.innerHTML = `<i class="fas fa-user"></i> ${userEmail.split('@')[0]}`;
                openLoginBtn.style.backgroundColor = '#4CAF50';
            }
            
            console.log('User đã đăng nhập trước đó:', userEmail);
        }
    }
    
    // ========== THÊM HIỆU ỨNG CHO NAVIGATION ==========
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            } else {
                // Xử lý các link khác
                showAlert(`Đang chuyển đến ${this.textContent}... (Chức năng demo)`, 'info');
            }
        });
    });
    
    // ========== THÊM LOADING CHO TRANG ==========
    
    // Giả lập loading khi trang tải
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s';
    }, 100);
    
    // ========== LOG RA CONSOLE ==========
    
    console.log('Travio script đã được tải thành công!');
    console.log('Các chức năng có sẵn:');
    console.log('1. Modal đăng nhập (Email + Social)');
    console.log('2. Form tìm kiếm với validation');
    console.log('3. Xử lý ngày tháng tự động');
    console.log('4. Thông báo alert hệ thống');
    console.log('5. Click vào destination cards');
    console.log('6. Responsive navigation');
    // ================== CURRENCY CONVERTER FUNCTIONS ==================
// Thêm code này vào CUỐI file script.js, trước dòng cuối cùng (dấu ngoặc nhọn đóng)

// Kiểm tra nếu có section currency converter
function initCurrencyConverterIfExists() {
    const converterSection = document.getElementById('currency-converter');
    if (!converterSection) {
        console.log('Không tìm thấy currency converter section');
        return;
    }
    
    console.log('Khởi tạo currency converter...');
    
    // Exchange rates (sample data)
    const exchangeRates = {
            VND: { 
                USD: 0.000043, EUR: 0.000037, GBP: 0.000032, JPY: 0.0048, 
                KRW: 0.05, SGD: 0.000059, AUD: 0.000057, CAD: 0.000058,
                CHF: 0.000038, CNY: 0.00031, THB: 0.0015, MYR: 0.00020,
                IDR: 0.065, PHP: 0.0024, VND: 1
            },
            USD: { 
                VND: 23250, EUR: 0.85, GBP: 0.73, JPY: 110, 
                KRW: 1150, SGD: 1.35, AUD: 1.3, CAD: 1.33,
                CHF: 0.88, CNY: 7.15, THB: 34.5, MYR: 4.65,
                IDR: 15000, PHP: 56.5, USD: 1
            },
            EUR: { 
                VND: 27350, USD: 1.18, GBP: 0.86, JPY: 130, 
                KRW: 1350, SGD: 1.59, AUD: 1.53, CAD: 1.57,
                CHF: 1.04, CNY: 8.42, THB: 40.6, MYR: 5.47,
                IDR: 17650, PHP: 66.5, EUR: 1
            },
            GBP: { 
                VND: 31850, USD: 1.37, EUR: 1.16, JPY: 151, 
                KRW: 1570, SGD: 1.84, AUD: 1.78, CAD: 1.82,
                CHF: 1.20, CNY: 9.78, THB: 47.2, MYR: 6.36,
                IDR: 20550, PHP: 77.5, GBP: 1
            },
            JPY: { 
                VND: 210, USD: 0.0091, EUR: 0.0077, GBP: 0.0066, 
                KRW: 10.45, SGD: 0.0123, AUD: 0.0118, CAD: 0.0121,
                CHF: 0.0080, CNY: 0.065, THB: 0.314, MYR: 0.0423,
                IDR: 136.5, PHP: 0.514, JPY: 1
            },
            KRW: { 
                VND: 20, USD: 0.00087, EUR: 0.00074, GBP: 0.00064, 
                JPY: 0.096, SGD: 0.00117, AUD: 0.00113, CAD: 0.00116,
                CHF: 0.00077, CNY: 0.0062, THB: 0.030, MYR: 0.00404,
                IDR: 13.04, PHP: 0.0491, KRW: 1
            },
            SGD: { 
                VND: 17000, USD: 0.74, EUR: 0.63, GBP: 0.54, 
                JPY: 81.5, KRW: 850, AUD: 0.96, CAD: 0.98,
                CHF: 0.65, CNY: 5.29, THB: 25.5, MYR: 3.44,
                IDR: 11100, PHP: 41.8, SGD: 1
            },
            AUD: { 
                VND: 17700, USD: 0.77, EUR: 0.65, GBP: 0.56, 
                JPY: 85, KRW: 885, SGD: 1.04, CAD: 1.06,
                CHF: 0.70, CNY: 5.50, THB: 26.5, MYR: 3.57,
                IDR: 11550, PHP: 43.5, AUD: 1
            },
            CAD: { 
                VND: 17250, USD: 0.75, EUR: 0.64, GBP: 0.55, 
                JPY: 82.5, KRW: 860, SGD: 1.02, AUD: 0.94,
                CHF: 0.66, CNY: 5.38, THB: 26.0, MYR: 3.50,
                IDR: 11300, PHP: 42.5, CAD: 1
            },
            CHF: { 
                VND: 26300, USD: 1.13, EUR: 0.96, GBP: 0.83, 
                JPY: 125, KRW: 1300, SGD: 1.54, AUD: 1.43,
                CAD: 1.51, CNY: 8.13, THB: 39.2, MYR: 5.28,
                IDR: 17050, PHP: 64.2, CHF: 1
            },
            CNY: { 
                VND: 3230, USD: 0.14, EUR: 0.119, GBP: 0.102, 
                JPY: 15.38, KRW: 161, SGD: 0.189, AUD: 0.182,
                CAD: 0.186, CHF: 0.123, THB: 4.83, MYR: 0.65,
                IDR: 2100, PHP: 7.90, CNY: 1
            },
            THB: { 
                VND: 670, USD: 0.029, EUR: 0.0246, GBP: 0.0212, 
                JPY: 3.19, KRW: 33.3, SGD: 0.0392, AUD: 0.0377,
                CAD: 0.0385, CHF: 0.0255, CNY: 0.207, MYR: 0.134,
                IDR: 435, PHP: 1.64, THB: 1
            },
            MYR: { 
                VND: 5000, USD: 0.215, EUR: 0.183, GBP: 0.157, 
                JPY: 23.7, KRW: 247, SGD: 0.291, AUD: 0.280,
                CAD: 0.286, CHF: 0.189, CNY: 1.54, THB: 7.45,
                IDR: 3250, PHP: 12.15, MYR: 1
            },
            IDR: { 
                VND: 1.54, USD: 0.000067, EUR: 0.000057, GBP: 0.000049, 
                JPY: 0.0073, KRW: 0.0767, SGD: 0.000090, AUD: 0.000087,
                CAD: 0.000088, CHF: 0.000059, CNY: 0.00048, THB: 0.0023,
                MYR: 0.00031, PHP: 0.0038, IDR: 1
            },
            PHP: { 
                VND: 415, USD: 0.0177, EUR: 0.0150, GBP: 0.0129, 
                JPY: 1.95, KRW: 20.4, SGD: 0.0239, AUD: 0.0230,
                CAD: 0.0235, CHF: 0.0156, CNY: 0.127, THB: 0.610,
                MYR: 0.0823, IDR: 265, PHP: 1
            }
        };
        
        // All available currencies for dropdown
        const allCurrencies = [
            { code: 'VND', name: 'Đồng Việt Nam', flag: '🇻🇳' },
            { code: 'USD', name: 'Đô la Mỹ', flag: '🇺🇸' },
            { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
            { code: 'GBP', name: 'Bảng Anh', flag: '🇬🇧' },
            { code: 'JPY', name: 'Yên Nhật', flag: '🇯🇵' },
            { code: 'KRW', name: 'Won Hàn Quốc', flag: '🇰🇷' },
            { code: 'SGD', name: 'Đô la Singapore', flag: '🇸🇬' },
            { code: 'AUD', name: 'Đô la Úc', flag: '🇦🇺' },
            { code: 'CAD', name: 'Đô la Canada', flag: '🇨🇦' },
            { code: 'CHF', name: 'Franc Thụy Sĩ', flag: '🇨🇭' },
            { code: 'CNY', name: 'Nhân dân tệ', flag: '🇨🇳' },
            { code: 'THB', name: 'Bạt Thái', flag: '🇹🇭' },
            { code: 'MYR', name: 'Ringgit Malaysia', flag: '🇲🇾' },
            { code: 'IDR', name: 'Rupiah Indonesia', flag: '🇮🇩' },
            { code: 'PHP', name: 'Peso Philippines', flag: '🇵🇭' }
        ];
        
        // Popular currencies data
        const popularCurrencies = [
            { code: 'USD', name: 'Đô la Mỹ', flag: '🇺🇸' },
            { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
            { code: 'GBP', name: 'Bảng Anh', flag: '🇬🇧' },
            { code: 'JPY', name: 'Yên Nhật', flag: '🇯🇵' },
            { code: 'KRW', name: 'Won Hàn', flag: '🇰🇷' },
            { code: 'SGD', name: 'Đô la Singapore', flag: '🇸🇬' }
        ];
    
    // DOM Elements - Thay bằng ID thực tế của bạn
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    const convertBtn = document.getElementById('convertBtn');
    const resultBox = document.getElementById('resultBox');
    const resultAmount = document.getElementById('resultAmount');
    const resultDetails = document.getElementById('resultDetails');
    const rateInfo = document.getElementById('rateInfo');
    
    // Kiểm tra xem các elements có tồn tại không
    if (!amountInput || !fromCurrencySelect || !convertBtn) {
        console.warn('Một số phần tử converter không tìm thấy');
        return;
    }
    
    // Format currency
    function formatCurrency(amount, currencyCode) {
        if (currencyCode === 'VND') {
            return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
        } else if (currencyCode === 'JPY') {
            return '¥' + new Intl.NumberFormat('ja-JP').format(Math.round(amount));
        } else if (currencyCode === 'KRW') {
            return '₩' + new Intl.NumberFormat('ko-KR').format(Math.round(amount));
        } else {
            try {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currencyCode,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(amount);
            } catch (e) {
                return amount.toFixed(2) + ' ' + currencyCode;
            }
        }
    }
    
    // Convert currency
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (isNaN(amount) || amount <= 0) {
            showAlert('Vui lòng nhập số tiền hợp lệ!', 'error');
            return;
        }
        
        // Show loading
        const originalText = convertBtn.innerHTML;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tính...';
        convertBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
            // Calculate conversion
            let result;
            let rate;
            
            if (fromCurrency === 'VND') {
                // From VND to other
                rate = exchangeRates[toCurrency];
                result = amount * rate;
            } else if (toCurrency === 'VND') {
                // From other to VND
                rate = 1 / exchangeRates[fromCurrency];
                result = amount / exchangeRates[fromCurrency];
            } else {
                // Between two non-VND currencies
                const amountInVND = amount / exchangeRates[fromCurrency];
                result = amountInVND * exchangeRates[toCurrency];
                rate = (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);
            }
            
            // Display result
            if (resultAmount) {
                resultAmount.textContent = formatCurrency(result, toCurrency);
            }
            
            if (resultDetails) {
                resultDetails.innerHTML = `
                    ${formatCurrency(amount, fromCurrency)} = ${formatCurrency(result, toCurrency)}<br>
                    <small>${currencyNames[fromCurrency]} → ${currencyNames[toCurrency]}</small>
                `;
            }
            
            // Display rate info
            const rateDisplay = fromCurrency === 'VND' 
                ? exchangeRates[toCurrency].toFixed(6)
                : toCurrency === 'VND'
                ? (1 / exchangeRates[fromCurrency]).toFixed(6)
                : rate.toFixed(6);
                
            if (rateInfo) {
                rateInfo.innerHTML = `
                    <strong>Tỷ giá:</strong> 1 ${fromCurrency} = ${rateDisplay} ${toCurrency}<br>
                    <small>Cập nhật: ${new Date().toLocaleDateString('vi-VN')}</small>
                `;
            }
            
            // Show result box
            if (resultBox) {
                resultBox.classList.add('show');
                
                // Scroll to result
                resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Reset button
            convertBtn.innerHTML = originalText;
            convertBtn.disabled = false;
        }, 800);
    }
    
    // Swap currencies
    function swapCurrencies() {
        if (!fromCurrencySelect || !toCurrencySelect) return;
        
        const fromValue = fromCurrencySelect.value;
        const toValue = toCurrencySelect.value;
        
        fromCurrencySelect.value = toValue;
        toCurrencySelect.value = fromValue;
        
        // Auto-convert after swap
        convertCurrency();
    }
    
    // Event Listeners
    if (convertBtn) {
        convertBtn.addEventListener('click', convertCurrency);
    }
    
    if (swapBtn) {
        swapBtn.addEventListener('click', swapCurrencies);
    }
    
    // Auto-convert on input change
    if (amountInput) {
        amountInput.addEventListener('input', convertCurrency);
    }
    
    if (fromCurrencySelect) {
        fromCurrencySelect.addEventListener('change', convertCurrency);
    }
    
    if (toCurrencySelect) {
        toCurrencySelect.addEventListener('change', convertCurrency);
    }
    
    // Currency cards click (nếu có)
    const currencyCards = document.querySelectorAll('.currency-card');
    currencyCards.forEach(card => {
        card.addEventListener('click', function() {
            const currencyCode = this.getAttribute('data-currency');
            if (fromCurrencySelect) {
                fromCurrencySelect.value = currencyCode;
                
                // Highlight selected card
                currencyCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Auto-convert
                convertCurrency();
            }
        });
    });
    
    // Add active class to default selected currency
    if (fromCurrencySelect) {
        const defaultCurrencyCard = document.querySelector(`[data-currency="${fromCurrencySelect.value}"]`);
        if (defaultCurrencyCard) {
            defaultCurrencyCard.classList.add('active');
        }
    }
    
    // Auto-convert on page load (nếu converter section đang hiển thị)
    const converterSectionRect = converterSection.getBoundingClientRect();
    if (converterSectionRect.top < window.innerHeight && converterSectionRect.bottom > 0) {
        setTimeout(() => {
            convertCurrency();
        }, 1000);
    }
    
    console.log('Currency converter initialized successfully!');
}

// Gọi hàm init khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // ... code hiện tại của bạn ...
    
    // Thêm dòng này vào CUỐI event listener DOMContentLoaded:
    initCurrencyConverterIfExists();
});

// Hoặc nếu bạn muốn gọi độc lập, thêm ở ngoài:
// Gọi khi trang đã load xong
window.addEventListener('load', function() {
    // Đợi một chút để đảm bảo mọi thứ đã sẵn sàng
    setTimeout(initCurrencyConverterIfExists, 500);
});
// ================== END CURRENCY CONVERTER FUNCTIONS ==================
// script.js - Main JavaScript File

// ============ BOOKING PAGE FUNCTIONS ============
function initBookingPage() {
    const bookingForm = document.getElementById('flightBookingForm');
    const successMessage = document.getElementById('successMessage');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
        // Set min date to tomorrow
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        
        const dateInput = document.getElementById('flightDate');
        if (dateInput) {
            dateInput.min = minDate;
            dateInput.value = '2026-01-19'; // Default date
        }
        
        // Update steps on input focus
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('focus', updateBookingSteps);
        });
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        flightDate: document.getElementById('flightDate')?.value || '',
        passengers: document.getElementById('passengers')?.value || '1',
        flightClass: document.getElementById('class')?.value || 'business',
        flightNumber: 'QH154',
        departure: '9:05',
        boarding: '8:25',
        terminal: 'Terminal 1',
        bookingTime: new Date().toISOString()
    };
    
    // Add full name
    formData.fullName = `${formData.firstName} ${formData.lastName}`;
    
    // Save to localStorage
    localStorage.setItem('flightBooking', JSON.stringify(formData));
    
    // Show success message
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    
    if (bookingForm && successMessage) {
        bookingForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Update all steps to active
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('active');
        });
        
        // Auto redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'special-deals.html';
        }, 5000);
    }
}

function updateBookingSteps() {
    // Update step indicators based on which field is focused
    const focusedElement = document.activeElement;
    const formGroups = Array.from(document.querySelectorAll('.form-group'));
    const focusedIndex = formGroups.findIndex(group => 
        group.contains(focusedElement)
    );
    
    if (focusedIndex >= 0) {
        const stepNumber = Math.min(focusedIndex + 1, 3);
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index < stepNumber);
        });
    }
}

// ============ TICKET PAGE FUNCTIONS ============
function initTicketPage() {
    const bookingData = JSON.parse(localStorage.getItem('flightBooking'));
    
    if (!bookingData) {
        // No booking data, show message
        document.getElementById('noBookingMessage').style.display = 'block';
        document.getElementById('ticketContent').style.display = 'none';
    } else {
        // Display ticket with booking data
        displayTicketInfo(bookingData);
        startCountdown(bookingData.flightDate);
        setupNewsletter(bookingData.email);
    }
    
    // Add print button
    addPrintButton();
}

function displayTicketInfo(data) {
    const ticketContent = document.getElementById('ticketContent');
    if (!ticketContent) return;
    
    // Format date
    const flightDate = new Date(data.flightDate);
    const formattedDate = flightDate.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Generate booking reference
    const bookingRef = 'PHG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const bookingRefElement = document.getElementById('bookingRef');
    if (bookingRefElement) {
        bookingRefElement.textContent = bookingRef;
    }
    
    // Class mapping
    const classMap = {
        'economy': 'Hạng Phổ Thông',
        'business': 'Hạng Thương Gia',
        'first': 'Hạng Nhất'
    };
    
    ticketContent.innerHTML = `
        <div class="flight-route">Hồ Chí Minh (SGN) – Bangkok (BKK)</div>
        
        <div class="flight-details">
            <div class="detail-item">
                <div class="detail-label">Ngày khởi hành</div>
                <div class="detail-value">${formattedDate}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Số hành khách</div>
                <div class="detail-value">${data.passengers} hành khách</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Hạng vé</div>
                <div class="detail-value">${classMap[data.flightClass] || 'Hạng Thương Gia'}</div>
            </div>
        </div>
        
        <div class="terminal-info">
            <div class="flight-number">Sân bay: ${data.terminal} | Chuyến bay: ${data.flightNumber}</div>
            <div class="time-info">
                <div class="time-box">
                    <div class="time-label">Giờ khởi hành</div>
                    <div class="time-value">${data.departure}</div>
                </div>
                <div class="time-box">
                    <div class="time-label">Giờ lên máy bay</div>
                    <div class="time-value">${data.boarding}</div>
                </div>
            </div>
        </div>
        
        <div class="passenger-info">
            <div class="time-label">Hành khách chính</div>
            <div class="passenger-name">${data.fullName.toUpperCase()}</div>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                Email: ${data.email} | Đặt vé lúc: ${new Date(data.bookingTime).toLocaleString('vi-VN')}
            </div>
        </div>
        
        <div class="qr-section">
            <div>Mã QR e-ticket</div>
            <div class="qr-placeholder">
                Quét mã QR tại sân bay
            </div>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                Mã vé: ${bookingRef}
            </div>
        </div>
        
        <div class="countdown-section">
            <div class="countdown-title">Đếm ngược đến giờ khởi hành của bạn</div>
            <div class="countdown-timer">
                <div class="countdown-unit">
                    <div class="countdown-number" id="days">00</div>
                    <div class="countdown-label">Ngày</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-number" id="hours">00</div>
                    <div class="countdown-label">Giờ</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-number" id="minutes">00</div>
                    <div class="countdown-label">Phút</div>
                </div>
                <div class="countdown-unit">
                    <div class="countdown-number" id="seconds">00</div>
                    <div class="countdown-label">Giây</div>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">
                Đếm ngược bắt đầu từ khi đặt vé thành công
            </div>
        </div>
    `;
}

function startCountdown(flightDateStr) {
    const departureDate = new Date(flightDateStr + 'T09:05:00');
    
    function update() {
        const now = new Date();
        const diff = departureDate - now;
        
        if (diff <= 0) {
            // Time's up
            const timerElement = document.querySelector('.countdown-timer');
            if (timerElement) {
                timerElement.innerHTML = '<div style="font-size: 1.5rem;">✈️ Đã đến giờ khởi hành!</div>';
            }
            clearInterval(interval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) {
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            secondsEl.classList.add('blink');
            setTimeout(() => secondsEl.classList.remove('blink'), 500);
        }
    }
    
    update(); // Initial call
    const interval = setInterval(update, 1000);
}

function setupNewsletter(defaultEmail) {
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const emailInput = document.querySelector('.email-input');
    
    if (subscribeBtn && emailInput) {
        if (defaultEmail) {
            emailInput.value = defaultEmail;
        }
        
        subscribeBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                alert('Cảm ơn bạn đã đăng ký! Ưu đãi sẽ được gửi đến: ' + email);
                localStorage.setItem('subscribedEmail', email);
            } else {
                alert('Vui lòng nhập email hợp lệ.');
                emailInput.focus();
            }
        });
        
        // Enter key support
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }
}

function addPrintButton() {
    const ticketHeader = document.querySelector('.ticket-header');
    if (ticketHeader && localStorage.getItem('flightBooking')) {
        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️ In vé';
        printBtn.className = 'btn btn-primary';
        printBtn.style.marginLeft = '10px';
        printBtn.onclick = () => window.print();
        ticketHeader.appendChild(printBtn);
    }
}

// ============ UTILITY FUNCTIONS ============
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    // Check current page and initialize appropriate functions
    const path = window.location.pathname;
    
    if (path.includes('booking.html') || path.includes('index.html')) {
        initBookingPage();
    } else if (path.includes('special-deals.html')) {
        initTicketPage();
    }
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.container') || document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});
});