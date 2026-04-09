export const CERT_W = 794;
export const CERT_H = 1123;

export const SAMPLE: Record<string, string> = {
  recipientName: "홍길동",
  courseName: "안전보건관리체계와 10대 필수 안전수칙 이해",
  orgName: "롯데건설",
  certNumber: "CERT-2025-001",
  issuedDate: "2025-03-16",
  expiryDate: "2027-03-16",
  completionDate: "2025-03-15",
};

export function buildSrcDoc(html: string, bgUrl: string | null): string {
  const substituted = html.replace(/\{\{(\w+)\}\}/g, (_, k) => SAMPLE[k] ?? `{{${k}}}`);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{width:${CERT_W}px;height:${CERT_H}px;overflow:hidden;position:relative;background:#fff}
    .bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0}
    .content{position:relative;z-index:1;width:100%;height:100%}
  </style></head><body>
    ${bgUrl ? `<img class="bg" src="${bgUrl}"/>` : ""}
    <div class="content">${substituted}</div>
  </body></html>`;
}
