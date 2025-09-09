import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Priority, Status, TimeLine } from 'src/common/enums/shared.enums';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  goalTitle: string;

  @IsOptional()
  @IsString()
  goalDescription?: string;

  @IsOptional()
  @IsEnum(Status)
  goalStatus?: Status;

  @IsOptional()
  @IsEnum(Priority)
  goalPriority?: Priority;

  @IsOptional()
  @IsEnum(TimeLine)
  goalTimeLine?: TimeLine;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  skillIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  progress?: number;

  @IsOptional()
  @IsString()
  goalNote?: string;

}
