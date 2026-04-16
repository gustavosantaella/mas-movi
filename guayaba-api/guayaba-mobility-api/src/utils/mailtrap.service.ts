import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

interface SendMailOptions {
  to: string;
  subject: string;
  templateName: string;
  variables: Record<string, string>;
}

@Injectable()
export class MailtrapService {
  private readonly logger = new Logger(MailtrapService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly inboxId: string;
  private readonly appName: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MAILTRAP_API_KEY') ?? '';
    this.apiUrl = this.configService.get<string>('MAILTRAP_API_URL') ?? 'send.api.mailtrap.io';
    this.inboxId = this.configService.get<string>('MAILTRAP_INBOX_ID') ?? '';
    this.appName = this.configService.get<string>('APP_NAME') ?? 'Guayaba';
    this.fromEmail = this.configService.get<string>('MAILTRAP_FROM') ?? 'no-reply@guayaba.com';

    if (!this.apiKey) {
      this.logger.warn('MAILTRAP_API_KEY is not configured. Emails will not be sent.');
    }
  }

  /**
   * Loads an HTML template from /templates/mail/ and replaces {{PLACEHOLDERS}}.
   */
  private loadTemplate(templateName: string, variables: Record<string, string>): string {
    const templatePath = path.resolve(
      process.cwd(),
      'templates',
      'mail',
      `${templateName}.html`,
    );

    let html = fs.readFileSync(templatePath, 'utf-8');

    // Always inject APP_NAME
    variables['APP_NAME'] = variables['APP_NAME'] ?? this.appName;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    }

    return html;
  }

  /**
   * Sends an email using the Mailtrap Sending API.
   */
  async sendMail(options: SendMailOptions): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn(`Skipping email to ${options.to} — no API key configured.`);
      return;
    }

    const html = this.loadTemplate(options.templateName, options.variables);

    // Read logo for inline attachment
    const logoPath = path.resolve(process.cwd(), 'assets', 'img', 'guayaba-logo.png');
    let attachments: any[] = [];

    if (fs.existsSync(logoPath)) {
      const logoBase64 = fs.readFileSync(logoPath).toString('base64');
      attachments = [
        {
          filename: 'guayaba-logo.png',
          content: logoBase64,
          type: 'image/png',
          disposition: 'inline',
          content_id: 'guayaba-logo',
        },
      ];
    }

    const body = {
      from: {
        email: this.fromEmail,
        name: this.appName,
      },
      to: [{ email: options.to }],
      subject: options.subject,
      html,
      attachments,
    };

    try {
      const sendUrl = this.inboxId
        ? `https://${this.apiUrl}/api/send/${this.inboxId}`
        : `https://${this.apiUrl}/api/send`;

      const response = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Mailtrap error [${response.status}]: ${errorBody}`);
      } else {
        this.logger.log(`Email sent to ${options.to} — subject: "${options.subject}"`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
    }
  }

  /**
   * Sends the welcome/registration email with a confirmation link.
   */
  async sendRegistrationEmail(
    to: string,
    firstName: string,
    role: string,
    confirmUrl: string,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: `Confirma tu correo — ${this.appName}`,
      templateName: 'register',
      variables: {
        FIRST_NAME: firstName || 'Usuario',
        ROLE: role,
        CONFIRM_URL: confirmUrl,
      },
    });
  }

  /**
   * Sends a password reset email with a link.
   */
  async sendResetPasswordEmail(to: string, resetUrl: string): Promise<void> {
    await this.sendMail({
      to,
      subject: `Restablecer contraseña — ${this.appName}`,
      templateName: 'reset-password',
      variables: {
        RESET_URL: resetUrl,
      },
    });
  }
}
