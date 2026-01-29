// JavaScript для лэндинга HardCode

// Глобальные переменные
let selectedPackage = '';

// Функции для работы с модальным окном
function openModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
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
    const packageInput = document.getElementById('package');
    if (packageInput) {
        packageInput.value = packageName;
    }
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
    }[j]
});

// Отправка формы в Telegram
async function sendToTelegram(formData) {
    // Получаем токен и chat_id из .env файла или используем заглушки
    // В реальном проекте эти данные должны быть на сервере
    const BOT_TOKEN = '8078109443:AAHtuHwDwLab_DB4D68G14porbVoMRR6YtE'; // Замените на реальный токен
    const CHAT_ID = '783223961'; // Замените на реальный chat_id

    const message = `� Новая заявка на курс HardCode!\n\n` +
        `👤 Имя: ${formData.name}\n` +
        `📱 Telegram: @${formData.telegram}\n` +
        `📊 Уровень: ${formData.level}\n` +
        `🎯 Цель: ${formData.goal}\n` +
        `📦 Пакет: ${formData.package || 'Не указан'}\n` +
        `📅 Дата: ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
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

        if (!response.ok) {
            throw new Error('Ошибка отправки в Telegram');
        }

        return true;
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        return false;
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
                package: document.getElementById('package')?.value || selectedPackage
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