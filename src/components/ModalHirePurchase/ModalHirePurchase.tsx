import React, { useState } from "react";
import "./ModalHirePurchase.scss";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";

type Props = {
  landDetails: LandModel;
  setIsShowModalHirePurchase: (value: boolean) => void
};

export default function ModalHirePurchase(props: Props) {
  const [isLoading, setisLoading] = useState<boolean>(false);

  return (
    <div id="hirePurchaseBox">
      <div className="topic-label-div">
        <div className="topic">
          <p className="topic-label-text">Edit Price</p>
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
          <p className="label-name">Price(ETH)</p>
          <input className="name-input" type="number" />
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
              <p className="fee-label-text">You will receive</p>
            </div>
            <div className="fee-value">
              <p className="fee-value-text"> ETH</p>
            </div>
          </div>
        </div>
      </div>
      <div className="button-save-div">
        {!isLoading ? (
          <button className="button-save" onClick={() => {}}>
            Save
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
