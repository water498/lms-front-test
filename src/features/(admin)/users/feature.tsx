"use client";

import { useState } from "react";
import UserTable from "./sections/user-table";
import CreateUserModal from "./modals/create-user-modal";
import ImportUsersModal from "./modals/import-users-modal";

type Modal = "create" | "import" | null;

export default function UsersFeature() {
  const [modal, setModal] = useState<Modal>(null);

  return (
    <>
      <UserTable
        onCreateClick={() => setModal("create")}
        onImportClick={() => setModal("import")}
      />
      {modal === "create" && <CreateUserModal onClose={() => setModal(null)} />}
      {modal === "import" && <ImportUsersModal onClose={() => setModal(null)} />}
    </>
  );
}
