import React, { useState } from "react";
import "./ModalHirePurchase.scss";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import Select from 'react-select'

type Props = {
  landDetails: LandModel;
  setIsShowModalHirePurchase: (value: boolean) => void
};

interface Options {
  value: number,
  label: string
}

export default function ModalHirePurchase(props: Props) {
  const [isLoading, setisLoading] = useState<boolean>(false);

  const options: Array<Options> = [
    { value: 1, label: '1' },
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
  ]

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
            src={
              props.landDetails.landAssets
                ? props.landDetails.landAssets
                : "/map.jpg"
            }
            alt=""
          />
        </div>
        <p className="text-land-name">{props.landDetails.landName}</p>
      </div>
      <div className="name-description">
        <div className="name-input-div">
          <p className="label-name">Period(Month)</p>
          <select name="selectPeriod" id="selectPeriod" className="input-select">
            {options.map((item: Options) => {
              return(
                <option key={item.value} value={item.value}>{item.label}</option>
              )
            })}
          </select>
        </div>
        <div className="fee-div">
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">Platform Fee (2.5%)</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text"> ETH</p>
            </div>
          </div>
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">Platform Fee (2.5%)</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text"> ETH</p>
            </div>
          </div>
          <div className="fee-item">
            <div className="fee-label">
              <p className="fee-label-text">You will receive</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text"> ETH</p>
            </div>
          </div>
        </div>
      </div>
      <div className="checkbox">
        <div className="checkbox-div">
          <input className="checkbox-icon" type="checkbox"/>
          <p className="accept">Accept the terms of use</p>
          </div>
      </div>
      <div className="button-save-div">
        {!isLoading ? (
          <button className="button-save" onClick={() => {}}>
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
