import React, { useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import LandMarketModel from "../../models/market/LandMarketModel";
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel";
import LandMarketService from "../../services/market/LandMarketService";
import Market from "../Market/Market";
import RentTypeModel from "../../models/rent/RentTypeModel";
import RentService from "../../services/rent/RentService";
import ContractStore from "../../store/contract";
import Select from 'react-select'
import "./ModalRenting.scss";
import ReactSelectOptionModel from "../../models/reactSelect/ReactSelectOptionModel";

type Props = {
  setIsShowModalRenting: (value: boolean) => void;
  fetchDetail: () => void
  land: LandMarketModel
};

interface Options {
  value: number | undefined;
  label: string | undefined;
}

export default function ModalRenting(props: Props) {
  const contractStore = useMemo(() => new ContractStore, [])
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [periodType, setPeriodType] = useState<Options>();
  const [period, setPeriod] = useState<Options>({ value: 3, label: '3'  })
  const rentService: RentService = new RentService
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const [optionsPeroidType, setOptionsPeroidType] = useState<Array<Options>>([
    { value: 1, label: "Set time period" },
    { value: 2, label: "No time limit"},
  ])
  
  const [optionsPeroid, setOptionsPeroid] = useState<Array<Options>>([
    { value: 3, label: '3'  },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' }
  ])

  async function confirmRenting() {
    setisLoading(true)
    const hash: string = await contractStore.transferEther(props.land.ownerUserTokenId.userTokenId, props.land.price)
    if (hash) {
      const body: AddLandRentRequestModel = {
        landTokenId: props.land.landTokenId.landTokenId,
        rentType: props.land.rentType.rentTypeId!,
        periodType: periodType?.value!,
        period: period.value!,
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

  const mapPeriodTypesToOption = ():Array<ReactSelectOptionModel> => {
    const options: Array<ReactSelectOptionModel> = new Array<ReactSelectOptionModel>()
    optionsPeroidType.forEach((type) => {
        const reactSelectOption: ReactSelectOptionModel = new ReactSelectOptionModel()
        reactSelectOption.label = type.label
        reactSelectOption.value = type.value
        options.push(reactSelectOption)
    })
    return options
  }

  const mapPeriodToOption = ():Array<ReactSelectOptionModel> => {
    const options: Array<ReactSelectOptionModel> = new Array<ReactSelectOptionModel>()
    optionsPeroid.forEach((period) => {
        const reactSelectOption: ReactSelectOptionModel = new ReactSelectOptionModel()
        reactSelectOption.label = period.label
        reactSelectOption.value = period.value
        options.push(reactSelectOption)
    })
    return options
  }

  const mapEventPeriodTypesToOption = (e:ReactSelectOptionModel): void => {
    const reactSelectOption: ReactSelectOptionModel = e
    let newPeriodType = new ReactSelectOptionModel
    newPeriodType!.label = reactSelectOption.label
    newPeriodType!.value = reactSelectOption.value
    setPeriodType(newPeriodType)
  }

  const mapEventPeriodToOption = (e:ReactSelectOptionModel): void => {
    const reactSelectOption: ReactSelectOptionModel = e
    let newPeriod = new ReactSelectOptionModel
    newPeriod!.label = reactSelectOption.label
    newPeriod!.value = reactSelectOption.value
    setPeriod(newPeriod)
    if(props.land.rentType.rentTypeId === 2) {
      let month = new ReactSelectOptionModel
      month.label = reactSelectOption.label
      month.value = reactSelectOption!.value! * 30
      setPeriod(month)
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
            <p className="label-name">Period Type</p>
            <Select options={mapPeriodTypesToOption()} onChange={(e) => mapEventPeriodTypesToOption(e as ReactSelectOptionModel)} />
          </div>
          <div className="name-input-div">
            <p className="label-name">Peroid</p>
            {console.log("rentType"+props.land.rentType.rentTypeId+"period"+period.value)}
            <Select options={mapPeriodToOption()} onChange={(e) => mapEventPeriodToOption(e as ReactSelectOptionModel) } isDisabled={periodType?.value === 2} />
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
