import { NumberSymbol } from "@angular/common";

export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeTitle: string,
    public placeImage: string,
    public found?: boolean
  ){}
}
