import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: "Title is required" })
    @IsString({ message: "Title must be a string" })
    title: string;

    @IsNotEmpty({ message: "Description is required" })
    @IsString({ message: "Description must be a string" })
    description: string;

    @IsNotEmpty({ message: "Price is required" })
    @IsNumber({maxDecimalPlaces: 2}, { message: "Price must be a number and max decimal places is 2" })
    @IsPositive({ message: "Price must be a positive number" })
    price: number;

    @IsNotEmpty({ message: "Stock is required" })
    @IsNumber({}, { message: "Stock must be a number" })
    @Min(0, { message: "Stock must be greater than or equal to 0" })
    stock: number;

    @IsNotEmpty({ message: "Images is required" })
    @IsArray({ message: "Images must be an array" })
    images: string[];

    @IsNotEmpty({ message: "Category is required" })
    @IsNumber({}, { message: "Category must be a number" })
    categoryId: number;
}
