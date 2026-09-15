export type GoApiUser = {
  username: string;
  displayName: string;
};

export type GoApiPost = {
  id: number;
  user: GoApiUser;
  content: string;
  postedOn: string;
  createdAt: string;
};

export type GoApiMeta = {
  api: {
    name: string;
    language: string;
    category: string;
  };
  count: number;
};

export type GoApiPostsResponse = {
  meta: GoApiMeta;
  data: {
    posts: GoApiPost[];
  };
};
