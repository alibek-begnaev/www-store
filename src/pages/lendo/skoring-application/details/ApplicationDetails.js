import React, { useCallback, useContext, useEffect, useState } from 'react'
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
import { notes } from '../../../pre-built/user-manage/UserData'
import ScoringDetails from './ScoringDetails'
import { dataInstance2 } from '../../../../utils/axios'
import KatmDetails from './KatmDetails'
import CardDetails from './CardDetails'
import TaxDetails from './TaxDetails'
import ErrorModal from '../../../pre-built/user-manage/ErrorModal'
import RequestDetails from './RequestDetails'

const ApplicationDetails = () => {
  const { contextData } = useContext(LendoContext)
  const [data, setData] = contextData
  const [errorMessage, setErrorMessage] = useState()
  const [scoringData, setScoringData] = useState()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('scoring')
  const [modal, setModal] = useState({
    error: false,
    add: false,
  })
  const openTab = (tabName) => {
    setActiveTab(tabName)
  }
  let { appId } = useParams()

  const fetchData = () => {
    const id = appId
    dataInstance2
      .get('/scoring-by-id/' + id)
      .then((res) => {
        setScoringData(res?.data?.done)
        console.log(res?.data.error?.message)
        if (res?.data.error?.message) {
          setErrorMessage(res?.data.error?.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const closeErrorModal = () => {
    setModal({ error: false })
    navigate(-1)
  }
  useEffect(() => {
    console.log('run3')
    if (errorMessage) {
      setModal({ error: true })
      console.log('run2')
    }
  }, [errorMessage])
  // grabs the id of the url and loads the corresponding data
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users / <strong className="text-primary small"></strong>
              </BlockTitle>
              <BlockDes className="text-soft">
                <ul className="list-inline">
                  <li>
                    User ID: <span className="text-base">{appId}</span>
                  </li>
                  <li>
                    Last Login: <span className="text-base">01:02 PM</span>
                  </li>
                </ul>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button
                color="light"
                outline
                className="bg-white d-none d-sm-inline-flex"
                onClick={() => navigate(-1)}
              >
                <Icon name="arrow-left"></Icon>
                <span>Back</span>
              </Button>
              <a
                href="#back"
                onClick={(ev) => {
                  ev.preventDefault()
                  navigate(-1)
                }}
                className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
              >
                <Icon name="arrow-left"></Icon>
              </a>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <div className="card-aside-wrap" id="user-detail-block">
              <div className="card-content" style={{ width: '100%' }}>
                <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'scoring' ? 'active' : ''
                      }`}
                      onClick={() => openTab('scoring')}
                    >
                      <Icon name="user-circle"></Icon>
                      <span>Scoring</span>
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'card' ? 'active' : ''
                      }`}
                      onClick={() => openTab('card')}
                    >
                      <Icon name="file-text"></Icon>
                      <span>Card</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'katm' ? 'active' : ''
                      }`}
                      onClick={() => openTab('katm')}
                    >
                      <Icon name="repeat"></Icon>
                      <span>Katm</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'tax' ? 'active' : ''
                      }`}
                      onClick={() => openTab('tax')}
                    >
                      <Icon name="bell"></Icon>
                      <span>Taxes</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'activities' ? 'active' : ''
                      }`}
                      onClick={() => openTab('activities')}
                    >
                      <Icon name="activity"></Icon>
                      <span>Activities</span>
                    </button>
                  </li>
                </ul>
                {activeTab === 'scoring' && (
                  <ScoringDetails user={scoringData} />
                )}
                {activeTab === 'card' && (
                  <CardDetails data={scoringData?.card} />
                )}
                {activeTab === 'katm' && (
                  <KatmDetails data={scoringData?.katm} />
                )}
                {activeTab === 'tax' && <TaxDetails data={scoringData?.tax} />}
                {activeTab === 'activities' && (
                  <RequestDetails title="JSON View" appId={appId} />
                )}
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={modal.error} toggle={closeErrorModal}>
          <ModalBody className="modal-body-lg text-center">
            <div className="nk-modal">
              <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-cross bg-danger"></Icon>
              <h4 className="nk-modal-title">Unable to Process!</h4>
              <div className="nk-modal-text">
                <p className="lead">{errorMessage}</p>
              </div>
              <div className="nk-modal-action mt-5">
                <Button
                  color="light"
                  size="lg"
                  className="btn-mw"
                  onClick={closeErrorModal}
                >
                  Return
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  )
}
export default ApplicationDetails
