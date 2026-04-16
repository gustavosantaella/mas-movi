export class CreateTripDto {
  boardingLat?: number;
  boardingLong?: number;
  landingLat?: number;
  landingLong?: number;
  driverId?: number;
  passengerId?: number;
  sessionId?: string;
  amount?: number;
  description?: string;
  directionFrom?: string;
  directionTo?: string;
  status?: string;
  boardedAt?: Date;
  landedAt?: Date;
}

export class UpdateTripDto {
  landingLat?: number;
  landingLong?: number;
  amount?: number;
  description?: string;
  directionTo?: string;
  status?: string;
  landedAt?: Date;
}
