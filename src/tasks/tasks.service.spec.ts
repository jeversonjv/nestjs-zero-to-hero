import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repositories';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: () => {},
  findOne: () => {},
});

const mockUser = {
  username: 'any_name',
  id: 'any_id',
  password: 'any_password',
  tasks: []
}

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository }
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  it('Calls TasksRepository.getTasks and returns the result', async () => {
    jest.spyOn(tasksRepository, 'getTasks').mockResolvedValue('someValue');
    const result = await tasksService.getTasks(null, mockUser);
    expect(result).toEqual('someValue');
  });

  it('Calls TasksRepository.findOne and return the result', async () => {
    const fakeTask = {
      title: 'any_title',
      description: 'any_description',
      id: 'any_id',
      status: TaskStatus.OPEN
    };

    jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(fakeTask);
    const result = await tasksService.getTaskById('any_id', mockUser);
    expect(result).toEqual(fakeTask);
  });

  it('Calls TasksRepository.findOne and handles error', async () => {
    jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null);
    const promise = tasksService.getTaskById('any_id', mockUser);
    expect(promise).rejects.toThrow(NotFoundException);
  });

});