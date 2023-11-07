import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Content from '../../../../layout/content/Content'
import Head from '../../../../layout/head/Head'
import { Card, Modal, ModalBody, Badge } from 'reactstrap'
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Row,
  OverlineTitle,
  Sidebar,
  UserAvatar,
} from '../../../../components/Component'
import { useNavigate } from 'react-router-dom'
import {
  currentTime,
  findUpper,
  monthNames,
  todaysDate,
} from '../../../../utils/Utils'
import { LendoContext } from '../../LendoContext'

const ScoringDetails = ({ user }) => {
  return (
    <div className="card-inner">
      <Block>
        <BlockHead>
          <BlockTitle tag="h5"> Information</BlockTitle>
          {/* <p>
            Basic info, like your name and address, that you use on Nio
            Platform.
          </p> */}
        </BlockHead>

        <div className="profile-ud-list">
          {user &&
            Object.keys(user)
              .filter(
                (el) =>
                  el !== 'katm' &&
                  el !== 'card' &&
                  el !== 'tax' &&
                  el !== 'stop_katm' &&
                  el !== 'stop_card' &&
                  el !== 'stop_tax'
              )
              .map((el, index) => (
                <div key={index} className="profile-ud-item">
                  <div className="profile-ud wider">
                    <span className="profile-ud-label">
                      {el
                        .split('_')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </span>
                    <span className="profile-ud-value">{user[el]}</span>
                  </div>
                </div>
              ))}

          {/* <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Full Name</span>
              <span className="profile-ud-value">
                {user?.average_monthly_payment}
              </span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Date of Birth</span>
              <span className="profile-ud-value">{user?.card_month}</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Surname</span>
              <span className="profile-ud-value">{user?.state}</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Mobile Number</span>
              <span className="profile-ud-value">{user?.limit_amount}</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Email Address</span>
              <span className="profile-ud-value">{user?.message}</span>
            </div>
          </div> */}
        </div>
      </Block>

      {/* <Block>
        <BlockHead className="nk-block-head-line">
          <BlockTitle tag="h6" className="overline-title text-base">
            Additional Information
          </BlockTitle>
        </BlockHead>
        <div className="profile-ud-list">
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Joining Date</span>
              <span className="profile-ud-value">08-16-2018 09:04PM</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Reg Method</span>
              <span className="profile-ud-value">Email</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Country</span>
              <span className="profile-ud-value">{user?.country}</span>
            </div>
          </div>
          <div className="profile-ud-item">
            <div className="profile-ud wider">
              <span className="profile-ud-label">Nationality</span>
              <span className="profile-ud-value">{user?.country}</span>
            </div>
          </div>
        </div>
      </Block> */}
    </div>
  )
}
export default ScoringDetails
