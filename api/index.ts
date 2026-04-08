import { createApp } from "../server/_core";

export default async function handler(req: any, res: any) {
  const { app } = await createApp();
  return app(req, res);
}
