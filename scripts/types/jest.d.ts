declare module '@jest/globals' {
  export const jest: {
    fn: () => jest.Mock;
    mock: (modulePath: string) => void;
    clearAllMocks: () => void;
  };
  
  export type Mock<T = any, Y extends any[] = any> = {
    (...args: Y): T;
    mockReturnThis: () => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockResolvedValue: (value: T) => Mock<Promise<T>, Y>;
    mockRejectedValue: (value: any) => Mock<Promise<T>, Y>;
  };

  export type Mocked<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => infer B
      ? Mock<B, A>
      : T[P];
  };
}