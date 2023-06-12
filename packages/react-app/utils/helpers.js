import {ethers, providers} from 'ethers'

export const addressToLowerCase  = address => address?.toLocaleLowerCase()

export const hasNCT = async (walletAddress) => {
  const provider = new providers.Web3Provider(ethereum)

  const tokenAddress = '0xfb60a08855389f3c0a66b29ab9efa911ed5cbcb5'

  const token = new ethers.Contract(tokenAddress, ['function balanceOf(address) view returns (uint256)'], provider)
  const balance = await token.balanceOf(walletAddress)
  return balance.gt(0)
}