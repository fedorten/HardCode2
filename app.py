from flask import Flask, render_template, request, flash, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY", "your-secret-key-here-change-in-production"
)

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "your-telegram-bot-token")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "your-telegram-chat-id")


# Helper functions
def get_level_text(level):
    levels = {
        "beginner": "Полный новичок",
        "basic": "Есть базовые знания",
        "intermediate": "Уже писал код",
        "advanced": "Опытный разработчик",
    }
    return levels.get(level, level)


def get_goal_text(goal):
    goals = {
        "career_change": "Смена карьеры и переход в IT",
        "first_job": "Найти первую работу в IT",
        "salary_growth": "Увеличить текущую зарплату",
        "skills_upgrade": "Повысить навыки для роста",
        "freelance": "Начать фриланс-карьеру",
        "startup": "Создать свой проект/стартап",
    }
    return goals.get(goal, goal)


def get_current_time():
    return datetime.now().strftime("%d.%m.%Y %H:%M")


class RegistrationForm(FlaskForm):
    name = StringField("Имя", validators=[DataRequired(), Length(min=2, max=50)])
    telegram = StringField(
        "Telegram username", validators=[DataRequired(), Length(min=2, max=50)]
    )
    level = SelectField(
        "Ваш уровень",
        choices=[
            ("beginner", "Полный новичок"),
            ("basic", "Есть базовые знания"),
            ("intermediate", "Уже писал код"),
            ("advanced", "Опытный разработчик"),
        ],
        validators=[DataRequired()],
    )
    goal = SelectField(
        "Ваша цель",
        choices=[
            ("career_change", "Смена карьеры и переход в IT"),
            ("first_job", "Найти первую работу в IT"),
            ("salary_growth", "Увеличить текущую зарплату"),
            ("skills_upgrade", "Повысить навыки для роста"),
            ("freelance", "Начать фриланс-карьеру"),
            ("startup", "Создать свой проект/стартап"),
        ],
        validators=[DataRequired()],
    )
    submit = SubmitField("Отправить заявку")


class ContactForm(FlaskForm):
    name = StringField("Имя", validators=[DataRequired(), Length(min=2, max=50)])
    email = StringField("Email", validators=[DataRequired(), Length(min=5, max=120)])
    phone = StringField("Телефон", validators=[Length(max=20)])
    subject = StringField("Тема", validators=[DataRequired(), Length(min=2, max=100)])
    message = TextAreaField(
        "Сообщение", validators=[DataRequired(), Length(min=10, max=1000)]
    )
    submit = SubmitField("Отправить сообщение")


@app.route("/")
def index():
    form = RegistrationForm()
    video_embed_url = os.environ.get("VIDEO_EMBED_URL", "").strip()
    return render_template("index.html", form=form, video_embed_url=video_embed_url)


@app.route("/prices")
def prices():
    return render_template("prices.html")


@app.route("/courses")
def courses():
    form = RegistrationForm()
    return render_template("courses.html", form=form)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/faq")
def faq():
    return render_template("faq.html")


@app.route("/offer")
def offer():
    return render_template("offer.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        # Сохранение данных контакта
        contact_data = {
            "name": form.name.data,
            "email": form.email.data,
            "phone": form.phone.data,
            "subject": form.subject.data,
            "message": form.message.data,
        }

        # Отправка в Telegram
        try:
            message = f"📬 **НОВОЕ СООБЩЕНИЕ С КОНТАКТНОЙ ФОРМЫ** 📬\n\n"
            message += f"👤 *Имя:* {contact_data['name']}\n"
            message += f"📧 *Email:* {contact_data['email']}\n"
            message += f"📱 *Телефон:* {contact_data['phone']}\n"
            message += f"📋 *Тема:* {contact_data['subject']}\n"
            message += f"💬 *Сообщение:* {contact_data['message']}\n\n"
            message += f"⏰ *Время:* {get_current_time()}"

            telegram_url = (
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            )
            telegram_data = {
                "chat_id": TELEGRAM_CHAT_ID,
                "text": message,
                "parse_mode": "Markdown",
            }

            response = requests.post(telegram_url, json=telegram_data, timeout=10)

        except Exception as e:
            print(f"❌ Исключение при отправке контакта в Telegram: {str(e)}")

        # Вывод в консоль для отладки
        print(f"Новое контактное сообщение: {contact_data}")

        flash(
            f"Спасибо, {form.name.data}! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время."
        )
        return redirect(url_for("contact"))

    return render_template("contact.html", form=form)


@app.route("/register", methods=["POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Сохранение данных (можно добавить базу данных)
        registration_data = {
            "name": form.name.data,
            "telegram": form.telegram.data,
            "level": form.level.data,
            "goal": form.goal.data,
        }

        # Здесь можно добавить сохранение в БД или отправку email
        # Например: db.save_registration(registration_data)

        # Отправка в Telegram
        try:
            message = f"🔥 **НОВАЯ ЗАЯВКА НА КУРС** 🔥\n\n"
            message += f"👤 *Имя:* {registration_data['name']}\n"
            message += f"📱 *Telegram:* {registration_data['telegram']}\n"
            message += f"📊 *Уровень:* {get_level_text(registration_data['level'])}\n"
            message += f"🎯 *Цель:* {get_goal_text(registration_data['goal'])}\n\n"
            message += f"⏰ *Время:* {get_current_time()}"

            telegram_url = (
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            )
            telegram_data = {
                "chat_id": TELEGRAM_CHAT_ID,
                "text": message,
                "parse_mode": "Markdown",
            }

            response = requests.post(telegram_url, json=telegram_data, timeout=10)

        except Exception as e:
            print(f"❌ Исключение при отправке в Telegram: {str(e)}")

        # Вывод в консоль для отладки
        print(f"Новая регистрация: {registration_data}")

        flash(
            f"Спасибо, {form.name.data}! Ваша заявка принята. Мы свяжемся с вами в Telegram: {form.telegram.data}"
        )
        return redirect(url_for("index"))

    # Если форма не валидна, возвращаемся на главную с ошибками
    for field, errors in form.errors.items():
        for error in errors:
            flash(f"Ошибка в поле {getattr(form, field).label.text}: {error}")

    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
