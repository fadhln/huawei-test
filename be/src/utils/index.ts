function isEmailValid(email: string) {
  const regex = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function isPhoneValid(phone: string) {
  const regex = /^[0-9]{9,12}/;
  return regex.test(phone);
}

export { isEmailValid, isPhoneValid };
