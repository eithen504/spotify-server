import { Visibilities } from "./types";

const GENRE_TITLES = [
  "Summer",
  "Love",
  "Mood",
  "Party",
  "Decades",
  "Dance/Electronic",
  "Student",
  "Chill",
  "Workout",
  "Sleep",
  "Instrumental",
  "At Home",
  "Classical",
  "Folk & Acoustic",
  "Focus",
  "Children & Family",
  "Cooking & Dining",
  "Wellness",
  "Travel",
  "Nature & Noise"
] as const;

const GENRES_ID_TITLE_MAP = {
  "3ZJr7yHSWEdqUfnIPpASXo": "Summer",
  "1KLPoBkeHXzq3NaGMyvCYx": "Love",
  "7MqAxb9kT8t2w70zkTqRj5": "Mood",
  "0PLU8u8MyjYbV5uWiRjHte": "Party",
  "6GKJrPQfutE3SmAMv6Vnrn": "Decades",
  "5A9qKLA4R1tQhPnYH1k7vB": "Dance/Electronic",
  "4RqvmyV7Wk3xNCePuFYvRh": "Student",
  "1Cvx9rtfJmZqB32TQHcuvV": "Chill",
  "6FkaUzp9yrx4hqhVp6wS4a": "Workout",
  "4DkfSna2hTbbYTuKe3gMwg": "Sleep",
  "7JZp2b9VcX8F2tMkwe1RyM": "Instrumental",
  "2NKCcdSy8DaCgeuv5ZkWNb": "At Home",
  "7jNQXo7S7HB5zZqRneMx28": "Classical",
  "0xJtDdgA1id36SjaqTlwBt": "Folk & Acoustic",
  "5mK7Zut2Y9kZye8gPNgm7v": "Focus",
  "4r9Gw7mGxHkXybjvxN2I6y": "Children & Family",
  "7iNFAUtQtr2oAc16p6DqCk": "Cooking & Dining",
  "2d0pm4ytxytr5LRZkijPNJ": "Wellness",
  "4Pxr7y2ph4EBZCD5xG7kZJ": "Travel",
  "6Bxqye6sr9FofZy7Jj9eH2": "Nature & Noise"
} as const;

const VISIBILITIES: Visibilities = ["Public", "Private"];

const LANGUAGES = [
    "Arabic",
    "Albanian",
    "Chinese",
    "Czech",
    "Croatian",
    "Dutch",
    "English",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hebrew",
    "Indonesian",
    "Italian",
    "Japanese",
    "Korean",
    "Malay",
    "Norwegian",
    "Persian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Spanish",
    "Swedish",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Vietnamese",
    "Other"
] as const;

export {
  GENRE_TITLES,
  GENRES_ID_TITLE_MAP,
  VISIBILITIES,
  LANGUAGES
}