import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProducts, getNFT } from '../utils'
import CarbonOffsets from '../components/CarbonOffset'

export default function Home(): JSX.Element {

  const [NFT, setNFT] = useState(undefined)

  const getNftHandler = async () => {
    setNFT(await getNFT())
  }

  useEffect(() => {

    getNftHandler()

  }, [getProducts, getNFT])

  return (
    <div>
      <div className="text-center text-gray-100 mb-9">
        <h1 className="font-bold text-5xl mb-4">Empower change. Invest in a sustainable future.</h1>
        <p>
          Join the movement towards a greener future –
          offset your carbon footprint <br/> and fund eco-friendly projects today!
        </p>
      </div>
      <div>
        {!NFT ? <div className="text-center text-gray-100">
          <h2 className="font-bold">Nothing yet</h2>
          <p className="text-sm font-medium">Support any Green initiative to receive NFT</p>
          </div> : <div className="text-center text-gray-100">
          <Image
            src={NFT.image}
            width={300}
            height={300}
            alt="NFT image"
            className="mx-auto"
          />

            <p className="font-bold mt-2">{NFT.name}</p>
            <p>{NFT.description}</p>
          </div>
        }

      </div>
      <CarbonOffsets getNftHandler={getNftHandler} />
    </div>
  )
}