import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBookDto {
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsNotEmpty()
    @IsOptional()
    author?: string;

    @IsNotEmpty()
    @IsOptional()
    genre?: string;

    @IsNotEmpty()
    @IsOptional()
    detail?: string;
}
