export interface UserDao {
  id: number;
  email: string;
  dni: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  sex: string | null;
  userType: number[];
  emailConfirmed: boolean;
  entityConfirmed: boolean;
  passengerUuid: string | null;
  driverUuid: string | null;
  createdAt: Date;
  updatedAt: Date;
}
