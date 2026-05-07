import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта на почту мастерской media@christmasapple.com"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')

    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    order_type = body.get('type', 'Стандарт')
    size = body.get('size', '')
    color = body.get('color', '')
    notes = body.get('notes', '')

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    to_email = 'media@christmasapple.com'

    email_row = f'<tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;color:#2a1a0e;">{email}</td></tr>' if email else ''
    color_row = f'<tr><td style="padding:8px 0;color:#666;font-size:13px;">Палитра</td><td style="padding:8px 0;color:#2a1a0e;">{color}</td></tr>' if color else ''
    notes_row = f'<tr><td style="padding:8px 0;color:#666;font-size:13px;vertical-align:top;">Пожелания</td><td style="padding:8px 0;color:#2a1a0e;">{notes.replace(chr(10), "<br>")}</td></tr>' if notes else ''

    html_body = f"""<html>
<body style="font-family:Georgia,serif;background:#f5ede0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:2px solid #e8d9c4;padding:32px;">
    <h2 style="color:#8b1a1a;font-size:24px;margin-bottom:8px;">🍎 Новая заявка на игрушку</h2>
    <p style="color:#888;font-size:13px;margin-bottom:24px;">Мастерская «Рождественское Яблоко»</p>
    <hr style="border:1px solid #e8d9c4;margin-bottom:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#666;font-size:13px;width:140px;">Имя</td><td style="padding:8px 0;color:#2a1a0e;font-weight:bold;">{name}</td></tr>
      <tr><td style="padding:8px 0;color:#666;font-size:13px;">Телефон</td><td style="padding:8px 0;color:#2a1a0e;font-weight:bold;">{phone}</td></tr>
      {email_row}
      <tr><td style="padding:8px 0;color:#666;font-size:13px;">Тип заказа</td><td style="padding:8px 0;color:#2a1a0e;">{order_type}</td></tr>
      <tr><td style="padding:8px 0;color:#666;font-size:13px;">Размер</td><td style="padding:8px 0;color:#2a1a0e;">{size}</td></tr>
      {color_row}
      {notes_row}
    </table>
    <hr style="border:1px solid #e8d9c4;margin-top:24px;margin-bottom:16px;">
    <p style="color:#aaa;font-size:11px;text-align:center;">Письмо отправлено автоматически с сайта</p>
  </div>
</body>
</html>"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка от {name} — Рождественское Яблоко'
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
