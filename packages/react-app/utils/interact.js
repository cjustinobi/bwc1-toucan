import { providers, Contract } from 'ethers'
import axios  from 'axios'
import GreenInit from '../GreenInit.json'

export const contractAddress = '0x0976833ca8F68b7453e59Ae3bb3bf871a174D09e'

export async function getContract() {

  let contract

  try {
    const { ethereum } = window

    const provider = new providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    contract = new Contract(contractAddress, GreenInit.abi, signer)

  } catch (error) {
    console.log("ERROR:", error)
  }
  return contract
}

export const issueNFT = async (retireCount) => {

  try {
    const contract = await getContract()

    let res = await contract.issueNFT(contractAddress, retireCount)
    return await res.wait()
  } catch (e) {
    console.log(e)
  }
}

export const getNFT = async () => {

  try {

    const contract = await getContract()
    const tokenId = await contract.getTokenId()
    const tokenURI = await contract.tokenURI(tokenId)
    return await getNFTMeta(tokenURI)

  } catch (e) {
    console.log(e)
  }
}

export const getNFTMeta = async URI => {
  try {
    return (await axios.get(URI)).data
  } catch (e) {
    console.log({ e })
  }
}


