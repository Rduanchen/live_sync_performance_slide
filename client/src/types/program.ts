export type Member = {
  name: string;
  imgUrl: string;
  ig: string;
}

export type ProgramSlide = {
  id: string;
  type: 'performance' | 'message';
  title: string;
  slideURL?: string;
  groupName?: string;
  message: string;
  members?: Member[];
}
