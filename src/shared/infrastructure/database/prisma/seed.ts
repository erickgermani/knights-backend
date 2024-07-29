import 'tsconfig-paths/register';
import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fakerRounds = 60;

  await prisma.knight.deleteMany();

  const fakeProps: KnightEntity[] = [];

  for (let i = 0; i < fakerRounds; i++)
    fakeProps.push(KnightEntityFactory.create(KnightDataBuilder()));

  await prisma.knight.createMany({ data: fakeProps });
}

main().catch((err) => {
  console.error('Error while generating seed: \n', err.message);
});
