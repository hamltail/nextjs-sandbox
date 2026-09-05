export type HaskellApiUser = {
  username: string;
  displayName: string;
};

export type HaskellApiPost = {
  id: number;
  user: HaskellApiUser;
  content: string;
  postedOn: string;
  createdAt: string;
};

export type HaskellApiMeta = {
  api: {
    name: string;
    language: string;
    category: string;
  };
  count: number;
};

export type HaskellApiPostsResponse = {
  meta: HaskellApiMeta;
  data: {
    posts: HaskellApiPost[];
  };
};
