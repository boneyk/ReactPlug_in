export type LoginDTO = {
  username: string;
  password: string;
};

export interface AuthDto {
  accessToken: string;
  refreshToken: string;
}
