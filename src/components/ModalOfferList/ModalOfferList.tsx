import React from "react";
import { FaHandPointer, FaEthereum, FaCopy, FaCheck, FaTimes } from "react-icons/fa";
import { MdOutlineWarningAmber } from "react-icons/md";
import { MdClose } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import "./ModalOfferList.scss";

type Props = {
  setIsShowModalOfferList: (value: boolean) => void;
  land: LandModel;
};

export default function ModalOfferList(props: Props) {
  return (
    <div id="modalOfferList">
      <div id="offerBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Offer : {props.land.landName}</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalOfferList(false)}
          />
        </div>
        <div className="sortby-div">
          <p className="sort-by-label">Sort by</p>
          <select className=" select-fillter">
            <option value="High">High offer price</option>
            <option value="Low">Low offer price</option>
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
        </select>
        </div>
        <div className="show-offer-list">
          <div className="offer-item">
            <div className="order-div">
              <p className="order">1</p>
            </div>
            <div className="profile-div">
              <div className="profile-box" >
                <div className="image-box">
                  <img
                    className="profile-image"
                    src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg"
                    alt=""
                  />
                </div>
                <div className="detail-profile">
                  <div className="name">
                    Anicha
                  </div>
                  <div className="box">
                    <div className="token-id">0xcc896c2cdd10aasderhdfgsdfbdsfsdfdfsdf</div>
                    <button className="copy">
                      <FaCopy className="copy-icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="offer-price-div">
              <p className="offer-price-label">Offer price:</p>
              <div className="offer-price">
                <FaEthereum className="ether-icon"/>
                <p className="price-text">9999 ETH</p>
              </div>
            </div>
            <div className="button-select-div">
              {/* <button className="button-select">
                <FaHandPointer className="hand-icon"/>
                Select this Offer
              </button>
              <div className="warning-div">
                <MdOutlineWarningAmber className="icon-warning"/>
                <p className="warning-text">This user not enough point</p>
              </div> */}
              <button className="button-select-confirm">
                <FaCheck className="icon"/>
                Confirm this offer
              </button>
              <button className="button-select-cancel">
                <FaTimes className="icon"/>
                Cancel this Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
