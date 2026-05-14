// src/styles.d.ts
declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}
