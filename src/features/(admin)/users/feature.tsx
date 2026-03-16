"use client";

import { useState } from "react";
import UserTable from "./sections/user-table";
import InviteUserModal from "./modals/invite-user-modal";
import CreateInstructorModal from "./modals/create-instructor-modal";
import CreateAdminModal from "./modals/create-admin-modal";
import ImportUsersModal from "./modals/import-users-modal";

type Modal = "invite" | "createInstructor" | "createAdmin" | "import" | null;

export default function UsersFeature() {
  const [modal, setModal] = useState<Modal>(null);

  return (
    <>
      <UserTable
        onInviteClick={() => setModal("invite")}
        onCreateInstructorClick={() => setModal("createInstructor")}
        onCreateAdminClick={() => setModal("createAdmin")}
        onImportClick={() => setModal("import")}
      />
      {modal === "invite" && <InviteUserModal onClose={() => setModal(null)} />}
      {modal === "createInstructor" && <CreateInstructorModal onClose={() => setModal(null)} />}
      {modal === "createAdmin" && <CreateAdminModal onClose={() => setModal(null)} />}
      {modal === "import" && <ImportUsersModal onClose={() => setModal(null)} />}
    </>
  );
}
