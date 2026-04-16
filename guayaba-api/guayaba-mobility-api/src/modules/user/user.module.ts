import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity.js";
import { UserRepository } from "./repositories/user.repository.js";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller.js";

import { WalletModule } from '../../modules/wallet/wallet.module';

@Module({
    controllers: [UserController],
    providers: [UserRepository, UserService],
    imports: [TypeOrmModule.forFeature([User]), WalletModule],
    exports: [UserService, UserRepository]
})

export class UserModule { }