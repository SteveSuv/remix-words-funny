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
