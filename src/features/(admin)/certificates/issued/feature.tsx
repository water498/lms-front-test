"use client";

import IssuedTable from "../sections/issued-table";

export default function CertificatesIssuedFeature() {
  return (
    <div className="flex flex-col gap-5">
      <IssuedTable />
    </div>
  );
}
