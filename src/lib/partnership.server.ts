export type PartnershipRequestInput = {
  fullName: string;
  email: string;
  message: string;
  locale: "en" | "pt";
};

const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const SHEETS_GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export async function savePartnershipRequest(input: PartnershipRequestInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("partnership_requests")
    .insert({
      full_name: input.fullName,
      email: input.email,
      message: input.message,
      locale: input.locale,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

function createRawEmail(to: string, replyTo: string, subject: string, body: string) {
  const email = [
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${header(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");
  return b64(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Emails the request from the connected Gmail account. */
async function emailPartnershipRequest(input: PartnershipRequestInput) {
  const to = process.env["PARTNERSHIP_NOTIFY_EMAIL"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];

  if (!to || !lovableKey || !gmailKey) {
    throw new Error("Gmail notification is not configured");
  }

  const raw = createRawEmail(
    to,
    input.email,
    `Long-term consultancy request — ${input.fullName}`,
    [
      `Name: ${input.fullName}`,
      `Email: ${input.email}`,
      `Language: ${input.locale}`,
      "",
      input.message,
    ].join("\n"),
  );

  const res = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gmail send failed [${res.status}]: ${body}`);
  }
}

/** Appends the request as a new row in the Google Sheet. */
async function logPartnershipRequestToSheet(requestId: string, input: PartnershipRequestInput) {
  const sheetId = process.env["PARTNERSHIP_SHEET_ID"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];

  if (!sheetId || !lovableKey || !sheetsKey) {
    throw new Error("Google Sheets logging is not configured");
  }

  const res = await fetch(
    `${SHEETS_GATEWAY}/spreadsheets/${sheetId}/values/Requests!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            new Date().toISOString(),
            input.fullName,
            input.email,
            input.locale,
            input.message,
            requestId,
          ],
        ],
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets append failed [${res.status}]: ${body}`);
  }
}

/**
 * Notifies about a new partnership request: emails it from the connected Gmail
 * account and appends it to the Google Sheet. Returns which channels succeeded.
 */
export async function notifyPartnershipRequest(
  requestId: string,
  input: PartnershipRequestInput,
) {
  const [emailResult, sheetResult] = await Promise.allSettled([
    emailPartnershipRequest(input),
    logPartnershipRequestToSheet(requestId, input),
  ]);

  const emailed = emailResult.status === "fulfilled";
  const logged = sheetResult.status === "fulfilled";

  if (!emailed) console.error(`[partnership] ${requestId} email failed:`, emailResult.reason);
  if (!logged) console.error(`[partnership] ${requestId} sheet failed:`, sheetResult.reason);

  if (emailed) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("partnership_requests")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", requestId);
  }

  return { emailed, logged };
}
