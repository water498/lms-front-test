"use client";

import { useState } from "react";
import CourseTable from "./sections/course-table";
import CreateCourseModal from "./modals/create-course-modal";

export default function CoursesFeature() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <CourseTable onCreateClick={() => setShowModal(true)} />
      {showModal && <CreateCourseModal onClose={() => setShowModal(false)} />}
    </>
  );
}
