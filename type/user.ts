export type UserInfo = {
  [props: string]: unknown;
  name?: string;
  dashboard?: number[];
};

export type AccessToken = {
  token: string;
  authkey: string;
  token_type: string;
  scope: string;
  error?: Error;
};
