import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class BookTitleValidationPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!value) {
            return value;
        }

        // 글자의 길이가 2보다 작거나 같으면 에러!
        if (value.length <= 2) {
            throw new BadRequestException('책 제목은 2글자 이상이어야 합니다.');
        }

        return value;
    }

}