import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {ProjectService} from '@/domain/project/project.service';
import {AuthGuard} from '@/domain/auth/auth.guard';
import {Request} from 'express';
import {CreateProjectRequest} from '@/domain/project/project.dto';
import {
  ProjectAlreadyExistsException,
  ProjectForbiddenDeletionWhenFloorPlanExist,
  ProjectNotFoundException,
  ProjectWithSameNameExistsForUserException,
} from '@/domain/project/project.errors';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllProjectsForUser(@Req() req: Request) {
    return await this.projectService.getAllProjectNotDeletedForUser(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProjectByIdForUser(@Param('id') id: string, @Req() req: Request) {
    const project = await this.projectService.getProjectByIdNotDeletedForUser(
      id,
      req.user,
    );

    if (!project) {
      throw new ProjectNotFoundException();
    }

    return {
      projectId: project.projectId,
      name: project.name,
      createdAt: project.createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createProject(@Body() body: CreateProjectRequest, @Req() req: Request) {
    const project = await this.projectService.getProjectByNameNotDeletedForUser(
      body.name,
      req.user,
    );

    if (project) {
      throw new ProjectWithSameNameExistsForUserException();
    }

    const projectCreated = await this.projectService.createProject(
      body.name,
      req.user,
    );

    return {
      projectId: projectCreated.projectId,
      name: projectCreated.name,
      createdAt: projectCreated.createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: CreateProjectRequest,
    @Req() req: Request,
  ) {
    const project = await this.projectService.getProjectByIdNotDeletedForUser(
      id,
      req.user,
    );

    if (!project) {
      throw new ProjectNotFoundException();
    }

    const projectWithNameToUpdate =
      await this.projectService.getProjectByNameNotDeletedForUser(
        body.name,
        req.user,
      );

    if (projectWithNameToUpdate) {
      throw new ProjectWithSameNameExistsForUserException();
    }

    await this.projectService.updateProjectName(project, body.name);

    return {
      message: 'Project updated successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProject(@Param('id') id: string, @Req() req: Request) {
    const project = await this.projectService.getProjectByIdNotDeletedForUser(
      id,
      req.user,
    );

    if (!project) {
      throw new ProjectNotFoundException();
    }

    if (project.floorPlans.length > 0) {
      throw new ProjectForbiddenDeletionWhenFloorPlanExist();
    }

    await this.projectService.deleteProject(project.projectId);

    return {
      message: 'Project deleted successfully',
    };
  }
}
