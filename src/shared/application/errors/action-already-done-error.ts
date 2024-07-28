export class ActionAlreadyDoneError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'ActionAlreadyDoneError';
  }
}
