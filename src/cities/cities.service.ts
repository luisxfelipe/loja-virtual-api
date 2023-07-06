import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll() {
    return await this.cityRepository.find();
  }

  async findByName(name: string, uf: string): Promise<City> {
    try {
      return await this.cityRepository.findOneOrFail({
        where: {
          name,
          state: {
            uf,
          },
        },
        relations: {
          state: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('City not found');
    }
  }

  async findOne(id: number): Promise<City> {
    try {
      return await this.cityRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('City not found');
    }
  }

  async findByStateId(stateId: number): Promise<City[]> {
    return await this.cacheService.getCache<City[]>(
      `state_${stateId}`,
      async () => {
        return await this.cityRepository.find({
          where: { stateId },
        });
      },
    );
  }
}
