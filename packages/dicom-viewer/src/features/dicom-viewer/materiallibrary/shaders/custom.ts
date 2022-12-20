export type CustomContent = {
  post: string;
};

export type CustomShader = (content: CustomContent) => string;
