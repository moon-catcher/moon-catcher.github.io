export type Article = {
  title: string;
  sha?: string;
  remote: boolean;
  warning?: string;
};

export type ArticleSaveResponse = {
  status: number;
  url: string;
  headers: {
    [header: string]: string;
  };
  data: {
    content: {
      name: string;
      path: string;
      sha: string;
      size: number;
      url: string;
      html_url: string;
      git_url: string;
      download_url: string;
      type: string;
      _links: {
        self: string;
        git: string;
        html: string;
      };
    };
    commit: {
      sha: string;
      node_id: string;
      url: string;
      html_url: string;
      author: {
        name: string;
        email: string;
        date: string;
      };
      committer: {
        name: string;
        email: string;
        date: string;
      };
      tree: {
        sha: string;
        url: string;
      };
      message: string;
      parents: [
        {
          sha: string;
          url: string;
          html_url: string;
        }
      ];
      verification: {
        verified: boolean;
        reason: string;
        signature: unknown;
        payload: unknown;
      };
    };
  };
};
