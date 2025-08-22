import { Sample } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { CLoudinaryService } from "../cloudinary/cloudinary.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

export class SampleService {
  private prisma: PrismaService;
  private mailService: MailService;
  private cloudinaryService: CLoudinaryService;
  private redisService: RedisService;

  constructor() {
    this.prisma = new PrismaService();
    this.mailService = new MailService();
    this.cloudinaryService = new CLoudinaryService();
    this.redisService = new RedisService();
  }

  getSamples = async () => {
    const cacheSamples = await this.redisService.getValue("samples");

    if (cacheSamples) {
      console.log("Data dari redis");
      return JSON.parse(cacheSamples);
    }

    const samples = await this.prisma.sample.findMany();

    console.log("data dari database")
    await this.redisService.setValue("samples", JSON.stringify(samples), 20);
    return samples;
  };

  getSample = async (id: number) => {
    const sample = await this.prisma.sample.findFirst({
      where: { id },
    });

    if (!sample) throw new ApiError("sample not found", 404);

    return sample;
  };

  createSample = async (body: Pick<Sample, "name">) => {
    await this.prisma.sample.create({
      data: body,
    });

    return { message: "Create sample success" };
  };

  sendEmail = async (email: string) => {
    await this.mailService.sendMail(
      email,
      "Welcome to Purwadhika!",
      "welcome",
      { email: email }
    );
    return { message: "Send email success" };
  };

  uploadImage = async (image: Express.Multer.File) => {
    const { secure_url } = await this.cloudinaryService.upload(image);

    return { message: "Upload Success!", url: secure_url };
  };
}
