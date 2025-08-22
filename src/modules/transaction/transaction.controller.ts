import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
    this.createTransaction = this.createTransaction.bind(this)
  }

  createTransaction = async (req: Request, res: Response) => {
    const authUserId = 2; //sesuai dgn hard-code prisma studio
    const result = await this.transactionService.createTransaction(
      req.body,
      authUserId
    );
    res.status(200).send(result);
  };
}
