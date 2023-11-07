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
import { sortDatas, filterDatas, sortOptions } from './default'
import { useSessionStorage } from 'usehooks-ts'

const SortApplication = ({ filterSubmit, resetSubmit, datas }) => {
  const [sort, setSort] = useSessionStorage('lendoSkoringApplicationSort', [
    ...sortDatas,
  ])
  const [filter, setFilter] = useSessionStorage(
    'lendoSkoringApplicationFilter',
    { ...filterDatas }
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const resetForm = () => {
    console.log('sortData1: ', sortDatas)
    setSort(sortDatas)
    resetSubmit()
    setDropdownOpen(false)
  }

  const onSelectChange = (e, index) => {
    let newData = JSON.parse(JSON.stringify(sort))
    newData[index].checked = e.currentTarget.checked

    if (e.currentTarget.checked) {
      newData[index].orderNum =
        newData.filter((e) => !!e.orderNum === true).length + 1
    } else {
      newData
        .filter((e) => newData[index].orderNum < e.orderNum)
        .forEach((item) => (item.orderNum -= 1))
      newData[index].orderNum = ''
    }
    setSort([...newData])
  }
  const orderChange = (e, index) => {
    let newData = sort
    newData[index].order = e.label
    setSort([...newData])
  }
  const onFormSubmit = () => {
    filterSubmit({ filters: filter, sorts: sort })

    setDropdownOpen(false)
  }

  return (
    <React.Fragment>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="a"
          className="btn btn-trigger btn-icon dropdown-toggle"
        >
          <Icon name="setting"></Icon>
        </DropdownToggle>
        <DropdownMenu
          end
          className="filter-wg dropdown-menu-xl"
          style={{ overflow: 'auto' }}
        >
          <div className="dropdown-head">
            <span className="sub-title dropdown-title">Sort Application</span>
            <div>
              <Button
                style={{ marginRight: 20 }}
                onClick={() => {
                  resetForm()
                }}
              >
                Reset Sort
              </Button>
              <Button onClick={() => onFormSubmit()} color="secondary">
                Sort
              </Button>
            </div>
          </div>
          <div
            className="dropdown-body dropdown-body-rg "
            style={{ overflow: 'auto', height: 800, width: '100%' }}
          >
            {sort &&
              sort.map((el, index) => {
                return (
                  <Row key={index} className="g-2 py-1">
                    <Col sm="1">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          defaultChecked={el.checked}
                          id={el?.className + 'uid1'}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, index)}
                        />
                        <label
                          className="custom-control-label "
                          htmlFor={el?.className + 'uid1'}
                        ></label>
                      </div>
                    </Col>
                    <Col sm="7">
                      <label className="overline-title-alt">
                        {el.className.replace(/([a-z])([A-Z])/g, '$1 $2')}
                      </label>
                    </Col>
                    <Col sm="4">
                      <RSelect
                        name={el.className}
                        className="w-100%"
                        defaultValue={{
                          value: el.order,
                          label: el.order,
                        }}
                        onChange={(e) => {
                          orderChange(e, index)
                        }}
                        options={sortOptions}
                      />
                    </Col>
                  </Row>
                )
              })}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}
export default SortApplication
