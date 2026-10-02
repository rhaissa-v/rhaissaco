import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitPartnershipRequest = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(200),
        message: z.string().trim().min(10).max(2000),
        locale: z.enum(["en", "pt"]).default("en"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { savePartnershipRequest, notifyPartnershipRequest } = await import(
      "@/lib/partnership.server"
    );

    const row = await savePartnershipRequest(data);

    // The request is persisted at this point, so notification problems must not
    // fail the submission — they are logged server-side and reported as flags.
    let emailed = false;
    let logged = false;
    try {
      ({ emailed, logged } = await notifyPartnershipRequest(row.id, data));
    } catch (err) {
      console.error(`[partnership] ${row.id} notification pipeline failed:`, err);
    }

    if (!emailed && !logged) {
      console.error(
        `[partnership] ${row.id} stored but no notification channel delivered; check Gmail/Sheets configuration`,
      );
    }

    return { ok: true as const, emailed, logged };
  });
