import {Injectable} from '@nestjs/common';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '@/domain/user/user.entity';
import {ProjectEntity} from '@/domain/project/project.entity';

@Injectable()
export class FloorPlanService {
  constructor(
    @InjectRepository(FloorPlanEntity)
    private readonly floorPlanRepository: typeof FloorPlanEntity,
  ) {}

  async getFloorPlanByNameNotDeletedForProjectIdForUser(
    fileName: string,
    projectId: string,
    user: UserEntity,
  ) {
    return await this.floorPlanRepository.findOne({
      where: {
        name: fileName,
        project: {
          projectId: projectId,
          user: {
            userId: user.userId,
          },
        },
      },
    });
  }

  async createFloorPlan(param: {
    name: string;
    originalImageUrl: string;
    thumbnailImageUrl: string;
    LargeImageUrl: string;
    project: ProjectEntity;
  }) {
    const floorPlan = new FloorPlanEntity();
    floorPlan.name = param.name;
    floorPlan.imageUrl = param.originalImageUrl;
    floorPlan.thumbnailUrl = param.thumbnailImageUrl;
    floorPlan.largeImageUrl = param.LargeImageUrl;
    floorPlan.project = param.project;
    return await this.floorPlanRepository.save(floorPlan);
  }
}
