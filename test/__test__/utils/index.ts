const sleep = async (ms: number) =>
  await new Promise((res) => setTimeout(res, ms));

function generateRandomStr(length: number): string {
  const alphanumericChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    result += alphanumericChars[randomIndex];
  }

  return result;
}

export { sleep, generateRandomStr };
