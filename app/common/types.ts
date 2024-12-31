export type IUserInfo =
  | {
      id: number;
      name: string;
      email: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
    }
  | undefined;

export type IBookItem = {
  id: number;
  slug: string;
  cover: string;
  name: string;
  wordsCount: number;
};
