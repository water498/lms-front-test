"use client";

import { useState } from "react";
import MediaGrid from "./sections/media-grid";
import UploadModal from "./sections/upload-modal";

export default function MediaFeature() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <MediaGrid onUploadClick={() => setShowUpload(true)} />
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
