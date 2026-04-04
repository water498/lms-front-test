// Domain: qna — 과정 Q&A, 게시판

// [UI-only composite] backend에 별도 테이블 없음. 프론트엔드 편의 타입
export interface CourseQnA {
  id: string;
  courseSessionId: string;
  activityId?: string;      // FK → CourseActivity (특정 영상/퀴즈에 대한 질문)
  authorId: string;         // FK → User (수강생)
  parentId?: string;        // FK → CourseQnA (답글)
  body: string;
  isAnswered: boolean;
  isPinned: boolean;        // 강사 고정 Q&A
  createdAt: string;
}

export interface QnaReply {
  id: string;
  postId: string;           // FK → QnaPost. CASCADE
  instructorId?: string;    // FK → User. SET NULL (강사 삭제 시 답변 보존)
  instructorName: string;   // 스냅샷. 강사 삭제 후에도 표시용
  body: string;
  createdAt: string;
}

export interface QnaPost {
  id: string;
  courseSessionId: string;
  learnerId: string;
  learnerName: string; // [UI-only] 스냅샷
  title: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
  replies: QnaReply[]; // [UI convenience] JOIN 결과
}
