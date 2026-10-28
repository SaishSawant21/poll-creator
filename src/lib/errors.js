export const appError = (code, message) => {
  const err =  new Error(message);
  err.code = code;
  return err;
} 