import {Injectable} from '@nestjs/common';
import {FloorPlanEntity} from '@/domain/floor-plan/floor-plan.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '@/domain/user/user.entity';
import {ProjectEntity} from '@/domain/project/project.entity';
import {Repository} from 'typeorm';

@Injectable()
export class FloorPlanService {
  constructor(
    @InjectRepository(FloorPlanEntity)
    private readonly floorPlanRepository: Repository<FloorPlanEntity>,
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

  async getFloorPlanByIdNotDeletedForUser(id: string, user: UserEntity) {
    return await this.floorPlanRepository.findOne({
      where: {
        floorPlanId: id,
        project: {
          user: {
            userId: user.userId,
          },
        },
      },
      relations: ['project'],
    });
  }

  async getAllFloorPlanByProjectIdForUser(projectId: string, user: UserEntity) {
    return await this.floorPlanRepository.find({
      where: {
        project: {
          projectId: projectId,
          user: {
            userId: user.userId,
          },
        },
      },
    });
  }

  async updateFloorPlan(
    floorPlan: FloorPlanEntity,
    params: {
      name?: string;
      imageUrl?: string;
      thumbnailUrl?: string;
      largeImageUrl?: string;
    },
  ) {
    if (params.name) {
      floorPlan.name = params.name;
    }
    if (params.imageUrl) {
      floorPlan.imageUrl = params.imageUrl;
    }
    if (params.thumbnailUrl) {
      floorPlan.thumbnailUrl = params.thumbnailUrl;
    }
    if (params.largeImageUrl) {
      floorPlan.largeImageUrl = params.largeImageUrl;
    }
    return await this.floorPlanRepository.save(floorPlan);
  }

  async deleteFloorPlan(floorPlan: FloorPlanEntity) {
    return await this.floorPlanRepository.delete(floorPlan.floorPlanId);
  }
}
