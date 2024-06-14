import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Borrowing } from "src/borrowing/infrastructure/entities/borrowing.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateBorrowingDto } from "src/borrowing/aplication/dto/create-borrowing.dto";
import { JwtService } from "@nestjs/jwt";
import { Penalty } from "src/borrowing/infrastructure/entities/penalty.entity";

@Injectable()
export class BorrowingService {
    constructor(
        @InjectRepository(Borrowing) 
        private borrowingRepository: Repository<Borrowing>,

        private jwtService: JwtService,

        private readonly entityManager: EntityManager,

        @InjectRepository(Penalty)
        private penaltyRepository: Repository<Penalty>
    ) {}

    // meminjam Buku
    async addBorrowing(createBorrowing: CreateBorrowingDto, jwtToken: string) {
        try {
            let user = this.jwtService.verify(jwtToken);
            user = user.sub;
            const now = new Date();
            const status = false;
            const calculate7days = now.setDate(now.getDate() + 7);
            const get7days = new Date(calculate7days);

            // transaction
            
            await this.entityManager.transaction(async transaction => {
                await this.validateBookStock(transaction, user);
                await this.validatePenalty(transaction, user);
                await this.lessStockBook(transaction, createBorrowing.bookId);
                await transaction.save(Borrowing, {
                    ...createBorrowing,
                    userId: user,
                    borrowingDate: now,
                    returningDate: get7days,
                    status: status
                });
            })
            
            return {
                message: 'Data berhasil disimpan'
            };
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundException('User atau buku tidak ditemukan');
            }
            throw new ForbiddenException('Gagal menyimpan data', error.message);
        }
    }

    private async lessStockBook(transaction: EntityManager, bookId: number) {
        try {
            const data = await transaction.query(`SELECT stok FROM books WHERE id = ${bookId}`);
            
            if (data.length === 0 || data[0].stok <= 0) {
                throw new NotFoundException('Stok buku habis');
            }else{
                await transaction.query(`UPDATE books SET stok = stok - 1 WHERE id = ${bookId}`);
                 return true;
            }


        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    private async validateBookStock(transaction : EntityManager, userId: number){
        try {
            const data = await transaction.query(`SELECT COUNT(*) as total FROM borrowings WHERE userId = ${userId} AND status = false`);
            const total = data[0].total;

            if (total >= 2) {
                throw new NotFoundException('Maksimal peminjaman 2 buku');
            }

            return true;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    private async validatePenalty(transaction: EntityManager, userId: number){

        let data = await transaction.query(`SELECT count(*) as totalPenalty FROM penalties WHERE userId = ${userId} AND penaltyEnd > NOW()`);

        data = data[0].totalPenalty;

        if(data > 0){
            throw new NotFoundException('Anda tidak bisa meminjam buku karena masih ada penalty');
        }

        return true;

    }

    // mengembalikan buku
    async returnBook(id: number) {
        try {
           const data = await this.borrowingRepository.findOne({ where: { id: id } }); 
           const now = new Date();
           const calculate3days = now.setDate(now.getDate() + 3);
           const get3days = new Date(calculate3days);

           
        if (!data) {
            throw new NotFoundException('Data tidak ditemukan');
        }

        await this.entityManager.query(`UPDATE books SET stok = stok + 1 WHERE id = ${data.bookId}`);
        await this.borrowingRepository.update(id, { status: true });

        if(data.returningDate < now){
            await this.penaltyRepository.save({
                userId: data.userId,
                penaltyStart: now,
                penaltyEnd: get3days,
            })

            return {
                message: 'Buku Terlambat Dikembalikan, Anda Tidak Bisa Meminjam Buku Selama 3 Hari'
            }
        }

        return {
            message: 'Buku berhasil dikembalikan'
        };

        } catch (error) {
            throw new InternalServerErrorException('Gagal mengembalikan buku', error.message);
        }
    }

    // melihat Buku yang dipinjam
    async getBorrowingByUser(jwtToken: string) {
        try {

            let user = this.jwtService.verify(jwtToken);
            user = user.sub;

            let data = this.entityManager.query(`
                    select bo.title, bo.id as bookId, date_format(b.borrowingDate, '%d-%M-%Y') as tanggal_pengambilan, 
                    date_format(b.returningDate, '%d-%M-%Y') as tanggal_pengembalian,
                    case 
                        when b.status = 1 then 'Sudah Dikembalikan'
                        else 'Belum Dikembalikan'
                    end as status
                    from borrowings b 
                    join users u 
                    on u.id = b.userId
                    join books bo
                    on bo.id = b.bookId
                    where u.id = ${user}`)

            return data;
        } catch (error) {
            throw new BadRequestException('Gagal mengambil data', error.message);
        }
    }


    async GetBorrowAllUser(){
        try {
            let data = this.entityManager.query(`select u.name, count(b.userId) as total_pinjam, 
                                                count(case when b.status = 0 Then 1 else null end) as belum_dikembalikan,
                                                count(case when b.status = 1 then 1 else null end) as sudah_dikembalikan
                                                from users u join borrowings b 
                                                on u.id = b.userId
                                                group by
                                                    u.id, u.name`)
            return data;
        } catch (error) {
            throw new BadRequestException('Gagal mengambil data', error.message);
        }
    }
}
