import { gql, useQuery } from "@apollo/client";
import ToucanClient from 'toucan-sdk'
import { issueNFT, hasNCT, addressToLowerCase } from '../utils'
import { useProvider, useSigner, useAccount } from 'wagmi'
import Image from 'next/image'
import {parseEther} from "ethers/lib/utils";

const CARBON_OFFSETS = gql`
  query CarbonOffsets {
    tco2Tokens(first: 3) {
      name
      symbol
      score
      createdAt
      creationTx
      creator {
        id
      }
    }
  }
`

interface CarbonOffsetProps {
  getNftHandler: () => void;
}


const CarbonOffsets: React.FC<CarbonOffsetProps> = ({getNftHandler}) => {

  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const toucan = new ToucanClient('alfajores', provider)
  signer && toucan.setSigner(signer)

  const { address } = useAccount()
  const { loading, error, data } = useQuery(CARBON_OFFSETS)

  const getUserRetirements = async() => {
    return await toucan.fetchUserRetirements(addressToLowerCase(address))
  }

  const redeemPoolToken = async (): Promise<void> => {

    const redeemedTokenAddress = await toucan.redeemAuto2('NCT', parseEther('1'))
    return redeemedTokenAddress[0].address

  }

  const retireTco2Token = async (): Promise<void> => {
    try {
      const tco2Address = await redeemPoolToken()

      return await toucan.retire(parseEther('1'), tco2Address)
    } catch (e) {
      console.log(e)
    }
  }

  const supportProject = async() => {

    if (!address) return alert('Connect Wallet')

    const userHasNCT = await hasNCT(address)
    if (userHasNCT) {
      const res = await retireTco2Token()
      return res && (await issueNFTHandler())
    }
    alert('Purchase NCT token first')
  }

  const issueNFTHandler = async () => {

    if (!address) return alert('Connect your Celo wallet')

    const retirements = await getUserRetirements()

    if (retirements) {
      await issueNFT(retirements.length)
      await getNftHandler()
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error! {error.message}</div>

  return (

    <div className="grid grid-cols-3 gap-4 mt-10">
      {data.tco2Tokens.map((carbon: any, i: number) => (
      <div key={i}>
        <div className="border border-gradient-to-r from-pink-700 via-blue-800 to-red-800 border-1 rounded-lg shadow-lg p-4">
          <Image
            src={`/images/${i}.jpg`}
            width={300}
            height={300}
            alt="NFT image"
            className="mx-auto"
          />
          <h2 className="font-bold mb-2 mt-3 text-gray-400">{carbon.name}</h2>
          <button onClick={supportProject} type="button" className="bg-green-600 text-gray-100 font-bold w-full rounded">
            Support
          </button>
        </div>
      </div>
    ))}
  </div>

  )
}

export default CarbonOffsets