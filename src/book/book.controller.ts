import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookTitleValidationPipe } from './pipe/book-title-validation.pipe';

@Controller('book')
@UseInterceptors(ClassSerializerInterceptor)
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    getBooks(@Query('title', BookTitleValidationPipe) title?: string) {
        return this.bookService.findAll(title);
    }

    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findOne(id);
    }

    @Post()
    postBook(@Body() body: CreateBookDto) {
        return this.bookService.create(body);
    }

    @Patch(':id')
    patchBook(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
        return this.bookService.update(id, body);
    }

    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.delete(id);
    }
}
