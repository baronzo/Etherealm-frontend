import React, { useEffect, useState } from "react";
import "./ModalHirePurchase.scss";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import Select from 'react-select'
import HirePurchaseService from "../../services/hirePurchase/HirePurchaseService";
import HirePurchasePostRequestModel from "../../models/hirePurchase/HirePurchasePostRequestModel";
import ReactSelectOptionModel from "../../models/reactSelect/ReactSelectOptionModel";
import HirePurchasePostResponseModel from "../../models/hirePurchase/HirePurchasePostResponseModel";

type Props = {
  landDetails: LandModel;
  setIsShowModalHirePurchase: (value: boolean) => void
};

interface Options {
  value: number | undefined;
  label: string | undefined;
}

export default function ModalHirePurchase(props: Props) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const hirePurchaseService = new HirePurchaseService()
  const [period, setPeriod] = useState<Options>({value: 2, label: '2'})
  const [platformFees, setPlatformFees] = useState<number>(0)
  const [interest, setInterest] = useState<number>(0)
  const [pay, setPay] = useState<number>(0)
  const [fees, setFees] = useState<number>(0)
  const [checked, setChecked] = useState<boolean>(false); 
  const [monthly, setMonthly] = useState<number>(0)

  const [optionsPeroid, setOptionsPeroid] = useState<Array<Options>>([
    { value: 2, label: '2' },
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
  ])

  useEffect(() => {
    console.log(props.landDetails)
    calculate()
  }, [period.value])


  const mapPeriodToOption = (): Array<ReactSelectOptionModel> => {
    const options: Array<ReactSelectOptionModel> = new Array<ReactSelectOptionModel>()
    optionsPeroid.forEach((period) => {
      const reactSelectOption: ReactSelectOptionModel = new ReactSelectOptionModel()
      reactSelectOption.label = period.label
      reactSelectOption.value = period.value
      options.push(reactSelectOption)
    })
    return options
  }

  const mapEventPeriodToOption = (e: ReactSelectOptionModel): void => {
    const reactSelectOption: ReactSelectOptionModel = e
    let newPeriod = new ReactSelectOptionModel
    newPeriod!.label = reactSelectOption.label
    newPeriod!.value = reactSelectOption.value
    setPeriod(newPeriod)
  }

  async function postHirePuechaseLand(): Promise<void> {
    setisLoading(true)
    const bodyRequest: HirePurchasePostRequestModel = {
      hash: '0x9f526330448a8343a39969b0635ec589b3e7be46c4e9896856f5614c13c6041e',
      landTokenId: props.landDetails.landTokenId!,
      period: period.value! * 30,
      price: 1
      // fees: fees
    }
    if(checked) {
      console.log(bodyRequest)
      const hirePuechaseResponse: HirePurchasePostResponseModel = await hirePurchaseService.postHirePurchaseLand(bodyRequest)
      if (hirePuechaseResponse) {
        console.log(hirePuechaseResponse)
        setisLoading(false)
        props.setIsShowModalHirePurchase(false)
        window.location.reload()
      }
    }
  }

  async function confirmHirePurchase() {
    await postHirePuechaseLand()
  }

  const calculate = ():void => {
    let willPay: number = 0
    let monthlyPay: number = props.landDetails.price! / period.value!
    setMonthly(monthly)
    let platform: number = monthlyPay * 0.25
    let interest: number = monthlyPay * 0.01
    let fees: number = platform + interest
    if (period.value! <= 3) {
      willPay = monthlyPay + platformFees
      setInterest(0)
      setPay(willPay)
    }
    willPay = monthlyPay + platformFees + interest
    setFees(fees)
    setPlatformFees(platform)
    setInterest(interest)
    setPay(willPay)
  }

  const handleChange = ():void => { 
    setChecked(!checked); 
  }; 

  return (
    <div id="hirePurchaseBox">
      <div className="topic-label-div">
        <div className="topic">
          <p className="topic-label-text">Hire Purchase</p>
        </div>
        <MdClose className="close-icon" onClick={() => props.setIsShowModalHirePurchase(false)} />
      </div>
      <div className="image-upload-or-link">
        <div className="image-div">
          <img
            className="image-profile"
            src={props.landDetails.landAssets? props.landDetails.landAssets: "/map.jpg"}
            alt=""
          />
        </div>
        <p className="text-land-name">{props.landDetails.landName}</p>
      </div>
      <div className="name-description">
        <div className="name-input-div">
          <p className="label-name">Period(Month)</p>
          <Select value={period} options={(mapPeriodToOption())} onChange={(e) => mapEventPeriodToOption(e as ReactSelectOptionModel)} />
        </div>
        <div className="fee-div">
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">Platform Fee (2.5%)</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text">{platformFees} ETH</p>
            </div>
          </div>
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">Interest (1%)</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text">{interest} ETH</p>
            </div>
          </div>
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">You will pay</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text">{pay} ETH / Month</p>
            </div>
          </div>
        </div>
      </div>
      <div className="checkbox">
        <div className="checkbox-div">
          <input className="checkbox-icon" type="checkbox" onChange={handleChange}/>
          <p className="accept">Accept the terms of use</p>
        </div>
      </div>
      <div className="button-save-div">
        {!isLoading ? (
          <button className="button-save" onClick={() => confirmHirePurchase()}>
            Confirm
          </button>
        ) : (
          <button className="button-save">
            <i className="fas fa-spinner fa-spin"></i>
          </button>
        )}
      </div>
    </div>
  );
}
