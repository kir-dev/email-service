export * from "./clientBase";
export * from "./validateRequest";
import { Static, Type } from "@sinclair/typebox";

export const Email = Type.Object({
  subject: Type.String(),
  to: Type.String(),
  from: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
  html: Type.Optional(Type.String()),
});

export type Email = Static<typeof Email>;
