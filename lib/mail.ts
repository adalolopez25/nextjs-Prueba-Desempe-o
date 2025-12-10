// lib/mail.ts
import nodemailer from 'nodemailer';
import { Ticket } from '@/types';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM = process.env.SYSTEM_EMAIL || process.env.EMAIL_FROM || 'helpdeskpro@example.com';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
  }
  return transporter;
}

export async function sendMail(to: string, subject: string, html: string, text?: string) {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({ from: FROM, to, subject, text: text || '', html });
    // @ts-ignore
    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    console.log('Email sent', { to, subject, preview });
    return { ok: true, info, preview };
  } catch (err) {
    console.error('sendMail error', err);
    return { ok: false, error: (err as Error).message };
  }
}

export async function sendMailOnTicketCreate(to: string, ticket: Ticket) {
  const subject = `HelpDeskPro - Ticket creado: ${ticket.title}`;
  const html = `<p>Hola,</p><p>Se creó tu ticket <strong>${ticket.title}</strong> (ID: ${ticket.id}). Pronto un agente lo atenderá.</p>`;
  return sendMail(to, subject, html);
}

export async function sendMailOnTicketComment(to: string, ticket: Ticket, authorName: string, message: string) {
  const subject = `HelpDeskPro - Nuevo comentario en: ${ticket.title}`;
  const html = `<p>Hola,</p><p><strong>${authorName}</strong> comentó en tu ticket <strong>${ticket.title}</strong>:</p><blockquote>${message}</blockquote>`;
  return sendMail(to, subject, html);
}

export async function sendMailOnTicketStatusChange(to: string, ticket: Ticket, status: string) {
  const subject = `HelpDeskPro - Estado actualizado: ${ticket.title} → ${status}`;
  const html = `<p>Hola,</p><p>El estado de tu ticket <strong>${ticket.title}</strong> cambió a <strong>${status}</strong>.</p>`;
  return sendMail(to, subject, html);
}
