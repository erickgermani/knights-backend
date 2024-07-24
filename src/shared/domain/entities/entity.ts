import { ObjectId } from 'bson';

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id || new ObjectId().toString();
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: string } & Record<string, any>> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Record<string, any>>;
  }
}
