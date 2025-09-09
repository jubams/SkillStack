import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Status } from 'src/common/enums/shared.enums';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectTitle: string;

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsUrl()
  projectGithubURL?: string;

  @IsOptional()
  @IsUrl()
  projectLiveURL?: string;

  @IsNotEmpty()
  @IsEnum(Status)
  projectStatus: Status;

  @IsOptional()
  @IsDateString()
  projectStartedDate?: string;

  @IsOptional()
  @IsDateString()
  projectFinishedDate?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  skillIds?: number[];
}
