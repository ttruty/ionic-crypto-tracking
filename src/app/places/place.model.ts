import { PlaceLocation } from './location.model';
export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageURL: string,
    public userId: string,
    public location: PlaceLocation
  ) {}
}
