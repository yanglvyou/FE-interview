class Singleton {
  private static singleton: Singleton;
  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.singleton) {
      Singleton.singleton = new Singleton();
    }
    return Singleton.singleton;
  }
}

const ins1 = Singleton.getInstance();

const ins2 = Singleton.getInstance();
console.log(ins1 === ins2, ins1);
