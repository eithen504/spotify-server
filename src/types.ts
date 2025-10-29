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

export type Genre =
  | "Party"
  | "Chill"
  | "Summer"
  | "Love"
  | "Emotional & HeartBreaking"
  | "Road Trip"
  | "Sleep"
  | "Strees Relief"
  | "Instrumental"
  | "Happy"
  | "workout"
  | "Focus"
  | "Dance"
  | "Cooking"
  | "Travel"
  | "Rain & Monsoon"
  | "Lofi"
  | "Nature & Noise";

export type Genres = Genre[];

export type GenresIdTitleMap = Record<string, Genre>;

export type Visibility = "Public" | "Private";
export type Visibilities = Visibility[]