import { Repository } from 'typeorm';
import { Faq } from '../entities/faq.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FaqRepository extends Repository<Faq> {
  constructor(
    @InjectRepository(Faq) private readonly repository: Repository<Faq>
  ) {
    super(repository.target, repository.manager);
  }
};
