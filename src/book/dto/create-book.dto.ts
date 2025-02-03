import { IsNotEmpty } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    author: string;

    @IsNotEmpty()
    genre: string;

    @IsNotEmpty()
    detail: string;
}