import { Request, Response } from "express";
import seatService from "../services/SeatService";

export async function getSeatPrices(req: Request, res: Response){
  const prices = await seatService.getPrices()
  res.status(200).send(prices);
}
