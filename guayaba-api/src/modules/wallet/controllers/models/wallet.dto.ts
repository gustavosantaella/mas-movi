export class UpdateWalletBalanceDto {
  amount: number;
}

export class WalletResponseDto {
  id: number;
  userId: number;
  balance: number;
  balanceLocked: number;
  passengerUuid: string | null;
  driverUuid: string | null;
  createdAt: Date;
  updatedAt: Date;
}
