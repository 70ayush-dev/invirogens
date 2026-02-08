import nodemailer from "nodemailer";
import type { InsertContact } from "@shared/schema";

const inquiryRecipient = process.env.INQUIRY_TO_EMAIL || "70ayush@gmail.com";
const formSubmitEmail = process.env.FORMSUBMIT_EMAIL || inquiryRecipient;
const web3FormsAccessKey = process.env.WEB3FORMS_ACCESS_KEY;

function getTransporter() {
  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !portRaw) {
    return null;
  }

  const port = Number.parseInt(portRaw, 10);
  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendContactInquiry(payload: InsertContact): Promise<void> {
  const transporter = getTransporter();

  if (transporter) {
    const subject = `[INVIROGENS Inquiry] ${payload.subject}`;
    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Company: ${payload.company || "N/A"}`,
      `Subject: ${payload.subject}`,
      "",
      "Message:",
      payload.message,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>New Inquiry Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(payload.company || "N/A")}</p>
        <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "INVIROGENS Inquiry <no-reply@invirogens.site>",
      to: inquiryRecipient,
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    return;
  }

  // SMTP-free primary relay using Web3Forms if key is configured.
  if (web3FormsAccessKey) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        subject: `[INVIROGENS Inquiry] ${payload.subject}`,
        from_name: payload.name,
        email: payload.email,
        company: payload.company || "N/A",
        message: payload.message,
        to_email: inquiryRecipient,
      }),
    });

    if (response.ok) {
      return;
    }

    const body = await response.text().catch(() => "");
    throw new Error(`Web3Forms relay failed: ${response.status} ${body}`);
  }

  // SMTP-free fallback using FormSubmit relay.
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `[INVIROGENS Inquiry] ${payload.subject}`,
      _captcha: "false",
      name: payload.name,
      email: payload.email,
      company: payload.company || "N/A",
      subject: payload.subject,
      message: payload.message,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Form relay failed: ${response.status} ${body}`);
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
