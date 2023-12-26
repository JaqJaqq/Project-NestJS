import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {}

    async createTask (createTaskDto: CreateTaskDto): Promise<Task> {
        const {
            title,
            description,
        } = createTaskDto;

        const task = this.taskRepository.create({
            title,
            description,
        })

        try {
            await this.taskRepository.save(task)
            return task;
        } catch (error) {
            throw new ConflictException({
                message: ['Something went wrong, I cant create.'],
            })
        }
    }

    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await this.taskRepository.find()
            return tasks 
        } catch (error) {
            throw new NotFoundException({
                message: ['Task not found.'],
            })
        }
    }

    async getTaskById(id: string): Promise<Task> {
        try {
            const task = await this.taskRepository.findOne({ where: { id }})
            return task
        } catch (error) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
    }

    async updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        try {
            const task = await this.getTaskById(id)

            const {
                title,
                description,
            } = updateTaskDto

            if (title) {
                task.title = title
            }

            if (description) {
                task.description = description
            }

            await this.taskRepository.save(task)
            return task

        } catch (error) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
    }

    async deleteTaskById(id: string): Promise<Task> {
        try {
            const task = await this.getTaskById(id)
            await this.taskRepository.delete(id)
            return task
        } catch (error) {
            throw new NotFoundException({
                message: `Task with ID "${id}" not found`,
            })
        }
    }
}
