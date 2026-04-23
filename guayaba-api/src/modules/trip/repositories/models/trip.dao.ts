export interface TripDao {
  id: number;
  boardingLat: number | null;
  boardingLong: number | null;
  landingLat: number | null;
  landingLong: number | null;
  driverId: number | null;
  passengerId: number | null;
  sessionId: string | null;
  amount: number | null;
  passengerCount: number | null;
  description: string | null;
  directionFrom: string | null;
  directionTo: string | null;
  status: string | null;
  boardedAt: Date | null;
  landedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
