class Observer {
  // eslint-disable-next-line
  update = (data: any) => {
    console.log('update', data);
  };
}

export class Subject {
  private _observers: Observer[] = [];

  addObserver = (observer: Observer) => {
    this._observers.push(observer);
  };

  deleteObserver = (observer: Observer) => {
    const index = this._observers.findIndex((ob) => ob === observer);
    if (index >= 0) {
      this._observers.splice(index, 1);
    }
  };

  deleteAllObservers = () => {
    this._observers = [];
  };

  // eslint-disable-next-line
  notifyObservers = (data: any) => {
    this._observers.forEach((ob) => {
      ob.update(data || this);
    });
  };
}
