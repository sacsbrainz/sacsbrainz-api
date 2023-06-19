import { Request, Response } from "express";

export const healthController = {
  async index(req: Request, res: Response) {
    return res.status(200).json({
      status: 200,
      message: "All endpoints are working fine!",
    });
  },
};
