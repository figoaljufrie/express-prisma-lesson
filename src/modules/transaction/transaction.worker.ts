import { connection } from "../../config/redis";
import { Job, Worker } from "bullmq";
import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api-error";

export class TransactionWorker {
  private worker: Worker;
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = new PrismaService();
    this.worker = new Worker("transactionQueue", this.handleTransaction, {
      connection,
    });
  }

  private handleTransaction = async (job: Job<{ uuid: string }>) => {
    const uuid = job.data.uuid;

    const transaction = await this.prismaService.transaction.findFirst({
      where: {
        uuid,
      },
    });

    if (!transaction) {
      throw new ApiError("Invalid Transaction Id", 400);
    }

    //kalo masih waiting for payment:
    if (transaction.status === "WAITING_FOR_PAYMENT") {
      //buat data transaksi tersebut jadi expired:
      await this.prismaService.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { uuid },
          data: { status: "EXPIRED" },
        });

        //balikin stock sebelum di beli:
        await tx.ticket.update({
          where: { id: transaction.ticketId },
          data: { stock: { increment: transaction.qty } },
        });
      });
    }
  };
}
