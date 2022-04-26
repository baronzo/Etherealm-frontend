import React from "react";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import './ModalOfferList.scss'

type Props = {
  setIsShowModalOfferList: (value: boolean) => void
  land: LandModel
};

export default function ModalOfferList(props: Props) {
  return (
    <div id="modalOfferList">
      <div id="editPriceBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Offer : {props.land.landName}</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalOfferList(false)}
          />
        </div>
      </div>
    </div>
  );
}
