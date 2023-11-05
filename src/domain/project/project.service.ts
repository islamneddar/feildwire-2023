import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ProjectEntity} from '@/domain/project/project.entity';
import {Repository} from 'typeorm';
import {UserEntity} from '@/domain/user/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async getAllProjectNotDeletedForUser(user: UserEntity) {
    return await this.projectRepository.find({
      where: {
        user: {
          userId: user.userId,
        },
      },
      select: {
        projectId: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async getProjectByIdNotDeletedForUser(id: string, user: UserEntity) {
    return await this.projectRepository.findOne({
      where: {
        projectId: id,
        user: {
          userId: user.userId,
        },
      },
      relations: ['floorPlans'],
      select: {
        projectId: true,
        name: true,
        createdAt: true,
        floorPlans: {
          floorPlanId: true,
          name: true,
          createdAt: true,
        },
      },
    });
  }

  async createProject(name: string, user: UserEntity) {
    const project = new ProjectEntity();
    project.name = name;
    project.user = user;
    return await this.projectRepository.save(project);
  }

  async getProjectByNameNotDeletedForUser(name: string, user: UserEntity) {
    return await this.projectRepository.findOne({
      where: {
        name,
        user: {
          userId: user.userId,
        },
      },
    });
  }

  async updateProjectName(project: ProjectEntity, name: string) {
    project.name = name;
    return await this.projectRepository.save(project);
  }

  async deleteProject(id: string) {
    await this.projectRepository.delete({
      projectId: id,
    });
  }
}
