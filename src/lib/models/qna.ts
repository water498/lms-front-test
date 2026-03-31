// Domain: qna — 과정 Q&A, 게시판

export interface CourseQnA {
  id: string;
  courseSessionId: string;  // FK → CourseSession
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
  postId: string;
  instructorId: string;
  instructorName: string; // UI 전용 스냅샷
  body: string;
  createdAt: string;
}

export interface QnaPost {
  id: string;
  courseSessionId: string;
  learnerId: string;
  learnerName: string; // UI 전용 스냅샷
  title: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
  replies: QnaReply[];
}
