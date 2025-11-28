import { getTranslation } from "@i18n/utils";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Locale } from "@i18n/utils";

const suscribeToBlog = defineAction({
  input: z.object({
    email: z.string().email(),
    locale: z.custom<Locale>(),
  }),
  accept: "form",
  handler: async ({ email, locale }) => {
    const t = getTranslation(locale, "footer").toaster;

    const token = import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        success: false,
        data: {
          title: t.unexpected.title,
          message: t.unexpected.message,
        },
      };
    }

    const text = `🚀Nuevo registro al Blog del Portafolio:\n📧Email: ${email}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
        },
      );

      if (!response.ok) {
        return {
          success: false,
          data: {
            title: t.telegramFail.title,
            message: t.telegramFail.message,
          },
        };
      }

      return {
        success: true,
        data: {
          title: t.success.title,
          message: t.success.message,
        },
      };
    } catch (err) {
      return {
        success: false,
        data: {
          title: t.unexpected.title,
          message: t.unexpected.message,
        },
      };
    }
  },
});

export const sendMessage = defineAction({
  input: z.object({
    name: z.string().trim().min(3),
    email: z.string().email(),
    message: z.string().trim().min(15),
    locale: z.custom<Locale>(),
  }),
  accept: "form",
  handler: async ({ name, email, message, locale }) => {
    const { success, unexpected, telegramFail } = getTranslation(
      locale,
      "contact",
    ).form.toaster;
    const token = import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        success: false,
        data: {
          title: unexpected.title,
          message: unexpected.message,
        },
      };
    }

    const text = `
        🚀 Nuevo mensage de contacto al portafolio de desarrollador\n
        👤 Nombre: ${name}\n
        📧 Email: ${email}\n
        💬 Mensaje: ${message}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        },
      );
      if (!response.ok) {
        return {
          success: false,
          data: {
            title: telegramFail.title,
            message: telegramFail.message,
          },
        };
      }

      return {
        success: true,
        data: {
          title: success.title,
          message: success.message,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          title: unexpected.title,
          message: unexpected.message,
        },
      };
    }
  },
});

export const server = {
  suscribeToBlog,
  sendMessage,
};
