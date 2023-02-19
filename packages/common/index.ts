export * from "./clientBase";
export interface Email {
  to: string;
  subject: string;
  text: string;
  html: string;
}
