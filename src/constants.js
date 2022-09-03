export const CONTRACT_ADDRESS = "0xA868B974fA93Bdc130D9D4dE36E9295A0583c806";

export const transformCharacterData = ({
  name,
  imageURI,
  hp,
  maxHp,
  attackDamage,
}) => {
  return {
    name,
    imageURI,
    hp: hp.toNumber(),
    maxHp: maxHp.toNumber(),
    attackDamage: attackDamage.toNumber(),
  };
};