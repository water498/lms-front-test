import { create } from "zustand";
import { CertTemplate, IssuedCert, certTemplates, initialIssuedCerts } from "./mockData";

interface CertStore {
  certs: IssuedCert[];
  templates: CertTemplate[];
  revoke: (id: string, reason: string, adminName: string) => void;
  reissue: (id: string) => void;
  updateTemplate: (id: string, patch: Partial<CertTemplate>) => void;
  addTemplate: (t: Omit<CertTemplate, "id">) => void;
  issueCert: (templateId: string, recipient: string, course: string) => void;
}

export const useCertStore = create<CertStore>((set, get) => ({
  certs: initialIssuedCerts,
  templates: certTemplates,

  revoke: (id, reason, adminName) =>
    set((state) => ({
      certs: state.certs.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "REVOKED" as const,
              revokedAt: new Date().toISOString().slice(0, 10),
              revokedReason: reason,
              revokedBy: adminName,
            }
          : c
      ),
    })),

  reissue: (id) =>
    set((state) => ({
      certs: state.certs.map((c) =>
        c.id === id
          ? { ...c, reissuedAt: new Date().toISOString().slice(0, 10) }
          : c
      ),
    })),

  updateTemplate: (id, patch) =>
    set((state) => ({
      templates: state.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  addTemplate: (t) =>
    set((state) => ({
      templates: [
        ...state.templates,
        { ...t, id: `t${Date.now()}` },
      ],
    })),

  issueCert: (templateId, recipient, course) => {
    const template = get().templates.find((t) => t.id === templateId);
    const today = new Date().toISOString().slice(0, 10);
    const seq = String(get().certs.length + 1).padStart(4, "0");
    const year = new Date().getFullYear();
    const certNumber = `CERT-${year}-${seq}`;
    const publicToken = Date.now().toString(16);

    let expiredAt: string | null = null;
    if (template?.validityYears) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + template.validityYears);
      expiredAt = expiry.toISOString().slice(0, 10);
    }

    const newCert: IssuedCert = {
      id: `ic${Date.now()}`,
      certNumber,
      publicToken,
      recipient,
      course,
      templateId,
      status: "VALID",
      issuedAt: today,
      expiredAt,
      reissuedAt: null,
      revokedAt: null,
      revokedReason: null,
      revokedBy: null,
    };

    set((state) => ({ certs: [newCert, ...state.certs] }));
  },
}));
