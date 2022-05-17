import React, { useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import LandMarketModel from "../../models/market/LandMarketModel";
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel";
import LandMarketService from "../../services/market/LandMarketService";
import RentService from "../../services/rent/RentService";
import ContractStore from "../../store/contract";
import Market from "../Market/Market";
import "./ModalRenting.scss";

type Props = {
  setIsShowModalRenting: (value: boolean) => void;
  fetchDetail: () => void
  land: LandMarketModel
};

interface Options {
  value: number;
  label: string;
}

export default function ModalRenting(props: Props) {
  const contractStore = useMemo(() => new ContractStore, [])
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [rentingType, setRentingType] = useState<number>(1);
  const [peroid, setPeroid] = useState<number | null>(3)
  const rentService: RentService = new RentService
  const [isChecked, setIsChecked] = useState<boolean>(false)

  useEffect(() => {
    
  }, [])


  const options: Array<Options> = [
    { value: 1, label: "Set time period" },
    { value: 2, label: "No time limit" },
  ];

  const optionsPeroid: Array<Options> = [
    // { value: 1, label: '1' },
    // { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' }
  ]

  async function confirmRenting() {
    setisLoading(true)
    const hash: string = await contractStore.transferEther(props.land.ownerUserTokenId.userTokenId, props.land.price)
    if (hash) {
      const body: AddLandRentRequestModel = {
        landTokenId: props.land.landTokenId.landTokenId,
        rentType: props.land.rentType.rentTypeId!,
        periodType: rentingType,
        period: peroid!,
        price: props.land.price,
        hash: hash
      }
      const result = await rentService.confirmRenting(body)
      if (result) {
        props.fetchDetail()
        props.setIsShowModalRenting(false)
        setisLoading(false)
      }
    }
  }

  return (
    <div id="renting">
      <div id="rentingBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Renting</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalRenting(false)}
          />
        </div>
        <div className="image-upload-or-link">
          <div className="image-div">
            <img className="image-profile" src={"/map.jpg"} alt="" />
          </div>
          <p className="text-land-name">{props.land.landTokenId.landName}</p>
        </div>
        <div className="name-description">
          <div className="name-input-div">
            <p className="label-name">Renting Type</p>
            <select
              name="selectPeriod"
              id="selectPeriod"
              className="input-select"
              value={rentingType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRentingType(Number(e.target.value))}
            >
              {options.map((item: Options) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="name-input-div">
            <p className="label-name">Peroid</p>
            <select
              name="selectPeriod"
              id="selectPeriod"
              className={`input-select ${rentingType === 2 ? 'disabled' : ''}`}
              value={peroid!}
              disabled={rentingType === 2 ? true : false}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setPeroid(Number(e.target.value))
              }
            >
              {optionsPeroid.map((item: Options) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="checkbox">
          {/* <div className="checkbox-div">
            <input className="checkbox-icon" type="checkbox" />
            <p className="accept">Auto Re-renting on market</p>
          </div> */}
          <div className="checkbox-div">
            <input className="checkbox-icon" type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />
            <p className="accept">Accept the terms of use</p>
          </div>
        </div>
        <div className="button-save-div">
          {!isLoading ? (
            <button className="button-save" onClick={confirmRenting}>
              Confirm Renting {props.land.price} ETH/{props.land.rentType.rentTypeText}
            </button>
          ) : (
            <button className="button-save">
              <i className="fas fa-spinner fa-spin icon"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
