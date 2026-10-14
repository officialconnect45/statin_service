import { getAdminSession } from "@/lib/admin/auth";
import { getLeads, LeadsUnavailableError, optionLabel, type Lead } from "@/lib/leads";

// Neutralise spreadsheet formulas (CSV injection) and quote every cell.
function cell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getAdminSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  let leads: Lead[];
  try {
    leads = await getLeads();
  } catch (error) {
    if (error instanceof LeadsUnavailableError) {
      return new Response(error.message, { status: 502 });
    }
    throw error;
  }
  const header = ["Submitted", "Name", "Email", "Company", "Practice", "Stage", "Timing", "Message"];
  const lines = [
    header.map(cell).join(","),
    ...leads.map((lead) =>
      [
        lead.at,
        lead.name,
        lead.email,
        lead.company,
        optionLabel(lead.practice),
        optionLabel(lead.stage),
        optionLabel(lead.timeline),
        lead.message,
      ]
        .map(cell)
        .join(","),
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  // Leading byte-order mark so Excel opens the UTF-8 file correctly.
  const body = String.fromCharCode(0xfeff) + lines.join(String.fromCharCode(13, 10));
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="statin-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
