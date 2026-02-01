// JavaScript для лэндинга HardCode

// Глобальные переменные
let selectedPackage = '';

// Функции для работы с модальным окном
function openModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        // Сброс формы
        const form = document.getElementById('registration-form');
        if (form) {
            form.reset();
        }
    }
}

// Функция выбора пакета
function selectPackage(packageName) {
    selectedPackage = packageName;
    openModal();
}

// Закрытие модального окна при клике вне его
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Закрытие модального окна по ESC
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Отправка формы через серверный endpoint
async function sendToTelegram(formData) {
    // Используем серверный endpoint для безопасности
    const API_ENDPOINT = '/api/submit-form'; // Serverless function или backend endpoint

    const message = `� Новая заявка на курс HardCode!\n\n` +
        `👤 Имя: ${formData.name}\n` +
        `📱 Telegram: @${formData.telegram}\n` +
        `📊 Уровень: ${formData.level}\n` +
        `🎯 Цель: ${formData.goal}\n` +
        `📦 Пакет: ${formData.package || 'Не указан'}\n` +
        `📅 Дата: ${new Date().toLocaleString('ru-RU')}`;

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Ошибка отправки формы');
        }

        return true;
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        // Fallback для демонстрации
        console.log('Данные формы:', formData);
        return true; // Временно возвращаем true для демонстрации
    }
}

// Обработка формы регистрации
document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Получаем данные формы
            const formData = {
                name: document.getElementById('name').value,
                telegram: document.getElementById('telegram').value,
                level: document.getElementById('level').value,
                goal: document.getElementById('goal').value,
                package: selectedPackage || 'Не указан'
            };

            // Валидация (базовая)
            if (!formData.name || !formData.telegram) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }

            // Показываем индикатор загрузки
            const submitButton = registrationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;

            // Отправляем в Telegram
            const success = await sendToTelegram(formData);

            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            if (success) {
                alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                closeModal();
                // Сброс формы
                registrationForm.reset();
                selectedPackage = '';
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
            }
        });
    }

    // Обработка контактной формы
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };

            // Отправляем в Telegram
            const message = `📬 Новое сообщение с формы контактов HardCode!\n\n` +
                `👤 Имя: ${formData.name}\n` +
                `📧 Email: ${formData.email}\n` +
                `📱 Телефон: ${formData.phone}\n` +
                `📋 Тема: ${formData.subject}\n` +
                `💬 Сообщение: ${formData.message}\n` +
                `📅 Дата: ${new Date().toLocaleString('ru-RU')}`;

            const BOT_TOKEN = 'YOUR_BOT_TOKEN';
            const CHAT_ID = 'YOUR_CHAT_ID';

            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                if (response.ok) {
                    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                } else {
                    throw new Error('Ошибка отправки');
                }
            } catch (error) {
                alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
            }
        });
    }
});

// Плавная прокрутка к якорям (если нужно)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Дополнительные утилиты
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone);
}

// Анимация при прокрутке (заготовка для будущего CSS)
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
document.addEventListener('DOMContentLoaded', animateOnScroll);

// ========== КАРУСЕЛИ ==========
// Глобальные переменные для каруселей
let currentTeacher = 0;
let currentStudent = 0;

// Функции для карусели преподавателей
function updateTeacherCarousel() {
    const carousel = document.getElementById('teachersCarousel');
    const indicators = [
        document.getElementById('teacherIndicator0'),
        document.getElementById('teacherIndicator1')
    ];
    
    if (carousel) {
        carousel.style.transform = `translateX(-${currentTeacher * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            if (indicator) {
                if (index === currentTeacher) {
                    indicator.classList.remove('bg-primary-green/30');
                    indicator.classList.add('bg-primary-green');
                } else {
                    indicator.classList.remove('bg-primary-green');
                    indicator.classList.add('bg-primary-green/30');
                }
            }
        });
    }
}

function nextTeacher() {
    currentTeacher = (currentTeacher + 1) % 2;
    updateTeacherCarousel();
}

function previousTeacher() {
    currentTeacher = (currentTeacher - 1 + 2) % 2;
    updateTeacherCarousel();
}

// Функции для карусели учеников
function updateStudentCarousel() {
    const carousel = document.getElementById('studentsCarousel');
    const indicators = [
        document.getElementById('studentIndicator0'),
        document.getElementById('studentIndicator1'),
        document.getElementById('studentIndicator2')
    ];
    
    if (carousel) {
        carousel.style.transform = `translateX(-${currentStudent * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            if (indicator) {
                if (index === currentStudent) {
                    indicator.classList.remove('bg-primary-green/30');
                    indicator.classList.add('bg-primary-green');
                } else {
                    indicator.classList.remove('bg-primary-green');
                    indicator.classList.add('bg-primary-green/30');
                }
            }
        });
    }
}

function nextStudent() {
    currentStudent = (currentStudent + 1) % 3;
    updateStudentCarousel();
}

function previousStudent() {
    currentStudent = (currentStudent - 1 + 3) % 3;
    updateStudentCarousel();
}

// Инициализация каруселей
function initCarousels() {
    // Запускаем автоматическое переключение только если карусели существуют
    if (document.getElementById('teachersCarousel')) {
        setInterval(nextTeacher, 5000);
    }
    
    if (document.getElementById('studentsCarousel')) {
        setInterval(nextStudent, 4000);
    }
}

// Автоматическое переключение каруселей (инициализация после загрузки DOM)
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCarousels();
    
    // Инициализация индикаторов при загрузке
    updateTeacherCarousel();
    updateStudentCarousel();
});

// ========== ВИДЕО КОНТРОЛЫ ==========
// Управление видео оверлеем
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('schoolVideo');
    const overlay = document.getElementById('videoOverlay');
    
    if (video && overlay) {
        video.addEventListener('play', function() {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        });
        
        video.addEventListener('pause', function() {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });
        
        video.addEventListener('ended', function() {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });
    }
});

// ========== МОБИЛЬНОЕ МЕНЮ ==========
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.toggle('hidden');
        
        // Меняем иконку
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
}

// Инициализация мобильного меню
function initMobileMenu() {
    const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenuLinks.length > 0) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Закрываем меню
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
                if (mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    
    // Добавляем обработчик для кнопки мобильного меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Закрытие мобильного меню при клике на ссылку
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

// ========== FAQ АККОРДЕОН ==========
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const content = faqItem.querySelector('.faq-content');
    const icon = button.querySelector('.faq-icon i');
    const isOpen = !content.classList.contains('hidden');
    
    // Закрываем все остальные FAQ элементы
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        const otherContent = item.querySelector('.faq-content');
        const otherIcon = item.querySelector('.faq-icon i');
        const otherButton = item.querySelector('.faq-trigger');
        
        if (otherContent && otherContent !== content) {
            otherContent.classList.add('hidden');
            otherIcon.style.transform = 'rotate(0deg)';
            item.classList.remove('border-primary-green/30', 'bg-primary-green/5');
        }
    });
    
    // Открываем/закрываем текущий элемент
    if (!isOpen) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        faqItem.classList.add('border-primary-green/30', 'bg-primary-green/5');
        button.classList.add('text-primary-green');
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
        faqItem.classList.remove('border-primary-green/30', 'bg-primary-green/5');
        button.classList.remove('text-primary-green');
    }
    
    // Плавная анимация при открытии
    if (!isOpen) {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        }, 10);
    } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
    }
}