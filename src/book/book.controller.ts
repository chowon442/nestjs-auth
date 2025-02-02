import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    getBooks(@Query('title') title?: string) {
        return this.bookService.getManyBooks(title);
    }

    @Get(':id')
    getBook(@Param('id') id: string) {
        return this.bookService.getBookById(+id);
    }

    @Post()
    postBook(@Body() body: CreateBookDto) {
        return this.bookService.createBook(body);
    }

    @Patch(':id')
    patchBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
        return this.bookService.updateBook(+id, body);
    }

    @Delete(':id')
    deleteBook(@Param('id') id: string) {
        return this.bookService.deleteBook(+id);
    }
}
