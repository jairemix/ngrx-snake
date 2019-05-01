export function setProto<O, V>(value: V) {
  return((target: O, key: string) => {
      target[key] = value;
  });
}
