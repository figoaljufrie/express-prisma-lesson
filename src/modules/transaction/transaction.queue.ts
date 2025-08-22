import { Queue } from "bullmq";
import { connection } from "../../config/redis";

export class TransactionQueue {
  private queue: Queue;
  constructor() {
    this.queue = new Queue("transactionQueue", { connection });
  }

  addNewTransaction = async (uuid: string) => {
    console.log (this.queue.add)
    return await this.queue.add(
      "newTransaction",
      { uuid: uuid }, // payload queue
      {
        jobId: uuid,
        delay: 10 * 1000,
        // delay: 1 * 60 * 1000, //delay 1 menit
        attempts: 5, // retry 5x
        removeOnComplete: true, //hapus data setelah berhasil
        //kalo ada error, akan di delay: tambahan delay per 1 detaik (1000)
        backoff: { type: "exponential", delay: 1000 },
      }
    );
  };
}
