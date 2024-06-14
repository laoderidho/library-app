import { IsNotEmpty } from "class-validator";

export class CreateBorrowingDto {

    @IsNotEmpty()
    bookId: number;
}