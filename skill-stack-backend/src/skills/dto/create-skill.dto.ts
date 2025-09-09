import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProficiencyLevel } from 'src/common/enums/shared.enums';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  skillName: string;

  @IsNotEmpty()
  @IsEnum(ProficiencyLevel)
  proficiencyLevel: ProficiencyLevel;

  @IsNotEmpty()
  @IsString()
  skillCategory: string;

  @IsOptional()
  @IsString()
  skillDescription?: string;

  @IsOptional()
  @IsInt()
  yearsOfExperience?: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  projectIds?: number[];
}
