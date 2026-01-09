import { GENRES_ID_TITLE_MAP, LANGUAGES } from "./constants";

export interface GoogleTokenResult {
  iss?: string;
  nbf?: string;
  aud?: string;
  sub?: string;
  email: string;
  email_verified: string;
  azp?: string;
  name?: string;
  picture?: string;
  given_name: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

export interface JWTUser {
  id: string;
  email: string;
}

export type GenreId = keyof typeof GENRES_ID_TITLE_MAP;

export type Language = typeof LANGUAGES[number];

export type Visibility = "Public" | "Private";
export type Visibilities = Visibility[]