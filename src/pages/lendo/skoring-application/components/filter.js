import React, { useState, useEffect, useContext, useCallback } from 'react'

import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownItem,
} from 'reactstrap'
import Select from 'react-select'

import {
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from '../../../../components/Component'
import { LendoContext, Loader } from '../../LendoContext'
import { filterDatas, sortDatas, filterStatus, filterCardType } from './default'
import { useCookies } from 'react-cookie'
import { useSessionStorage } from 'usehooks-ts'

const FilterApplication = ({ filterSubmit, resetSubmit }) => {
  const { contextData } = useContext(LendoContext)
  const [data, setData] = contextData

  const [filter, setFilter] = useSessionStorage(
    'lendoSkoringApplicationFilter',
    { ...filterDatas }
  )
  const [sort, setSort] = useSessionStorage('lendoSkoringApplicationSort', [
    ...sortDatas,
  ])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const resetForm = () => {
    setFilter({ ...filterDatas, itemPerPage: filter.itemPerPage })
    resetSubmit()
    setDropdownOpen(false)
  }
  const onFormChange = (e) => {
    setFilter({ ...filter, [e.target?.name]: e.target.value })
    console.log(filter)
  }
  // submit function to add a new item
  const onFormSubmit = useCallback(() => {
    filterSubmit({ filters: filter, sorts: sort })
    setDropdownOpen(false)
  }, [filter])

  return (
    <React.Fragment>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="a"
          className="btn btn-trigger btn-icon dropdown-toggle"
        >
          <div className="dot dot-primary"></div>
          <Icon name="filter-alt"></Icon>
        </DropdownToggle>
        <DropdownMenu
          end
          className="filter-wg "
          style={{
            overflow: 'visible',
            width: '70vw',
          }}
        >
          <div className="dropdown-head">
            <span className="sub-title dropdown-title">Filter Application</span>
            <div>
              <Button
                style={{ marginRight: 20 }}
                onClick={() => {
                  resetForm()
                }}
              >
                Reset Filter
              </Button>
              <Button onClick={() => onFormSubmit()} color="secondary">
                Filter
              </Button>
            </div>
          </div>
          <div className="dropdown-body dropdown-body-rg">
            <Row className="gx-6 gy-3">
              {Object.keys(filter)
                .filter((e) => e != 'itemPerPage')
                .map((el, index) => {
                  if (el === 'cardType' || el === 'state') {
                    return (
                      <Col key={index} lg="4" md="6" sm="12">
                        <div className="form-group">
                          <label className="overline-title overline-title-alt">
                            {el.replace(/([a-z])([A-Z])/g, '$1 $2')}
                          </label>
                          <RSelect
                            name={el}
                            defaultValue={{
                              value: filter[el],
                              label: filter[el],
                            }}
                            onChange={(e) => {
                              setFilter({ ...filter, [el]: e.label })
                            }}
                            options={
                              el === 'cardType' ? filterCardType : filterStatus
                            }
                          />
                        </div>
                      </Col>
                    )
                  } else {
                    return (
                      <Col key={index} lg="4" md="6" sm="12">
                        <label className="overline-title overline-title-alt">
                          {el.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </label>
                        <input
                          defaultValue={filter[el]}
                          onChange={onFormChange}
                          name={el}
                          className="form-control form-control-md"
                        />
                      </Col>
                    )
                  }
                })}
              {/* <Col size="6">
                <label className="overline-title overline-title-alt">
                  Name
                </label>
                <input
                  defaultValue={filter?.name}
                  onChange={onFormChange}
                  name="name"
                  className="form-control form-control-lg"
                />
              </Col>
              <Col size="6">
                <label className="overline-title overline-title-alt">
                  Phone
                </label>
                <input
                  defaultValue={filter?.phone}
                  onChange={onFormChange}
                  name="phone"
                  className="form-control form-control-lg"
                />
              </Col>
              <Col size="6">
                <label className="overline-title overline-title-alt">
                  Pinfl
                </label>
                <input
                  defaultValue={filter?.pinfl}
                  onChange={onFormChange}
                  name="pinfl"
                  className="form-control form-control-lg"
                />
              </Col>
              <Col size="6">
                <label className="overline-title overline-title-alt">
                  Card Number
                </label>
                <input
                  defaultValue={filter?.card_number}
                  onChange={onFormChange}
                  name="cardNumber"
                  className="form-control form-control-lg"
                />
              </Col>
              <Col size="6">
                <label className="overline-title overline-title-alt">
                  Passport
                </label>
                <input
                  defaultValue={filter?.documentNumber}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      documentNumber: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  name="documentNumber"
                  className="form-control form-control-lg"
                />
              </Col>

              <Col size="6">
                <div className="form-group">
                  <label className="overline-title overline-title-alt">
                    Card Type
                  </label>
                  <RSelect
                    name="card_type"
                    defaultValue={filter?.card_type}
                    onChange={(e) => setFilter({ ...filter, cardType: e })}
                    options={filterCardType}
                    placeholder="Card Type"
                  />
                </div>
              </Col>
              <Col size="6">
                <div className="form-group">
                  <label className="overline-title overline-title-alt">
                    Status
                  </label>
                  <RSelect
                    name="status"
                    defaultValue={filter?.status}
                    onChange={(e) => setFilter({ ...filter, status: { ...e } })}
                    options={filterStatus}
                    placeholder="Any Status"
                  />
                </div>
              </Col> */}
            </Row>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}
export default FilterApplication
