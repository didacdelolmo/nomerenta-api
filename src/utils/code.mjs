import crypto from 'crypto';

export const generateInvitationCode = () => {
  const hex = crypto.randomBytes(8).toString('hex').toUpperCase();

  const part1 = hex.substring(0, 4);
  const part2 = hex.substring(4, 8);
  const part3 = hex.substring(8, 12);

  return `${part1}-${part2}-${part3}`;
};
