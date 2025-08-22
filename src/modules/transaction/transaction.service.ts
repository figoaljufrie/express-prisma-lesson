import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { TransactionQueue } from "./transaction.queue";

export class TransactionService {
  private prisma: PrismaService;
  private transactionQueue: TransactionQueue;
  constructor() {
    this.prisma = new PrismaService();
    this.transactionQueue = new TransactionQueue();
  }

  public createTransaction = async (
    body: { ticketId: number; qty: number },
    authUserId: number
  ) => {
    //cek ticketId ada atau ngga di database:
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: body.ticketId,
      },
    });
    //kalo nggak ada, throw Error.
    if (!ticket) {
      throw new ApiError("Invalid Tiket Id", 400);
    }
    //kalo ada, cek stock, cukup atau ngga.
    if (ticket.stock < body.qty) {
      throw new ApiError("Stock is not available.", 400);
    }
    

    const result = await this.prisma.$transaction(async (tx) => {
      //kalo stock-nya cukup, update qty:
      await tx.ticket.update({
        where: {
          id: body.ticketId,
        },
        data: {
          stock: { decrement: body.qty },
        },
      });
      // kalo cukup, bikin data transaksi baru
      return await tx.transaction.create({
        data: {
          ticketId: body.ticketId,
          qty: body.qty,
          userId: authUserId,
          price: ticket.price,
        },
      });
    });

    //buat delay jobs 1 menit:
    await this.transactionQueue.addNewTransaction(result.uuid);
console.log(result)
    return { message: "Create Transaction Success!" };
  };
}
