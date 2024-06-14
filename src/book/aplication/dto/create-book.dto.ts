import { IsNotEmpty } from "class-validator";


export class CreateBookdto{

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    stok: number
}