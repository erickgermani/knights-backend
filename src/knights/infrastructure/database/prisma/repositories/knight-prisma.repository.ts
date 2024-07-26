import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import KnightRepository from '@/knights/domain/repositories/knight.repository';
import KnightModelMapper from '../models/knight-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

class KnightPrismaRepository implements KnightRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async nicknameExists(nickname: string): Promise<void> {
    const knight = await this.prismaService.knight.findUnique({
      where: {
        nickname,
      },
    });

    if (knight) throw new ConflictError('Nickname already used');
  }

  async search(
    props: KnightRepository.SearchParams,
  ): Promise<KnightRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.knight.count({
      ...(props.filterBy && {
        where: {
          name: {
            contains: props.filterBy,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.knight.findMany({
      ...(props.filterBy && {
        where: {
          name: {
            contains: props.filterBy,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new KnightRepository.SearchResult({
      items: models.map((model) => KnightModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filterBy: props.filterBy,
    });
  }

  async insert(entity: KnightEntity): Promise<void> {
    await this.prismaService.knight.create({
      data: entity.toJSON(),
    });
  }

  findById(id: string): Promise<KnightEntity> {
    return this._get(id);
  }

  async findAll(): Promise<KnightEntity[]> {
    const models = await this.prismaService.knight.findMany();

    return models.map((model) => KnightModelMapper.toEntity(model));
  }

  async update(entity: KnightEntity): Promise<void> {
    await this._get(entity._id);

    const updatedEntity = {
      ...entity.toJSON(),
    };

    delete updatedEntity.id;

    await this.prismaService.knight.update({
      where: {
        id: entity._id,
      },
      data: updatedEntity,
    });
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented');
  }

  protected async _get(id: string): Promise<KnightEntity> {
    try {
      const model = await this.prismaService.knight.findUnique({
        where: {
          id,
        },
      });

      return KnightModelMapper.toEntity(model);
    } catch {
      throw new NotFoundError(`KnightModel not found using ID ${id}`);
    }
  }
}

export default KnightPrismaRepository;
