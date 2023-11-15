import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FloorPlanVersionEntity} from '@/domain/floor-plan-version/floor-plan-version.entity';
import {Repository} from 'typeorm';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';

@Injectable()
export class FloorPlanVersionService {
  constructor(
    @InjectRepository(FloorPlanVersionEntity)
    private readonly floorPlanVersionRepository: Repository<FloorPlanVersionEntity>,
  ) {}

  async createFloorPlanVersion(param: {
    floorPlan: FloorPlanEntity;
    imageUrl: string;
    largeImageUrl: string;
    thumbnailUrl: string;
    versionNumber: number;
  }) {
    const floorPlanVersion = new FloorPlanVersionEntity();
    floorPlanVersion.floorPlan = param.floorPlan;
    floorPlanVersion.imageUrl = param.imageUrl;
    floorPlanVersion.largeImageUrl = param.largeImageUrl;
    floorPlanVersion.thumbnailUrl = param.thumbnailUrl;
    floorPlanVersion.versionNumber = param.versionNumber;
    return this.floorPlanVersionRepository.save(floorPlanVersion);
  }

  // todo : change to max
  async getLatestFloorPlanVersionByFloorPlanId(floorPlanId: string) {
    return this.floorPlanVersionRepository.findOne({
      where: {
        floorPlan: {
          floorPlanId: floorPlanId,
        },
      },
      relations: {
        floorPlan: true,
      },
      order: {
        versionNumber: 'DESC',
        //createdAt: 'DESC',
      },
    });
  }
}
