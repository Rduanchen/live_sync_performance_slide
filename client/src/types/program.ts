export type Member = {
  name?: string;
  role?: string;
  imgUrl?: string;
  ig?: string;
}

export type ProgramSlide = {
  id: string;
  type: 'cover' | 'schedule' | 'performance' | 'message' | 'sponsors' | 'feedback';
  title: string;
  slideURL?: string;
  groupName?: string;
  message?: string;
  members?: Member[];
  sponsors?: string[];
  feedbackURL?: string;
}
